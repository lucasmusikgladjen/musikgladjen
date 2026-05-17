"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { elevNonContactSchema, ElevNonContactFields } from "@/lib/elev-non-types";
import StepWrapper from "./StepWrapper";

interface ElevNonStepContactProps {
  values: ElevNonContactFields;
  comment: string;
  onCommentChange: (v: string) => void;
  onChange: (data: ElevNonContactFields) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ElevNonStepContact({
  values,
  comment,
  onCommentChange,
  onChange,
  onNext,
  onBack,
}: ElevNonStepContactProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ElevNonContactFields>({
    resolver: zodResolver(elevNonContactSchema),
    defaultValues: values,
    mode: "onBlur",
  });

  const onSubmit = (data: ElevNonContactFields) => {
    onChange(data);
    onNext();
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white placeholder:text-gray-400 placeholder:text-sm transition-colors ${
      hasError ? "border-error" : "border-gray-200 focus:border-primary"
    }`;

  const labelClass = "block text-sm font-semibold text-text-primary mb-1";
  const errorClass = "mt-1 text-xs text-error";

  return (
    <StepWrapper onBack={onBack} onNext={handleSubmit(onSubmit)} ctaText="Se ert pris & upplägg">
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Kontaktuppgifter
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="guardianName" className={labelClass}>
            Vårdnadshavares namn <span className="text-error">*</span>
          </label>
          <input
            id="guardianName"
            type="text"
            placeholder="Förnamn Efternamn"
            autoComplete="name"
            maxLength={80}
            {...register("guardianName")}
            className={inputClass(!!errors.guardianName)}
          />
          {errors.guardianName && <p className={errorClass}>{errors.guardianName.message}</p>}
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Gatuadress <span className="text-error">*</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="T.ex. Storgatan 12"
            autoComplete="street-address"
            maxLength={200}
            {...register("address")}
            className={inputClass(!!errors.address)}
          />
          {errors.address && <p className={errorClass}>{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <div>
            <label htmlFor="postalCode" className={labelClass}>
              Postnr <span className="text-error">*</span>
            </label>
            <input
              id="postalCode"
              type="text"
              inputMode="numeric"
              placeholder="12345"
              autoComplete="postal-code"
              maxLength={5}
              {...register("postalCode")}
              className={inputClass(!!errors.postalCode)}
            />
            {errors.postalCode && <p className={errorClass}>{errors.postalCode.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Ort</label>
            <input
              type="text"
              placeholder="Stockholm"
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-100 text-base bg-gray-50 text-gray-400 placeholder:text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon <span className="text-error">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="0701234567"
            autoComplete="tel"
            maxLength={13}
            {...register("phone")}
            className={inputClass(!!errors.phone)}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-post <span className="text-error">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            placeholder="namn@example.com"
            autoComplete="email"
            maxLength={254}
            {...register("email")}
            className={inputClass(!!errors.email)}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="comment" className={labelClass}>
            Övriga kommentarer
            <span className="text-text-secondary font-normal ml-1">(frivilligt)</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="T.ex. önskemål om lärare, tider eller annat vi bör veta"
            rows={3}
            maxLength={500}
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

        <button type="submit" className="hidden" />
      </form>
    </StepWrapper>
  );
}
