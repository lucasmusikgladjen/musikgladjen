declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    fbq: (...args: unknown[]) => void;
  }
}

export function pushEvent(
  event: string,
  data?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

export function trackMetaLead(eventId: string): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", {}, { eventID: eventId });
  }
}
