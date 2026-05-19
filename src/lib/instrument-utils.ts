export function resolveInstruments(instruments: string[], instrumentOther: string): string[] {
  const others = instruments.includes("Annat")
    ? instrumentOther.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  return [...instruments.filter((i) => i !== "Annat"), ...others];
}
