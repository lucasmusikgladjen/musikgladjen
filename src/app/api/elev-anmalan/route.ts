import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { resolveInstruments } from "@/lib/instrument-utils";

const BASE_ID = "app1l4NwAMtwlTIUC";
const ELEV_TABLE_ID = "tblAj4VVugqhdPWnR";
const VARDNADSHAVARE_TABLE_ID = "tblfYUEqhO9gtSQMh";
const META_PIXEL_ID = "835715892143915";
const EMAIL_WEBHOOK_URL = "https://hook.eu1.make.com/zis8yskrx6r5kejrp1abqhygt6eud54p";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

const toStartCase = (s: string) =>
  s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

function splitAddress(address: string): { gata: string; gatunummer: string } {
  const match = address.trim().match(/^(.+?)\s+(\d+\S*)$/);
  if (match) return { gata: toStartCase(match[1].trim()), gatunummer: match[2].trim() };
  return { gata: toStartCase(address.trim()), gatunummer: "" };
}

function mapStartPreference(v: string): string {
  if (v === "next_term") return "Nästa termin";
  return "Så snart som möjligt";
}

async function airtablePost(apiKey: string, tableId: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable error (${tableId}): ${err}`);
  }
  return res.json() as Promise<{ id: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      console.error("AIRTABLE_API_KEY not set");
      return NextResponse.json({ success: false, error: "Configuration error" }, { status: 500 });
    }

    // 1. Create one Elev record per child
    const elevRecordIds: string[] = [];
    for (const child of data.children ?? []) {
      const instruments = resolveInstruments(child.instruments ?? [], child.instrumentOther ?? "");
      const elevRecord = await airtablePost(apiKey, ELEV_TABLE_ID, {
        Förnamn: toStartCase((child.name ?? "").trim()),
        Instrument: instruments,
        Födelseår: (child.birthYear ?? "").trim(),
        "Kort om eleven (från anmälan)": child.grade ? `Årskurs: ${child.grade}` : "",
      });
      elevRecordIds.push(elevRecord.id);
    }

    // 2. Create Vårdnadshavare record linked to all Elev records
    const { gata, gatunummer } = splitAddress(data.address ?? "");
    const firstChildName = toStartCase(((data.children?.[0]?.name) ?? "").trim().split(" ")[0]);

    const vardnaFields: Record<string, unknown> = {
      Namn: toStartCase((data.guardianName ?? "").trim()),
      Elevnamn: firstChildName || undefined,
      Gata: gata,
      Gatunummer: gatunummer || undefined,
      Ort: toStartCase((data.city ?? "").trim()),
      Postnummer: (data.postalCode ?? "").trim(),
      "E-post": (data.email ?? "").trim().toLowerCase(),
      Telefon: (data.phone ?? "").trim(),
      "Hur snart vill ni komma igång": data.startPreference
        ? mapStartPreference(data.startPreference)
        : undefined,
      "Tillgång till instrument": data.instrumentAtHome || undefined,
      "Vad hoppas ni fått ut av undervisning": Array.isArray(data.expectations) && data.expectations.length > 0
        ? data.expectations
        : undefined,
      "Något annat vi bör veta?": (data.comment ?? "").trim() || undefined,
      "Anmälningskommentar (intern)": JSON.stringify({
        utmSource: data.meta?.utmSource ?? null,
        utmMedium: data.meta?.utmMedium ?? null,
        utmCampaign: data.meta?.utmCampaign ?? null,
        utmTerm: data.meta?.utmTerm ?? null,
        utmContent: data.meta?.utmContent ?? null,
        referrer: data.meta?.referrer ?? "",
        referralCode: data.meta?.referralCode ?? null,
      }),
    };

    if (elevRecordIds.length > 0) {
      vardnaFields["Elev"] = elevRecordIds.map((id) => ({ id }));
    }

    const vardnaRecord = await airtablePost(apiKey, VARDNADSHAVARE_TABLE_ID, vardnaFields);

    // 3. Back-link Elev records to Vårdnadshavare
    for (const elevId of elevRecordIds) {
      await fetch(`https://api.airtable.com/v0/${BASE_ID}/${ELEV_TABLE_ID}/${elevId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { Vårdnadshavare: [{ id: vardnaRecord.id }] } }),
      });
    }

    // 4. Trigger email module
    fetch(EMAIL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: "elev-anmalan",
        vardnadshavareId: vardnaRecord.id,
        elevIds: elevRecordIds,
        email: (data.email ?? "").trim().toLowerCase(),
        name: toStartCase((data.guardianName ?? "").trim()),
      }),
    }).catch((err) => console.error("Email webhook error:", err));

    // 5. Geocoding (fire-and-forget)
    const geocodeToken = process.env.GEOCODE_API_TOKEN;
    if (geocodeToken) {
      const fullAddress = `${gata}${gatunummer ? ` ${gatunummer}` : ""}, ${(data.postalCode ?? "").trim()} ${toStartCase((data.city ?? "").trim())}`;
      fetch("https://geocode-126597579756.europe-west1.run.app", {
        method: "POST",
        headers: { Authorization: `Bearer ${geocodeToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "Vårdnadshavare",
          record_id: vardnaRecord.id,
          address: fullAddress,
        }),
      }).catch((err) => console.error("Geocoding error:", err));
    }

    // 6. Meta CAPI Lead event
    const accessToken = process.env.META_ACCESS_TOKEN;
    if (accessToken) {
      try {
        const nameParts = (data.guardianName ?? "").trim().split(/\s+/);
        const firstName = nameParts[0] ?? "";
        const lastName = nameParts.slice(1).join(" ");
        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
          req.headers.get("x-real-ip") ??
          undefined;

        const capiRes = await fetch(
          `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${accessToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: [{
                event_name: "Lead",
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_id: data.eventId,
                event_source_url: data.eventSourceUrl,
                user_data: {
                  em: data.email ? [sha256(data.email)] : undefined,
                  ph: data.phone ? [sha256(data.phone.replace(/\D/g, ""))] : undefined,
                  fn: firstName ? [sha256(firstName)] : undefined,
                  ln: lastName ? [sha256(lastName)] : undefined,
                  zp: data.postalCode ? [sha256(data.postalCode)] : undefined,
                  ct: data.city ? [sha256(data.city)] : undefined,
                  country: [sha256("se")],
                  external_id: data.email ? [sha256(data.email)] : undefined,
                  client_ip_address: ip,
                  client_user_agent: req.headers.get("user-agent") ?? undefined,
                  fbp: data.fbp,
                  fbc: data.fbc,
                },
              }],
            }),
          }
        );
        if (!capiRes.ok) {
          const capiError = await capiRes.text();
          console.error("Meta CAPI error:", capiRes.status, capiError);
        }
      } catch (err) {
        console.error("Meta CAPI error:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
