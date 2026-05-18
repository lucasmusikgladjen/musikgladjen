"use client";

import { useState, useRef, useEffect } from "react";
import StepWrapper from "./StepWrapper";

const INSTRUMENT_AT_HOME_OPTIONS = [
  { value: "", label: "Välj alternativ…" },
  { value: "Ja, vi har ett instrument", label: "Ja, vi har ett instrument" },
  { value: "Nej, men planerar att köpa", label: "Nej, men planerar att köpa" },
  { value: "Nej, behöver råd", label: "Nej, behöver råd" },
];

interface ElevStepContactProps {
  guardianName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  comment: string;
  instrumentAtHome: string;
  onGuardianNameChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onPostalCodeChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onCommentChange: (v: string) => void;
  onInstrumentAtHomeChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const formatPostalCode = (digits: string) => {
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
};

const formatPhone = (input: string) => {
  const d = input.replace(/\D/g, "").slice(0, 10);
  let r = d.slice(0, 3);
  if (d.length > 3) r += `-${d.slice(3, 6)}`;
  if (d.length > 6) r += ` ${d.slice(6, 8)}`;
  if (d.length > 8) r += ` ${d.slice(8, 10)}`;
  return r;
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white placeholder:text-gray-400 placeholder:text-sm transition-colors focus:border-primary";
const labelClass = "block text-sm font-semibold text-text-primary mb-1";

export default function ElevStepContact({
  guardianName,
  address,
  postalCode,
  city,
  phone,
  email,
  comment,
  instrumentAtHome,
  onGuardianNameChange,
  onAddressChange,
  onPostalCodeChange,
  onCityChange,
  onPhoneChange,
  onEmailChange,
  onCommentChange,
  onInstrumentAtHomeChange,
  onNext,
  onBack,
}: ElevStepContactProps) {
  const [instrumentOpen, setInstrumentOpen] = useState(false);
  const instrumentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!instrumentOpen) return;
    const handler = (e: MouseEvent) => {
      if (instrumentRef.current && !instrumentRef.current.contains(e.target as Node)) {
        setInstrumentOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [instrumentOpen]);

  return (
    <StepWrapper onBack={onBack} onNext={onNext} ctaText="Se ert pris & upplägg" gaStep="steg-4">
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Kontaktuppgifter
      </h2>

      <div className="flex flex-col gap-4" data-ga-step="steg-4">
        <div>
          <label htmlFor="guardianName" className={labelClass}>
            Vårdnadshavares namn
          </label>
          <input
            id="guardianName"
            type="text"
            value={guardianName}
            onChange={(e) => onGuardianNameChange(e.target.value)}
            placeholder="Förnamn Efternamn"
            autoComplete="name"
            maxLength={80}
            data-ga-field="guardian_name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Gatuadress
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="T.ex. Storgatan 12"
            autoComplete="street-address"
            maxLength={200}
            data-ga-field="address"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <div>
            <label htmlFor="postalCode" className={labelClass}>
              Postnr
            </label>
            <input
              id="postalCode"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={formatPostalCode(postalCode)}
              onChange={(e) => onPostalCodeChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="123 45"
              autoComplete="postal-code"
              maxLength={6}
              data-ga-field="postal_code"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              Ort
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Stockholm"
              autoComplete="address-level2"
              maxLength={100}
              data-ga-field="city"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => onPhoneChange(formatPhone(e.target.value))}
            placeholder="070-123 45 67"
            autoComplete="tel"
            maxLength={13}
            data-ga-field="phone"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-post
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="namn@example.com"
            autoComplete="email"
            maxLength={254}
            data-ga-field="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="instrumentAtHome" className={labelClass}>
            Har ni ett instrument hemma?
          </label>
          <div ref={instrumentRef} className="relative">
            <button
              type="button"
              onClick={() => setInstrumentOpen((o) => !o)}
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-bg-white text-left text-sm flex items-center justify-between ${instrumentAtHome ? "text-text-primary" : "text-gray-400"}`}
            >
              {instrumentAtHome || "Välj alternativ…"}
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${instrumentOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute left-0 top-full mt-1 w-full bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-10 transition-all duration-200 origin-top ${instrumentOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>
              {INSTRUMENT_AT_HOME_OPTIONS.filter(({ value }) => value !== "").map(({ value, label }, i) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { onInstrumentAtHomeChange(value); setInstrumentOpen(false); }}
                  data-ga-field="instrument_at_home"
                  className={`w-full px-5 py-3.5 text-left text-sm flex items-center justify-between transition-colors ${
                    instrumentAtHome === value ? "text-[#8B1A00]" : "text-text-primary hover:bg-gray-50"
                  } ${i > 0 ? "border-t border-gray-100" : ""}`}
                >
                  {label}
                  {instrumentAtHome === value && (
                    <svg className="w-4 h-4 text-[#8B1A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="comment" className={labelClass}>
            Något vi bör veta?
            <span className="text-text-secondary font-normal ml-1">(frivilligt)</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="T.ex. om barnet har särskilda behov eller annat vi bör ta hänsyn till"
            rows={3}
            maxLength={500}
            data-ga-field="comment"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white placeholder:text-gray-400 placeholder:text-sm resize-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-start gap-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <svg className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p className="text-xs text-text-secondary leading-relaxed">
            Vi behandlar dina uppgifter säkert och i enlighet med vår{" "}
            <a href="https://www.musikgladjen.se/integritetspolicy" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-primary transition-colors">
              integritetspolicy
            </a>
            .
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}
