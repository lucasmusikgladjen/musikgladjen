import { z } from "zod";
import { sanitize } from "./validation";

export type Child = {
  name: string;
  grade: string;
  instruments: string[];
  instrumentOther: string;
};

export const emptyChild = (): Child => ({
  name: "",
  grade: "",
  instruments: [],
  instrumentOther: "",
});

export const elevNonContactSchema = z.object({
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
    .regex(/^(\+46|0)[1-9]\d{6,11}$/, "Ange ett giltigt telefonnummer"),
  email: z
    .string()
    .email("Ange en giltig e-postadress")
    .max(254)
    .transform((v) => v.toLowerCase().trim()),
});

export type ElevNonContactFields = z.infer<typeof elevNonContactSchema>;

export type ElevNonFormData = {
  children: Child[];
  guardianName: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  expectations: string[];
  frequency: "weekly" | "biweekly";
  lessonLength: "45-60" | "90" | "120";
  startPreference: "asap" | "within_month" | "next_term";
  formVariant: string;
};

export type ElevNonView = "grade" | "instrument" | "sibling" | "contact" | "pricing";
