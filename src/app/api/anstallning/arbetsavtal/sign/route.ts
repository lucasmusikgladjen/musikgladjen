import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import Airtable from 'airtable';
import { verifyAgreementSignature } from '@/lib/agreement';

function getBase() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { id, sig, imageData } = await request.json();

    if (!id || !sig || !imageData) {
      return NextResponse.json(
        { error: 'Saknar id, signatur eller bilddata' },
        { status: 400 }
      );
    }

    // Verify HMAC signature
    let valid = false;
    try {
      valid = verifyAgreementSignature(id, sig);
    } catch {
      return NextResponse.json(
        { error: 'Serverfel vid verifiering' },
        { status: 500 }
      );
    }

    if (!valid) {
      return NextResponse.json(
        { error: 'Ogiltig länk' },
        { status: 403 }
      );
    }

    // Decode base64 PNG
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Vercel Blob
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = await put(`arbetsavtal/${id}/avtal-${timestamp}.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    // Update Airtable: replace "Avtal" field with the new image
    const base = getBase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await base('Lärare').update(id, {
      Avtal: [{ url: blob.url }],
    } as any);

    return NextResponse.json({ success: true, downloadUrl: blob.url });
  } catch (error: any) {
    console.error('Error signing agreement:', error);
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen eller kontakta oss.' },
      { status: 500 }
    );
  }
}
