"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { FormData } from "@/lib/schema";

const FIELDS: {
  name: keyof FormData;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  {
    name: "studentName",
    label: "Elevens förnamn",
    type: "text",
    placeholder: "Förnamn",
    autoComplete: "given-name",
  },
  {
    name: "guardianName",
    label: "Vårdnadshavares namn",
    type: "text",
    placeholder: "För- och efternamn",
    autoComplete: "name",
  },
  {
    name: "address",
    label: "Gatuadress",
    type: "text",
    placeholder: "Storgatan 12",
    autoComplete: "street-address",
  },
  {
    name: "postalCode",
    label: "Postnummer",
    type: "text",
    placeholder: "12345",
    autoComplete: "postal-code",
  },
  {
    name: "phone",
    label: "Telefon",
    type: "tel",
    placeholder: "0701234567",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "E-post",
    type: "email",
    placeholder: "namn@exempel.se",
    autoComplete: "email",
  },
];

export default function StepPersonalInfo({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<FormData>();
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  async function handleNext() {
    const valid = await trigger([
      "studentName",
      "guardianName",
      "address",
      "postalCode",
      "phone",
      "email",
    ]);
    if (valid) onNext();
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Dina uppgifter</h2>

      <div className="space-y-4">
        {FIELDS.map((field, i) => {
          const { ref, ...rest } = register(field.name);
          const error = errors[field.name];
          const errorId = `${field.name}-error`;

          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium mb-1"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
                {...rest}
                ref={(el) => {
                  ref(el);
                  if (i === 0) firstRef.current = el;
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition min-h-[44px] ${
                  error
                    ? "border-error focus:border-error"
                    : "border-gray-200 focus:border-primary"
                }`}
              />
              {error && (
                <p
                  id={errorId}
                  className="text-error text-sm mt-1"
                  role="alert"
                >
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary transition cursor-pointer"
        >
          Tillbaka
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-primary-hover transition min-h-[44px] cursor-pointer"
        >
          Nästa steg: se upplägg &amp; pris &rarr;
        </button>
      </div>
    </div>
  );
}
