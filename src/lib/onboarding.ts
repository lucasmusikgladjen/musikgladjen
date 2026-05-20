import crypto from 'crypto';

/**
 * Generate an HMAC-SHA256 signature for a Lärare record ID.
 * Uses an "onboarding:" prefix to prevent cross-use with villkor/jobbavtal signatures.
 */
export function signOnboardingId(larareRecordId: string): string {
  const secret = process.env.EMPLOYMENT_SIGNING_SECRET;
  if (!secret) throw new Error('EMPLOYMENT_SIGNING_SECRET is not set');
  return crypto.createHmac('sha256', secret).update(`onboarding:${larareRecordId}`).digest('hex');
}

/**
 * Verify that a signature matches the given Lärare record ID for onboarding.
 */
export function verifyOnboardingSignature(larareRecordId: string, signature: string): boolean {
  const expected = signOnboardingId(larareRecordId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/**
 * Build the full onboarding URL for a teacher.
 */
export function buildOnboardingUrl(larareRecordId: string): string {
  const sig = signOnboardingId(larareRecordId);
  const baseUrl = 'https://anstallning.musikgladjen.se';
  return `${baseUrl}/onboarding?id=${encodeURIComponent(larareRecordId)}&sig=${sig}`;
}
