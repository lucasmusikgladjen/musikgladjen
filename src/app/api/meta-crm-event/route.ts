import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const BASE_ID = "app1l4NwAMtwlTIUC";
const TABLE_ID = "tblnJd5fEqh2qXC2R";
const META_PIXEL_ID = "835715892143915";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  const secret = process.env.AIRTABLE_FACEBOOK_WEBHOOK_SECRET;
  if (secret) {
    const authHeader = req.headers.get("x-webhook-secret");
    if (authHeader !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: { recordId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { recordId } = body;
  if (!recordId) {
    return NextResponse.json({ error: "Missing recordId" }, { status: 400 });
  }

  const airtableKey = process.env.AIRTABLE_API_KEY;
  if (!airtableKey) {
    console.error("AIRTABLE_API_KEY not set");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const recordRes = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`,
    { headers: { Authorization: `Bearer ${airtableKey}` } }
  );
  if (!recordRes.ok) {
    console.error("Airtable fetch error:", await recordRes.text());
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  const record = await recordRes.json();
  const fields = record.fields as Record<string, string>;

  let contact: { email?: string; telefon?: string; postnummer?: string; ort?: string } = {};
  try {
    contact = JSON.parse(fields["Kontaktuppgifter"] ?? "{}");
  } catch {
    // non-fatal — send what we have
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ success: true, skipped: "no META_ACCESS_TOKEN" });
  }

  const nameParts = (fields["Namn"] ?? "").trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");
  const birthYear = fields["Födelseår"] ?? "";

  const capiRes = await fetch(
    `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          event_name: "QualifyLead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "crm",
          user_data: {
            em: contact.email ? [sha256(contact.email)] : undefined,
            ph: contact.telefon ? [sha256(contact.telefon.replace(/\D/g, ""))] : undefined,
            fn: firstName ? [sha256(firstName)] : undefined,
            ln: lastName ? [sha256(lastName)] : undefined,
            zp: contact.postnummer ? [sha256(contact.postnummer)] : undefined,
            ct: contact.ort ? [sha256(contact.ort)] : undefined,
            country: [sha256("se")],
            db: birthYear.length === 4 ? [sha256(birthYear + "0101")] : undefined,
            external_id: contact.email ? [sha256(contact.email)] : undefined,
          },
        }],
      }),
    }
  );

  if (!capiRes.ok) {
    const err = await capiRes.text();
    console.error("Meta CAPI QualifyLead error:", capiRes.status, err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
