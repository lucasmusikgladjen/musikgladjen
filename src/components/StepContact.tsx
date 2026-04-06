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

const FIELD_ROWS: { name: keyof ContactFields; label: string; type: string; inputMode?: "text" | "numeric" | "tel" | "email"; autoComplete?: string; placeholder: string }[][] = [
  [
    { name: "studentName", label: "Elevens förnamn", type: "text", autoComplete: "given-name", placeholder: "T.ex. Alma" },
    { name: "guardianName", label: "Vårdnadshavares namn", type: "text", autoComplete: "name", placeholder: "Förnamn Efternamn" },
  ],
  [
    { name: "address", label: "Gatuadress", type: "text", autoComplete: "street-address", placeholder: "T.ex. Storgatan 12" },
    { name: "postalCode", label: "Postnummer", type: "text", inputMode: "numeric", autoComplete: "postal-code", placeholder: "12345" },
  ],
  [
    { name: "phone", label: "Telefon", type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "0701234567" },
    { name: "email", label: "E-post", type: "email", inputMode: "email", autoComplete: "email", placeholder: "namn@example.com" },
  ],
];

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

  return (
    <StepWrapper
      onBack={onBack}
      onNext={handleSubmit(onSubmit)}
      ctaText="Se ert pris & upplägg"
    >
      <h2 className="text-xl font-bold text-text-primary mb-4 mt-2">
        Kontaktuppgifter
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        noValidate
      >
        {FIELD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-2 gap-3">
            {row.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-medium text-text-primary mb-1"
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
                  className={`w-full px-3 py-2.5 rounded-lg border-2 outline-none text-sm transition-colors bg-bg-white ${
                    errors[field.name]
                      ? "border-error focus:ring-1 focus:ring-error"
                      : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  }`}
                />
                {errors[field.name] && (
                  <p
                    id={`${field.name}-error`}
                    className="text-error text-xs mt-0.5"
                    role="alert"
                  >
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="hidden" />
      </form>
    </StepWrapper>
  );
}
