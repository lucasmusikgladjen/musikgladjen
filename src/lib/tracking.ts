import { UTMParams } from "./types";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
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

export function getUTMParams(): UTMParams {
  if (typeof window === "undefined") {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  };
}

export function getReferralCodeFromURL(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || params.get("referralCode");
}

export function getReferrer(): string {
  if (typeof window === "undefined") return "";
  return document.referrer || "";
}

export function getUserAgent(): string {
  if (typeof window === "undefined") return "";
  return navigator.userAgent || "";
}
