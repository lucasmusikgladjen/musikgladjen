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

export type ElevFormData = {
  children: Child[];
  guardianName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  comment: string;
  instrumentAtHome: string;
  frequency: "weekly" | "biweekly";
  lessonLength: "45-60" | "90" | "120";
  formVariant: string;
};
