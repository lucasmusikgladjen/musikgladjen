import crypto from 'crypto';

/**
 * Generate an HMAC-SHA256 signature for a Lärare record ID.
 * Uses a "jobbavtal:" prefix to prevent cross-use with villkor signatures.
 */
export function signLarareId(larareRecordId: string): string {
  const secret = process.env.EMPLOYMENT_SIGNING_SECRET;
  if (!secret) throw new Error('EMPLOYMENT_SIGNING_SECRET is not set');
  return crypto.createHmac('sha256', secret).update(`jobbavtal:${larareRecordId}`).digest('hex');
}

/**
 * Verify that a signature matches the given Lärare record ID.
 */
export function verifyAgreementSignature(larareRecordId: string, signature: string): boolean {
  const expected = signLarareId(larareRecordId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/**
 * Build the full agreement URL for a teacher.
 */
export function buildAgreementUrl(larareRecordId: string): string {
  const sig = signLarareId(larareRecordId);
  const baseUrl =
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  return `${baseUrl}/anstallning/arbetsavtal?id=${encodeURIComponent(larareRecordId)}&sig=${sig}`;
}
