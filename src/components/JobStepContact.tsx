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
    "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-base bg-bg-white focus:border-gray-400 transition-colors";
  const labelClass = "block text-sm font-semibold text-text-primary mb-1";

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onSubmit}
      ctaText="Skicka ansökan"
      ctaDisabled={!canSubmit}
      ctaLoading={isSubmitting}
      subtext="Vi kontaktar dig via telefon eller e-post inom kort."
    >
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Kontaktuppgifter
      </h2>
      <p className="text-sm text-text-secondary mb-6">Sista steget!</p>

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
            type="number"
            value={birthYear}
            onChange={(e) => onBirthYearChange(e.target.value)}
            placeholder="2004"
            className={inputClass}
            min={1960}
            max={2012}
          />
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
            placeholder="Exempelgatan 12"
            className={inputClass}
            autoComplete="street-address"
            maxLength={200}
          />
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <div>
            <label htmlFor="postnummer" className={labelClass}>
              Postnummer <span className="text-error">*</span>
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
          <label className={labelClass}>
            Hur hittade du Musikglädjen?
          </label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {JOB_HOW_FOUND.map((option) => {
              const selected = howFound === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onHowFoundChange(selected ? "" : option)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-left transition-colors border ${
                    selected
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200 bg-bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      selected ? "border-primary" : "border-gray-400"
                    }`}
                  >
                    {selected && (
                      <span className="w-2 h-2 rounded-full bg-primary block" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-text-primary">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-error">{submitError}</p>
        </div>
      )}
    </StepWrapper>
  );
}
