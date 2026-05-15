import { NextRequest, NextResponse } from "next/server";

const BASE_ID = "app1l4NwAMtwlTIUC";
const TABLE_ID = "tblnJd5fEqh2qXC2R";

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

  return NextResponse.json({ success: true });
}
