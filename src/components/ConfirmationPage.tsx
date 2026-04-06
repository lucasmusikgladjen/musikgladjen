"use client";

import { useCallback, useState } from "react";
import { FormData, PRICE_TABLE } from "@/lib/types";
import { pushEvent } from "@/lib/tracking";
import FormHeader from "./FormHeader";

interface ConfirmationPageProps {
  data: FormData;
  referralCode: string | null;
}

function formatPrice(price: number): string {
  return price.toLocaleString("sv-SE");
}

function getLessonLabel(length: string): string {
  switch (length) {
    case "45-60":
      return "45–60 min";
    case "90":
      return "90 min";
    case "120":
      return "120 min";
    default:
      return length;
  }
}

function getFrequencyLabel(freq: string): string {
  return freq === "weekly" ? "Varje vecka" : "Varannan vecka";
}

function getFirstName(fullName: string): string {
  return fullName.split(" ")[0] || fullName;
}

function formatPostalCode(code: string): string {
  if (code.length === 5) {
    return `${code.slice(0, 3)} ${code.slice(3)}`;
  }
  return code;
}

export default function ConfirmationPage({
  data,
  referralCode,
}: ConfirmationPageProps) {
  const [copied, setCopied] = useState(false);
  const guardianFirst = getFirstName(data.guardianName);
  const referralUrl = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/anmalan?ref=${referralCode}`
    : null;

  const price = PRICE_TABLE[data.lessonLength]?.[data.frequency] ?? data.monthlyPrice;

  const smsBody = encodeURIComponent(
    `Hej! Vi har anmält ${data.studentName} till Musikglädjen — musiklektioner hemma. Om du också anmäler ditt barn får jag första lektionen gratis. Kolla in det: ${referralUrl}`
  );

  const handleCopy = useCallback(async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      pushEvent("referral_link_copied", {
        form_name: "musikgladjen_signup",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = referralUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [referralUrl]);

  const handleShare = useCallback(async () => {
    if (!referralUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Musikglädjen",
          text: `Hej! Vi har anmält ${data.studentName} till Musikglädjen — musiklektioner hemma. Om du också anmäler ditt barn får jag första lektionen gratis.`,
          url: referralUrl,
        });
      } catch {
        // User cancelled
      }
    }
  }, [referralUrl, data.studentName]);

  const handleSMS = useCallback(() => {
    pushEvent("referral_share_sms", { form_name: "musikgladjen_signup" });
    window.open(`sms:?body=${smsBody}`, "_self");
  }, [smsBody]);

  const handleMessenger = useCallback(() => {
    pushEvent("referral_share_messenger", { form_name: "musikgladjen_signup" });
    window.open(
      `fb-messenger://share/?link=${encodeURIComponent(referralUrl || "")}`,
      "_self"
    );
  }, [referralUrl]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <FormHeader />

      <div className="w-full max-w-[560px] mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Tack, {guardianFirst}! 🎉
          </h1>
          <p className="text-text-secondary text-lg">
            Vi har tagit emot er anmälan och hör av oss till{" "}
            <span className="font-medium text-text-primary">{data.email}</span>{" "}
            inom 24 timmar.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-text-primary mb-3">Er anmälan</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0">🎵</span>
              <span>{data.instruments.join(", ")}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0">🧒</span>
              <span>
                {data.studentName}, årskurs {data.grade}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0">🎹</span>
              <span>
                {getLessonLabel(data.lessonLength)} ·{" "}
                {getFrequencyLabel(data.frequency)} ·{" "}
                {formatPrice(price)} kr/mån
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0">📍</span>
              <span>
                {data.address}, {formatPostalCode(data.postalCode)}
              </span>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="mb-6">
          <h3 className="font-semibold text-text-primary mb-3">Vad händer nu?</h3>
          <div className="space-y-3">
            {[
              "Vi går igenom er anmälan och hittar en lärare som matchar.",
              "Ni får ett mejl med förslag på lärare och uppstartstid.",
              "Första lektionen — hemma hos er!",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-text-secondary pt-0.5">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        {referralUrl && (
          <div className="bg-accent-soft rounded-2xl p-5 mb-6 border border-primary/10">
            <h3 className="font-semibold text-text-primary mb-1">
              🎁 Tipsa en vän om Musikglädjen
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Om de gör en anmälan får du första lektionen gratis (värde 412 kr).
            </p>

            {/* Link + copy */}
            <div className="flex items-center gap-2 bg-bg-white rounded-xl border border-gray-200 p-2 mb-3">
              <span className="text-xs text-text-secondary truncate flex-1 px-2">
                {referralUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex-shrink-0 bg-bg-secondary hover:bg-gray-200 text-text-primary text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                {copied ? "Kopierad! ✓" : "Kopiera"}
              </button>
            </div>

            {/* Share buttons */}
            <div className="space-y-2">
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors min-h-[48px]"
                >
                  Dela
                </button>
              )}
              <button
                type="button"
                onClick={handleSMS}
                className="w-full bg-success hover:bg-success/90 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors min-h-[48px]"
              >
                Dela via SMS
              </button>
              <button
                type="button"
                onClick={handleMessenger}
                className="w-full bg-[#0084FF] hover:bg-[#006FDB] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors min-h-[48px]"
              >
                Dela via Messenger
              </button>
            </div>
          </div>
        )}

        {/* Teachers placeholder */}
        <div className="mb-6">
          <h3 className="font-semibold text-text-primary mb-3 text-center">Våra lärare</h3>
          <div className="flex justify-center gap-6">
            {/* PLACEHOLDER IMAGES: Cirkulära porträttfoton av unga musiklärare (20-25 år), leende, varma färger */}
            {[
              { name: "Kateryna", instrument: "Piano" },
              { name: "Julia", instrument: "Gitarr" },
              { name: "Erik", instrument: "Trummor" },
              { name: "Sara", instrument: "Sång" },
            ].map((teacher) => (
              <div key={teacher.name} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-bg-secondary mb-1.5 flex items-center justify-center text-text-secondary text-xl border-2 border-primary/10">
                  {teacher.name[0]}
                </div>
                <span className="text-xs font-medium text-text-primary">
                  {teacher.name}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {teacher.instrument}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="bg-bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          {/* PLACEHOLDER: Ersätt med riktiga kundcitat + förnamn */}
          <blockquote className="text-sm text-text-primary italic">
            &ldquo;Bästa beslutet vi gjort! Alma älskar sina pianolektioner och vi
            slipper stressa med skjutsande.&rdquo;
          </blockquote>
          <footer className="mt-2 not-italic text-text-secondary text-xs font-medium flex items-center gap-2">
            <span className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            — Lisa, förälder
          </footer>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🎓", text: "Personlig lärare" },
            { icon: "🏠", text: "Vi kommer hem till er" },
            { icon: "📅", text: "Ingen bindningstid" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="text-center bg-bg-white rounded-xl p-4 border border-gray-100"
            >
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <span className="text-xs font-semibold text-text-primary">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
