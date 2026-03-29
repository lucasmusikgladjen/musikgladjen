import { z } from "zod";

// Sanitize string input against XSS
export function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export const gradeSchema = z.object({
  grade: z.string().min(1, "Välj en årskurs"),
});

export const instrumentSchema = z.object({
  instruments: z.array(z.string()).min(1, "Välj minst ett instrument"),
  instrumentOther: z.string().max(100).optional().default(""),
});

export const expectationsSchema = z.object({
  expectations: z.array(z.string()).default([]),
});

export const contactSchema = z.object({
  studentName: z
    .string()
    .min(1, "Fyll i elevens förnamn")
    .max(50, "Max 50 tecken")
    .transform(sanitize),
  guardianName: z
    .string()
    .min(2, "Fyll i vårdnadshavares namn")
    .max(80, "Max 80 tecken")
    .transform(sanitize),
  address: z
    .string()
    .min(3, "Fyll i gatuadress")
    .max(200, "Max 200 tecken")
    .transform(sanitize),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Ange ett giltigt postnummer (5 siffror)"),
  phone: z
    .string()
    .regex(
      /^(\+46|0)[1-9]\d{6,11}$/,
      "Ange ett giltigt telefonnummer"
    ),
  email: z
    .string()
    .email("Ange en giltig e-postadress")
    .max(254)
    .transform((v) => v.toLowerCase().trim()),
});

export const pricingSchema = z.object({
  frequency: z.enum(["weekly", "biweekly"]),
  lessonLength: z.enum(["45-60", "90", "120"]),
  startPreference: z.enum(["asap", "within_month", "next_term"]),
});
