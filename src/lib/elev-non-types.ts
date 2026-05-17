import { z } from "zod";
import { sanitize } from "./validation";

export type Child = {
  name: string;
  birthYear: string;
  grade: string;
  instruments: string[];
  instrumentOther: string;
};

export const emptyChild = (): Child => ({
  name: "",
  birthYear: "",
  grade: "",
  instruments: [],
  instrumentOther: "",
});

// TODO: restore validation before launch
export const elevNonContactSchema = z.object({
  guardianName: z.string().default(""),
  address: z.string().default(""),
  postalCode: z.string().default(""),
  city: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
});

export type ElevNonContactFields = z.infer<typeof elevNonContactSchema>;

export type ElevNonFormData = {
  children: Child[];
  guardianName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  comment: string;
  instrumentAtHome: string;
  expectations: string[];
  frequency: "weekly" | "biweekly";
  lessonLength: "45-60" | "90" | "120";
  startPreference: "asap" | "within_month" | "next_term";
  formVariant: string;
};

export type ElevNonView = "grade" | "instrument" | "sibling" | "contact" | "pricing";
