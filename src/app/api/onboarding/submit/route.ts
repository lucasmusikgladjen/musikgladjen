import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import Airtable from 'airtable';
import { verifyOnboardingSignature } from '@/lib/onboarding';
import { serializeAdress } from '@/lib/airtable';

const toStartCase = (s: string) =>
  s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

function getBase() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const sig = formData.get('sig') as string;

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

    // Extract and normalize text fields
    const namn = toStartCase((formData.get('namn') as string)?.trim() ?? '');
    const adress = toStartCase((formData.get('adress') as string)?.trim() ?? '');
    const postnummer = ((formData.get('postnummer') as string) ?? '').trim();
    const ort = toStartCase((formData.get('ort') as string)?.trim() ?? '');
    const epost = ((formData.get('epost') as string) ?? '').trim().toLowerCase();
    const telefon = ((formData.get('telefon') as string) ?? '').trim();
    const instrumentRaw = (formData.get('instrument') as string) ?? '';
    const instrument = instrumentRaw
      .split(/[,;]+/)
      .map((t) => toStartCase(t.trim()))
      .filter(Boolean);
    const undervisningsomraden = ((formData.get('undervisningsomraden') as string) ?? '')
      .split(/[,;]+/)
      .map((t) => toStartCase(t.trim()))
      .filter(Boolean);
    const personnummer = ((formData.get('personnummer') as string) ?? '').trim();
    const bankkontonummer = ((formData.get('bankkontonummer') as string) ?? '').trim();
    const bank = ((formData.get('bank') as string) ?? '').trim();
    const biografi = formData.get('biografi') as string;

    // Build Airtable update object with text fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: Record<string, any> = {};
    if (namn) updateFields['Namn'] = namn;
    if (adress || postnummer || ort) updateFields['Adress'] = serializeAdress(adress, postnummer, ort);
    if (epost) updateFields['E-post'] = epost;
    if (telefon) updateFields['Telefon'] = telefon;
    if (instrument.length > 0) updateFields['Instrument'] = instrument;
    if (undervisningsomraden.length > 0) updateFields['Undervisningsområden'] = undervisningsomraden;
    if (personnummer) updateFields['Personnummer'] = personnummer;
    if (bankkontonummer) updateFields['Bankkontonummer'] = bankkontonummer;
    if (bank) updateFields['Bank'] = bank;
    if (biografi !== null && biografi !== undefined) updateFields['Biografi'] = biografi;

    // Handle file uploads
    const fileFields: { formKey: string; airtableField: string; blobPrefix: string }[] = [
      { formKey: 'profilbild', airtableField: 'Profilbild', blobPrefix: 'profilbild' },
      { formKey: 'jamkning', airtableField: 'Jämkning', blobPrefix: 'jamkning' },
      { formKey: 'belastningsregister', airtableField: 'Belastningsregister', blobPrefix: 'belastningsregister' },
    ];

    for (const { formKey, airtableField, blobPrefix } of fileFields) {
      const file = formData.get(formKey) as File | null;
      if (file && file.size > 0) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const blob = await put(
          `onboarding/${id}/${blobPrefix}/${timestamp}-${file.name}`,
          file,
          { access: 'public' }
        );
        updateFields[airtableField] = [{ url: blob.url }];
      }
    }

    // Patch teacher record in Airtable
    const base = getBase();
    await base('Lärare').update(id, updateFields);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error submitting onboarding:', error);
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen eller kontakta oss.' },
      { status: 500 }
    );
  }
}
