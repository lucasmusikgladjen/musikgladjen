import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const BASE_ID = "app1l4NwAMtwlTIUC";
const TABLE_ID = "tblnJd5fEqh2qXC2R";
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

    const instrumentArray = [
      ...data.instruments.filter((i: string) => i !== "Annat"),
      ...(data.instruments.includes("Annat") && data.instrumentOther
        ? [data.instrumentOther.trim()]
        : []),
    ];

    const areasStr = Array.isArray(data.areas)
      ? data.areas.map((a: string) => toStartCase(a.trim())).join(", ")
      : toStartCase(data.areas.trim());

    const fields: Record<string, unknown> = {
      Namn: toStartCase(data.name.trim()),
      Födelseår: data.birthYear,
      Instrument: instrumentArray,
      Kontaktuppgifter: JSON.stringify({
        email: data.email.trim().toLowerCase(),
        telefon: data.phone.trim(),
        adress: toStartCase(data.address.trim()),
        postnummer: data.postnummer.trim(),
        ort: toStartCase(data.city.trim()),
      }),
      Erfarenheter: JSON.stringify({
        musikerfarenheter: data.musicExperience.trim(),
        erfarenheterMedBarn: data.childrenExperience.trim(),
      }),
      Övrigt: JSON.stringify({
        undervisningsomraden: areasStr,
        antalElever: data.studentCount,
        vadVillDuHaUtAvJobbet: Array.isArray(data.motivations) ? data.motivations : [],
        hurHittadeJobbet: data.howFound,
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
      const address = `${toStartCase(data.address.trim())}, ${data.postnummer.trim()} ${toStartCase(data.city.trim())}`;
      fetch("https://geocode-126597579756.europe-west1.run.app", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${geocodeToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "Jobbansökningar",
          record_id: recordId,
          address,
        }),
      }).catch((err) => console.error("Geocoding error:", err));
    }

    const accessToken = process.env.META_ACCESS_TOKEN;
    if (accessToken) {
      try {
        const nameParts = (data.name ?? "").trim().split(/\s+/);
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
                  zp: data.postnummer ? [sha256(data.postnummer)] : undefined,
                  ct: data.city ? [sha256(data.city)] : undefined,
                  country: [sha256("se")],
                  db: data.birthYear && String(data.birthYear).length === 4 ? [sha256(String(data.birthYear) + "0101")] : undefined,
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
