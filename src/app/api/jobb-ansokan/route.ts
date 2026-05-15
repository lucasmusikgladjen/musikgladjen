import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const BASE_ID = "app1l4NwAMtwlTIUC";
const TABLE_ID = "tblnJd5fEqh2qXC2R";
const META_PIXEL_ID = "835715892143915";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    console.error("AIRTABLE_API_KEY not set");
    return NextResponse.json({ success: false, error: "Configuration error" }, { status: 500 });
  }

  const instrumentStr = [
    ...data.instruments.filter((i: string) => i !== "Annat"),
    ...(data.instruments.includes("Annat") && data.instrumentOther
      ? [`Annat (${data.instrumentOther})`]
      : []),
  ].join(", ");

  const areasStr = Array.isArray(data.areas)
    ? data.areas.join(", ")
    : data.areas;

  const fields: Record<string, unknown> = {
    Namn: data.name,
    Födelseår: data.birthYear,
    "E-post": data.email,
    Telefon: data.phone,
    Adress: data.address,
    Postnummer: data.postnummer,
    Ort: data.city,
    Instrument: instrumentStr,
    "Antal elever": data.studentCount,
    Undervisningsområden: areasStr,
    Musikerfarenheter: data.musicExperience,
    "Erfarenheter med barn": data.childrenExperience,
    "Hur hittade du oss?": data.howFound,
    Kommentar: JSON.stringify(
      { ...data, submittedAt: new Date().toISOString() },
      null,
      2
    ),
  };

  if (Array.isArray(data.motivations) && data.motivations.length > 0) {
    fields["Vad vill du ha ut av jobbet?"] = data.motivations;
  }

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

      await fetch(
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
                ph: data.phone ? [sha256(data.phone.replace(/\s+/g, ""))] : undefined,
                fn: firstName ? [sha256(firstName)] : undefined,
                ln: lastName ? [sha256(lastName)] : undefined,
                zp: data.postnummer ? [sha256(data.postnummer.replace(/\s+/g, ""))] : undefined,
                ct: data.city ? [sha256(data.city)] : undefined,
                country: ["se"],
                db: data.birthYear ? [sha256(data.birthYear + "0101")] : undefined,
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
    } catch (err) {
      console.error("Meta CAPI error:", err);
    }
  }

  return NextResponse.json({ success: true });
}
