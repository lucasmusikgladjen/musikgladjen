export function resolveInstruments(instruments: string[], instrumentOther: string): string[] {
  return [
    ...instruments.filter((i) => i !== "Annat"),
    ...(instruments.includes("Annat") && instrumentOther.trim()
      ? [instrumentOther.trim()]
      : []),
  ];
}
