import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import { verifyAgreementSignature } from '@/lib/agreement';
import { parseAdress } from '@/lib/airtable';

function getBase() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const sig = searchParams.get('sig');

  if (!id || !sig) {
    return NextResponse.json({ error: 'Saknar id eller signatur' }, { status: 400 });
  }

  let valid = false;
  try {
    valid = verifyAgreementSignature(id, sig);
  } catch {
    return NextResponse.json({ error: 'Serverfel vid verifiering' }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: 'Ogiltig länk' }, { status: 403 });
  }

  try {
    const base = getBase();
    const record = await base('Lärare').find(id);

    const namn = record.get('Namn') as string || '';
    const { adress, ort } = parseAdress(record.get('Adress'));
    const fodelsear = record.get('Födelseår') as string || '';
    const timlon = record.get('Timlön') as number | undefined;
    const lonepalagg = record.get('Lönepålägg') as number | undefined;
    const avtal = record.get('Avtal') as any[] | undefined;

    return NextResponse.json({
      namn,
      adress,
      ort,
      fodelsear,
      timlon: timlon ?? 0,
      lonepalagg: lonepalagg ?? 0,
      harAvtal: Array.isArray(avtal) && avtal.length > 0,
    });
  } catch (error) {
    console.error('Error fetching teacher data:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta lärardata' },
      { status: 500 }
    );
  }
}
