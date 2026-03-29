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
      <h2 className="text-2xl font-bold text-text-primary mb-5 mt-2">
        Dina uppgifter
      </h2>

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
              className={`w-full px-4 py-3 rounded-xl border outline-none text-base transition-colors ${
                errors[field.name]
                  ? "border-error focus:ring-1 focus:ring-error"
                  : "border-border focus:border-border-focus focus:ring-1 focus:ring-primary"
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
    </StepWrapper>
  );
}
