export interface JobFormData {
  instruments: string[];
  instrumentOther: string;
  studentCount: string;
  areas: string[];
  motivations: string[];
  musicExperience: string;
  childrenExperience: string;
  name: string;
  birthYear: string;
  address: string;
  postnummer: string;
  city: string;
  phone: string;
  email: string;
  howFound: string;
}

export const JOB_INSTRUMENTS = [
  { name: "Piano", badge: "🔥 Mest populärt bland elever" },
  { name: "Gitarr", badge: null },
  { name: "Sång", badge: null },
  { name: "Fiol", badge: null },
  { name: "Trummor", badge: null },
  { name: "Bas", badge: null },
  { name: "Annat", badge: null },
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

export const JOB_HOW_FOUND = [
  "Indeed",
  "Facebook",
  "Instagram",
  "Google",
  "Bekant",
  "Annat",
];

export const AREA_SUGGESTIONS = [
  // Stockholms stad – innerstad
  "Innerstan",
  "Vasastan",
  "Södermalm",
  "Östermalm",
  "Norrmalm",
  "Kungsholmen",
  "Gamla Stan",
  "Djurgården",
  "Hammarby Sjöstad",
  "Gärdet",
  "Odenplan",
  // Stockholms stad – ytterstad
  "Bromma",
  "Hägersten",
  "Mälarhöjden",
  "Aspudden",
  "Liljeholmen",
  "Skärholmen",
  "Älvsjö",
  "Enskede",
  "Farsta",
  "Farsta Strand",
  "Skarpnäck",
  "Bagarmossen",
  "Bandhagen",
  "Rågsved",
  "Vällingby",
  "Hässelby",
  "Spånga",
  "Tensta",
  "Rinkeby",
  "Kista",
  "Järva",
  // Alla kommuner i Stockholms län
  "Stockholm",
  "Botkyrka",
  "Danderyd",
  "Ekerö",
  "Haninge",
  "Huddinge",
  "Järfälla",
  "Lidingö",
  "Nacka",
  "Norrtälje",
  "Nykvarn",
  "Nynäshamn",
  "Salem",
  "Sigtuna",
  "Sollentuna",
  "Solna",
  "Sundbyberg",
  "Södertälje",
  "Tyresö",
  "Täby",
  "Upplands-Bro",
  "Upplands Väsby",
  "Vallentuna",
  "Vaxholm",
  "Värmdö",
  "Österåker",
  // Populära orter i kranskommunerna
  "Handen",
  "Sickla",
  "Tullinge",
  "Tumba",
  "Flemingsberg",
  // Andra städer
  "Uppsala",
  "Göteborg",
  "Malmö",
  "Linköping",
  "Örebro",
  "Västerås",
  "Helsingborg",
  "Norrköping",
  "Jönköping",
  "Umeå",
  "Lund",
  "Borås",
  "Gävle",
];
