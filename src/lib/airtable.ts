export function escapeFormulaString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function parseAdress(raw: unknown): { adress: string; postnummer: string; ort: string } {
  try {
    const parsed = JSON.parse(raw as string)
    return {
      adress: parsed.adress || '',
      postnummer: parsed.postnummer || '',
      ort: parsed.ort || '',
    }
  } catch {
    return { adress: typeof raw === 'string' ? raw : '', postnummer: '', ort: '' }
  }
}

export function serializeAdress(adress: string, postnummer: string, ort: string): string {
  return JSON.stringify({ adress, postnummer, ort })
}

export function validateRecordId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return /^rec[A-Za-z0-9]{14}$/.test(trimmed) ? trimmed : null;
}

export function normalizeMultiSelect(val: unknown): string {
  if (Array.isArray(val)) return val.join(', ');
  return (val as string) || '';
}

export function parseMultiSelect(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val) return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}
