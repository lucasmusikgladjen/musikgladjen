export const INSTRUMENTS = ['Piano', 'Gitarr', 'Sång', 'Fiol', 'Trummor', 'Bas'] as const;
export type Instrument = typeof INSTRUMENTS[number];
