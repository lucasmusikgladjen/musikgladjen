"use client";

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
  const isValidBirthYear = (y: string) =>
    /^\d{4}$/.test(y) && parseInt(y) >= 1960 && parseInt(y) <= 2012;

  const canSubmit =
    name.trim().length >= 2 &&
    isValidBirthYear(birthYear) &&
    address.trim().length >= 2 &&
    city.trim().length >= 2 &&
    phone.trim().length >= 6 &&
    isValidEmail(email);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-base bg-bg-white transition-colors placeholder:text-gray-400";
  const labelClass = "block text-sm font-semibold text-text-primary mb-1";

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onSubmit}
      ctaText="Skicka ansökan"
      ctaDisabled={!canSubmit}
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
            placeholder="Anna Johansson"
            className={inputClass}
            autoComplete="name"
            maxLength={100}
          />
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
            onChange={(e) => onBirthYearChange(e.target.value)}
            placeholder="2004"
            className={inputClass}
            maxLength={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_2fr] gap-2">
          <div>
            <label htmlFor="address" className={labelClass}>
              Adress <span className="text-error">*</span>
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Exempelgatan 12"
              className={inputClass}
              autoComplete="street-address"
              maxLength={200}
            />
          </div>
          <div>
            <label htmlFor="postnummer" className={labelClass}>
              Postnr <span className="text-error">*</span>
            </label>
            <input
              id="postnummer"
              type="text"
              value={postnummer}
              onChange={(e) => onPostnummerChange(e.target.value)}
              placeholder="123 45"
              className={inputClass}
              autoComplete="postal-code"
              maxLength={6}
            />
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
              placeholder="Stockholm"
              className={inputClass}
              autoComplete="address-level2"
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefonnummer <span className="text-error">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="070 123 45 67"
            className={inputClass}
            autoComplete="tel"
            maxLength={20}
          />
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
            placeholder="anna@example.com"
            className={inputClass}
            autoComplete="email"
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="howFound" className={labelClass}>
            Hur hittade du Musikglädjen?
          </label>
          <div className="relative">
            <select
              id="howFound"
              value={howFound}
              onChange={(e) => onHowFoundChange(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-base bg-bg-white transition-colors appearance-none"
              style={{ color: howFound === "" ? "#9ca3af" : "" }}
            >
              <option value="" disabled>
                Välj ett alternativ
              </option>
              {JOB_HOW_FOUND.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
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
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-error">{submitError}</p>
        </div>
      )}
    </StepWrapper>
  );
}
