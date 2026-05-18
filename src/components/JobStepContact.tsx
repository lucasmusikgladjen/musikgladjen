"use client";

import { useState, useRef, useEffect } from "react";
import StepWrapper from "./StepWrapper";
import { JOB_HOW_FOUND } from "@/lib/job-types";

interface JobStepContactProps {
  name: string;
  birthYear: string;
  address: string;
  postnummer: string;
  city: string;
  phone: string;
  email: string;
  howFound: string;
  howFoundLocked?: boolean;
  noValidation?: boolean;
  onNameChange: (v: string) => void;
  onBirthYearChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onPostnummerChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onHowFoundChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export default function JobStepContact({
  name,
  birthYear,
  address,
  postnummer,
  city,
  phone,
  email,
  howFound,
  howFoundLocked = false,
  noValidation = false,
  onNameChange,
  onBirthYearChange,
  onAddressChange,
  onPostnummerChange,
  onCityChange,
  onPhoneChange,
  onEmailChange,
  onHowFoundChange,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}: JobStepContactProps) {
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const maxBirthYear = new Date().getFullYear() - 14;
  const isValidBirthYear = (y: string) =>
    /^\d{4}$/.test(y) && parseInt(y) >= 1960 && parseInt(y) <= maxBirthYear;

  const formatPostnummer = (digits: string) => {
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

  const phoneDigits = phone.replace(/\D/g, "");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const [howFoundOpen, setHowFoundOpen] = useState(false);
  const howFoundRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!howFoundOpen) return;
    const handler = (e: MouseEvent) => {
      if (howFoundRef.current && !howFoundRef.current.contains(e.target as Node)) {
        setHowFoundOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [howFoundOpen]);

  const errors = {
    name: name.trim().length < 2 ? "Ange för- och efternamn" : null,
    birthYear: !isValidBirthYear(birthYear)
      ? birthYear.length === 0
        ? "Ange födelseår"
        : `Ange ett giltigt födelseår (1960–${maxBirthYear})`
      : null,
    address: address.trim().length < 2 ? "Ange din adress" : null,
    postnummer: postnummer.length !== 5 ? "Ange ett giltigt postnummer (5 siffror)" : null,
    city: city.trim().length < 2 ? "Ange din ort" : null,
    phone: phoneDigits.length < 8 ? "Ange ett giltigt telefonnummer" : null,
    email: !isValidEmail(email) ? "Ange en giltig e-postadress" : null,
  };

  const canSubmit = Object.values(errors).every((e) => e === null);

  const handleSubmit = () => {
    if (noValidation) { onSubmit(); return; }
    setTouched({ name: true, birthYear: true, address: true, postnummer: true, city: true, phone: true, email: true });
    if (canSubmit) onSubmit();
  };

  const fieldBase =
    "w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none bg-bg-white";
  const inputClass = `${fieldBase} text-base placeholder:text-gray-400 placeholder:text-sm`;
  const selectClass = `${fieldBase} text-sm pr-10 appearance-none`;
  const labelClass = "block text-sm font-semibold text-text-primary mb-1";

  const errorClass = "mt-1 text-xs text-error";

  return (
    <StepWrapper
      onBack={onBack}
      onNext={handleSubmit}
      ctaText="Skicka ansökan"
      ctaDisabled={false}
      ctaLoading={isSubmitting}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Kontaktuppgifter
      </h2>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            För- och efternamn <span className="text-error">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => touch("name")}
            placeholder="Anna Johansson"
            className={inputClass}
            autoComplete="name"
            maxLength={100}
          />
          {touched.name && errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="birthYear" className={labelClass}>
            Födelseår <span className="text-error">*</span>
          </label>
          <input
            id="birthYear"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={birthYear}
            onChange={(e) => onBirthYearChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onBlur={() => touch("birthYear")}
            placeholder="2004"
            className={inputClass}
            maxLength={4}
          />
          {touched.birthYear && errors.birthYear && <p className={errorClass}>{errors.birthYear}</p>}
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Adress <span className="text-error">*</span>
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            onBlur={() => touch("address")}
            placeholder="Exempelgatan 12"
            className={inputClass}
            autoComplete="street-address"
            maxLength={200}
          />
          {touched.address && errors.address && <p className={errorClass}>{errors.address}</p>}
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <div>
            <label htmlFor="postnummer" className={labelClass}>
              Postnr <span className="text-error">*</span>
            </label>
            <input
              id="postnummer"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={formatPostnummer(postnummer)}
              onChange={(e) => onPostnummerChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onBlur={() => touch("postnummer")}
              placeholder="123 45"
              className={inputClass}
              autoComplete="postal-code"
              maxLength={6}
            />
            {touched.postnummer && errors.postnummer && <p className={errorClass}>{errors.postnummer}</p>}
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              Ort <span className="text-error">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              onBlur={() => touch("city")}
              placeholder="Stockholm"
              className={inputClass}
              autoComplete="address-level2"
              maxLength={100}
            />
            {touched.city && errors.city && <p className={errorClass}>{errors.city}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefonnummer <span className="text-error">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => onPhoneChange(formatPhone(e.target.value))}
            onBlur={() => touch("phone")}
            placeholder="070-123 45 67"
            className={inputClass}
            autoComplete="tel"
            maxLength={13}
          />
          {touched.phone && errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-post <span className="text-error">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => touch("email")}
            placeholder="anna@example.com"
            className={inputClass}
            autoComplete="email"
            maxLength={200}
          />
          {touched.email && errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        {!howFoundLocked && (
          <div>
            <label className={labelClass}>Hur hittade du Musikglädjen?</label>
            <div ref={howFoundRef} className="relative">
              <button
                type="button"
                onClick={() => setHowFoundOpen((o) => !o)}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-bg-white text-left text-sm flex items-center justify-between ${howFound ? "text-text-primary" : "text-gray-400"}`}
              >
                {howFound || "Välj ett alternativ"}
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${howFoundOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute left-0 top-full mt-1 w-full bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-10 transition-all duration-200 origin-top ${howFoundOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>
                {JOB_HOW_FOUND.map((option, i) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { onHowFoundChange(option); setHowFoundOpen(false); }}
                    className={`w-full px-5 py-3.5 text-left text-sm flex items-center justify-between transition-colors ${
                      howFound === option ? "text-[#8B1A00]" : "text-text-primary hover:bg-gray-50"
                    } ${i > 0 ? "border-t border-gray-100" : ""}`}
                  >
                    {option}
                    {howFound === option && (
                      <svg className="w-4 h-4 text-[#8B1A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
        <svg
          className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <p className="text-xs text-text-secondary leading-relaxed">
          Vi behandlar dina uppgifter säkert och i enlighet med vår{" "}
          <a
            href="https://www.musikgladjen.se/integritetspolicy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-text-primary transition-colors"
          >
            integritetspolicy
          </a>
          .
        </p>
      </div>

      {submitError && (
        <div className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-red-200 rounded-xl shadow-lg max-w-[480px] w-[calc(100%-2rem)] animate-toast">
          <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-error">{submitError}</p>
        </div>
      )}
    </StepWrapper>
  );
}
