import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { resolveInstruments } from "@/lib/instrument-utils";

const BASE_ID = "app1l4NwAMtwlTIUC";
const TABLE_ID = process.env.AIRTABLE_ELEV_TABLE_ID ?? "";
const META_PIXEL_ID = "835715892143915";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

const toStartCase = (s: string) =>
  s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      console.error("AIRTABLE_API_KEY not set");
      return NextResponse.json({ success: false, error: "Configuration error" }, { status: 500 });
    }

    if (!TABLE_ID) {
      console.error("AIRTABLE_ELEV_TABLE_ID not set");
      return NextResponse.json({ success: false, error: "Configuration error" }, { status: 500 });
    }

    // Resolve instruments per child and collect all unique instruments
    const children = (data.children ?? []).map((child: {
      name: string;
      birthYear: string;
      grade: string;
      instruments: string[];
      instrumentOther: string;
    }) => ({
      ...child,
      instruments: resolveInstruments(child.instruments ?? [], child.instrumentOther ?? ""),
    }));

    const allInstruments = Array.from(
      new Set(children.flatMap((c: { instruments: string[] }) => c.instruments))
    );

    const fields: Record<string, unknown> = {
      Namn: toStartCase((data.guardianName ?? "").trim()),
      Instrument: allInstruments,
      Kontaktuppgifter: JSON.stringify({
        email: (data.email ?? "").trim().toLowerCase(),
        telefon: (data.phone ?? "").trim(),
        adress: toStartCase((data.address ?? "").trim()),
        postnummer: (data.postalCode ?? "").trim(),
        ort: toStartCase((data.city ?? "").trim()),
      }),
      Barn: JSON.stringify(children),
      Övrigt: JSON.stringify({
        kommentar: (data.comment ?? "").trim(),
        instrumentHemma: data.instrumentAtHome ?? "",
        forväntningar: Array.isArray(data.expectations) ? data.expectations : [],
        frekvens: data.frequency ?? "",
        lektionslängd: data.lessonLength ?? "",
        startpreferens: data.startPreference ?? "",
      }),
      UTM: JSON.stringify({
        source: data.meta?.utmSource ?? null,
        medium: data.meta?.utmMedium ?? null,
        campaign: data.meta?.utmCampaign ?? null,
        term: data.meta?.utmTerm ?? null,
        content: data.meta?.utmContent ?? null,
        referrer: data.meta?.referrer ?? "",
        referralCode: data.meta?.referralCode ?? null,
      }),
    };

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Airtable error:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const airtableRecord = await response.json();
    const recordId: string = airtableRecord.id;

    const geocodeToken = process.env.GEOCODE_API_TOKEN;
    if (geocodeToken && recordId) {
      const address = `${toStartCase((data.address ?? "").trim())}, ${(data.postalCode ?? "").trim()} ${toStartCase((data.city ?? "").trim())}`;
      fetch("https://geocode-126597579756.europe-west1.run.app", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${geocodeToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "Elevanmälningar",
          record_id: recordId,
          address,
        }),
      }).catch((err) => console.error("Geocoding error:", err));
    }

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
