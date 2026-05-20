import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import { verifyOnboardingSignature } from '@/lib/onboarding';
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
    valid = verifyOnboardingSignature(id, sig);
  } catch {
    return NextResponse.json({ error: 'Serverfel vid verifiering' }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: 'Ogiltig länk' }, { status: 403 });
  }

  try {
    const base = getBase();
    const record = await base('Lärare').find(id);

    const { adress, postnummer, ort } = parseAdress(record.get('Adress'));

    return NextResponse.json({
      namn: (record.get('Namn') as string) || '',
      adress,
      postnummer,
      ort,
      epost: (record.get('E-post') as string) || '',
      telefon: (record.get('Telefon') as string) || '',
      instrument: (() => {
        const v = record.get('Instrument');
        return Array.isArray(v) ? (v as string[]).join(', ') : ((v as string) || '');
      })(),
      undervisningsomraden: (() => {
        const v = record.get('Undervisningsområden');
        return Array.isArray(v) ? (v as string[]).join(', ') : ((v as string) || '');
      })(),
      personnummer: (record.get('Personnummer') as string) || '',
      bankkontonummer: (record.get('Bankkontonummer') as string) || '',
      bank: (record.get('Bank') as string) || '',
      biografi: (record.get('Biografi') as string) || '',
    });
  } catch (error) {
    console.error('Error fetching teacher data:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta lärardata' },
      { status: 500 }
    );
  }
}
