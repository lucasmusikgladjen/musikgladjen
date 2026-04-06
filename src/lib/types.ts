export interface FormData {
  // Step 1
  grade: string;
  // Step 2
  instruments: string[];
  instrumentOther: string;
  // Step 3 (Variant A only)
  expectations: string[];
  // Contact
  studentName: string;
  guardianName: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  // Pricing
  frequency: "weekly" | "biweekly";
  lessonLength: "45-60" | "90" | "120";
  startPreference: "asap" | "within_month" | "next_term";
  monthlyPrice: number;
  // Meta
  formVariant: "A" | "B";
}

export interface UTMParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}

export interface WebhookPayload extends Omit<FormData, "formVariant" | "instrumentOther"> {
  formVariant: string;
  instrumentOther: string | null;
  honeypot?: string;
  meta: {
    submittedAt: string;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    utmContent: string | null;
    referrer: string;
    userAgent: string;
    referralCode: string | null;
  };
}

export interface WebhookResponse {
  success: boolean;
  referralCode?: string;
}

export const PRICE_TABLE: Record<string, Record<string, number>> = {
  "45-60": { weekly: 1650, biweekly: 1250 },
  "90": { weekly: 2475, biweekly: 1875 },
  "120": { weekly: 3300, biweekly: 2500 },
};

export const GRADES = [
  "Förskola",
  "Lågstadiet",
  "Mellanstadiet",
  "Högstadiet",
  "Äldre",
];

export const INSTRUMENTS = [
  { name: "Piano", emoji: "\u{1F3B9}" },
  { name: "Gitarr", emoji: "\u{1F3B8}" },
  { name: "Sång", emoji: "\u{1F3A4}" },
  { name: "Fiol", emoji: "\u{1F3BB}" },
  { name: "Trummor", emoji: "\u{1F941}" },
  { name: "Bas", emoji: "\u{1F3B5}" },
  { name: "Annat", emoji: "\u2728" },
];

export const EXPECTATIONS = [
  "En rolig fritidsaktivitet",
  "Att eleven utvecklas och lär sig spela instrumentet",
  "En äldre förebild för eleven",
  "Bättre koncentrationsförmåga",
  "En aktivitet som inte kräver planering och logistik",
];

export const STEP_NAMES_A = ["Årskurs", "Instrument", "Önskemål", "Kontakt", "Pris & upplägg"];
export const STEP_NAMES_B = ["Årskurs", "Instrument", "Kontakt", "Pris & upplägg"];
export const STEP_NAMES_B_SHORT = ["Årskurs", "Instrument", "Kontakt", "Pris"];

export const STEP_TRACKING_NAMES_A = ["grade", "instrument", "expectations", "contact", "pricing"];
export const STEP_TRACKING_NAMES_B = ["grade", "instrument", "contact", "pricing"];
