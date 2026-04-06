"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validation";
import { z } from "zod";
import StepWrapper from "./StepWrapper";
import { useEffect } from "react";

type ContactFields = z.infer<typeof contactSchema>;

interface StepContactProps {
  values: ContactFields;
  onChange: (data: ContactFields) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepContact({
  values,
  onChange,
  onNext,
  onBack,
}: StepContactProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ContactFields>({
    resolver: zodResolver(contactSchema),
    defaultValues: values,
    mode: "onBlur",
  });

  useEffect(() => {
    setFocus("studentName");
  }, [setFocus]);

  const onSubmit = (data: ContactFields) => {
    onChange(data);
    onNext();
  };

  const fields: {
    name: keyof ContactFields;
    label: string;
    type: string;
    inputMode?: "text" | "numeric" | "tel" | "email";
    autoComplete?: string;
    placeholder: string;
  }[] = [
    {
      name: "studentName",
      label: "Elevens förnamn",
      type: "text",
      autoComplete: "given-name",
      placeholder: "T.ex. Alma",
    },
    {
      name: "guardianName",
      label: "Vårdnadshavares namn",
      type: "text",
      autoComplete: "name",
      placeholder: "Förnamn Efternamn",
    },
    {
      name: "address",
      label: "Gatuadress",
      type: "text",
      autoComplete: "street-address",
      placeholder: "T.ex. Storgatan 12",
    },
    {
      name: "postalCode",
      label: "Postnummer",
      type: "text",
      inputMode: "numeric",
      autoComplete: "postal-code",
      placeholder: "T.ex. 11234",
    },
    {
      name: "phone",
      label: "Telefon",
      type: "tel",
      inputMode: "tel",
      autoComplete: "tel",
      placeholder: "T.ex. 0701234567",
    },
    {
      name: "email",
      label: "E-post",
      type: "email",
      inputMode: "email",
      autoComplete: "email",
      placeholder: "namn@example.com",
    },
  ];

  return (
    <StepWrapper
      onBack={onBack}
      onNext={handleSubmit(onSubmit)}
      ctaText="Nästa: se upplägg & pris →"
    >
      {/* Motivating headline */}
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Snart klart — vi hittar rätt lärare åt er!
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Fyll i era uppgifter för ett personligt, kostnadsfritt och inte bindande förslag.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-text-primary mb-1"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              {...register(field.name)}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-base transition-colors bg-bg-white ${
                errors[field.name]
                  ? "border-error focus:ring-1 focus:ring-error"
                  : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              }`}
            />
            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                className="text-error text-xs mt-1"
                role="alert"
              >
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        {/* Hidden submit to allow Enter key */}
        <button type="submit" className="hidden" />
      </form>

      {/* Privacy assurance */}
      <div className="flex items-center gap-2 mt-5 text-xs text-text-secondary">
        <svg className="w-4 h-4 flex-shrink-0 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Vi behandlar dina uppgifter säkert och delar aldrig vidare dem.</span>
      </div>
    </StepWrapper>
  );
}
