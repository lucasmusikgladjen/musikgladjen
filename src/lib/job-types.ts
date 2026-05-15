export interface JobFormData {
  instruments: string[];
  instrumentOther: string;
  studentCount: string;
  areas: string;
  motivations: string[];
  musicExperience: string;
  childrenExperience: string;
  name: string;
  birthYear: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export const JOB_INSTRUMENTS = [
  { name: "Piano", badge: "🔥 mest populärt bland elever" },
  { name: "Gitarr", badge: null },
  { name: "Sång", badge: null },
  { name: "Fiol", badge: null },
  { name: "Trummor", badge: null },
  { name: "Bas", badge: null },
  { name: "Annat", badge: "skriv i fritext" },
];

export const JOB_STUDENT_COUNTS = [
  { value: "1-2 elever", label: "1-2 elever" },
  { value: "3-4 elever", label: "3-4 elever" },
  { value: "5+ elever", label: "5+ elever" },
];

export const JOB_MOTIVATIONS = [
  "Att tjäna lite extra vid sidan av plugget",
  "Ett meningsfullt arbete med barn",
  "Ett roligt jobb där du får jobba med musik",
  "Personlig utveckling inom musik och pedagogik",
];
