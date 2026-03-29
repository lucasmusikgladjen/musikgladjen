"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  defaultValues,
  PRICE_TABLE,
  type FormData,
} from "@/lib/schema";
import { sanitize } from "@/lib/sanitize";
import { pushEvent, getUtmParams } from "@/lib/tracking";
import ProgressBar from "@/components/ProgressBar";
import StepGrade from "@/components/StepGrade";
import StepInstruments from "@/components/StepInstruments";
import StepExpectations from "@/components/StepExpectations";
import StepPersonalInfo from "@/components/StepPersonalInfo";
import StepPricing from "@/components/StepPricing";
import Confirmation from "@/components/Confirmation";

const STEP_NAMES = [
  "grade",
  "instrument",
  "expectations",
  "personal_info",
  "pricing",
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSubmitRef = useRef(0);
  const utmRef = useRef<Record<string, string | null>>({});

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Capture UTM params and fire form_start on mount
  useEffect(() => {
    utmRef.current = getUtmParams();
    pushEvent("form_start", { step_number: 1, step_name: "grade" });
  }, []);

  const goNext = useCallback(() => {
    const currentStepName = STEP_NAMES[step - 1];
    const formValues = methods.getValues();
    pushEvent("form_step_complete", {
      step_number: step,
      step_name: currentStepName,
      ...buildStepData(formValues, step),
    });
    setStep((s) => Math.min(s + 1, 5));
  }, [step, methods]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  async function handleSubmit() {
    // Client-side rate limiting — 5s cooldown
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    const valid = await methods.trigger();
    if (!valid) return;

    const data = methods.getValues();

    // Honeypot check
    if (data.website && data.website.length > 0) return;

    const price =
      PRICE_TABLE[data.lessonLength]?.[data.frequency] ?? 0;

    const payload = {
      grade: data.grade,
      instruments: data.instruments,
      instrumentOther: data.instrumentOther || null,
      expectations: data.expectations,
      studentName: sanitize(data.studentName),
      guardianName: sanitize(data.guardianName),
      address: sanitize(data.address),
      postalCode: data.postalCode,
      phone: data.phone,
      email: data.email,
      frequency: data.frequency,
      lessonLength: data.lessonLength,
      startPreference: data.startPreference,
      monthlyPrice: price,
      meta: {
        submittedAt: new Date().toISOString(),
        ...utmRef.current,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
      if (!webhookUrl) throw new Error("Webhook URL is not configured");

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      pushEvent("form_submit", {
        step_number: 5,
        step_name: "pricing",
        ...buildStepData(data, 5),
        monthlyPrice: price,
      });

      setSubmitted(true);
    } catch {
      pushEvent("form_submit_error", { step_number: 5 });
      setSubmitError(
        "Något gick fel. Kontrollera din internetanslutning och försök igen."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    const vals = methods.getValues();
    return (
      <main className="min-h-screen flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-[560px]">
          <Confirmation guardianName={vals.guardianName} email={vals.email} />
        </div>
      </main>
    );
  }

  return (
    <FormProvider {...methods}>
      <main className="min-h-screen flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-[560px]">
          <ProgressBar current={step} />

          {/* Honeypot */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...methods.register("website")}
            />
          </div>

          {step === 1 && <StepGrade onNext={goNext} />}
          {step === 2 && <StepInstruments onNext={goNext} onBack={goBack} />}
          {step === 3 && <StepExpectations onNext={goNext} onBack={goBack} />}
          {step === 4 && <StepPersonalInfo onNext={goNext} onBack={goBack} />}
          {step === 5 && (
            <StepPricing
              onBack={goBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {submitError && (
            <div
              className="mt-4 p-4 bg-red-50 border border-error rounded-lg text-error text-sm text-center"
              role="alert"
            >
              {submitError}
            </div>
          )}
        </div>
      </main>
    </FormProvider>
  );
}

/** Build cumulative data object for tracking events */
function buildStepData(
  data: FormData,
  step: number
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (step >= 1) result.grade = data.grade;
  if (step >= 2) result.instruments = data.instruments;
  if (step >= 3) result.expectations = data.expectations;
  if (step >= 4) {
    result.studentName = data.studentName;
    result.guardianName = data.guardianName;
  }
  if (step >= 5) {
    result.frequency = data.frequency;
    result.lessonLength = data.lessonLength;
    result.startPreference = data.startPreference;
  }
  return result;
}
