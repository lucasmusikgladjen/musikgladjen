import { z } from "zod";

export const formSchema = z.object({
  // Step 1
  grade: z.string().min(1, "Välj en årskurs"),

  // Step 2
  instruments: z.array(z.string()).min(1, "Välj minst ett instrument"),
  instrumentOther: z.string().max(100).optional(),

  // Step 3
  expectations: z.array(z.string()),

  // Step 4
  studentName: z
    .string()
    .min(1, "Ange elevens förnamn")
    .max(50, "Max 50 tecken"),
  guardianName: z
    .string()
    .min(2, "Ange vårdnadshavares namn")
    .max(80, "Max 80 tecken"),
  address: z.string().min(3, "Ange en gatuadress"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Ange ett giltigt postnummer (5 siffror)"),
  phone: z
    .string()
    .regex(
      /^(\+46|0)\d{6,12}$/,
      "Ange ett giltigt svenskt telefonnummer"
    ),
  email: z.string().email("Ange en giltig e-postadress"),

  // Step 5
  frequency: z.enum(["weekly", "biweekly"]),
  lessonLength: z.enum(["45-60", "90", "120"]),
  startPreference: z.enum(["asap", "within_month", "next_term"]),

  // Honeypot
  website: z.string().max(0).optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const defaultValues: FormData = {
  grade: "",
  instruments: [],
  instrumentOther: "",
  expectations: [],
  studentName: "",
  guardianName: "",
  address: "",
  postalCode: "",
  phone: "",
  email: "",
  frequency: "weekly",
  lessonLength: "45-60",
  startPreference: "asap",
  website: "",
};

export const GRADES = [
  "Förskola",
  "F-klass",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

export const INSTRUMENTS = [
  { name: "Piano", emoji: "🎹" },
  { name: "Gitarr", emoji: "🎸" },
  { name: "Sång", emoji: "🎤" },
  { name: "Fiol", emoji: "🎻" },
  { name: "Trummor", emoji: "🥁" },
  { name: "Bas", emoji: "🎸" },
  { name: "Övrigt", emoji: "✨" },
];

export const EXPECTATIONS = [
  "En rolig fritidsaktivitet som barnet ser fram emot",
  "Att barnet lär sig spela ett instrument på riktigt",
  "En trygg vuxen förebild som kommer hem till er",
  "Bättre fokus och koncentration (en bonus med musik!)",
  "Slipper logistiken — vi kommer till er",
];

export const PRICE_TABLE: Record<string, Record<string, number>> = {
  "45-60": { weekly: 1650, biweekly: 1250 },
  "90": { weekly: 2475, biweekly: 1875 },
  "120": { weekly: 3300, biweekly: 2500 },
};

export const LESSON_LENGTH_LABELS: Record<string, string> = {
  "45-60": "45–60 min",
  "90": "90 min",
  "120": "120 min",
};

export const FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Varje vecka",
  biweekly: "Varannan vecka",
};
