"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  FormData,
  PRICE_TABLE,
  STEP_TRACKING_NAMES_B,
} from "@/lib/types";
import {
  pushEvent,
  getUTMParams,
  getReferralCodeFromURL,
  getReferrer,
  getUserAgent,
} from "@/lib/tracking";
import { WebhookPayload } from "@/lib/types";
import FormHeader from "./FormHeader";
import ProgressBar from "./ProgressBar";
import TrustBanner from "./TrustBanner";
import StepGrade from "./StepGrade";
import StepInstrument from "./StepInstrument";
import StepContact from "./StepContact";
import StepPricing from "./StepPricing";

const TOTAL_STEPS = 4;

interface RegistrationFormProps {
  onComplete: (data: FormData, referralCode: string | null) => void;
}

export default function RegistrationForm({
  onComplete,
}: RegistrationFormProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const lastSubmitRef = useRef(0);

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  // Form state
  const [formData, setFormData] = useState<FormData>({
    grade: "",
    gradeOther: "",
    instruments: [],
    instrumentOther: "",
    expectations: [],
    studentName: "",
    guardianName: "",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
    frequency: "weekly",
    lessonLength: "45-60",
    startPreference: "asap",
    monthlyPrice: 1650,
    formVariant: "B",
  });

  // Track form_start on mount
  useEffect(() => {
    pushEvent("form_start", {
      form_name: "musikgladjen_signup",
      form_variant: "B",
    });
  }, []);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData((prev) => {
        const updated = { ...prev, [key]: value };
        // Auto-calculate price
        if (key === "frequency" || key === "lessonLength") {
          const freq = key === "frequency" ? (value as string) : prev.frequency;
          const len =
            key === "lessonLength" ? (value as string) : prev.lessonLength;
          updated.monthlyPrice = PRICE_TABLE[len]?.[freq] ?? 0;
        }
        return updated;
      });
    },
    []
  );

  const goNext = useCallback(() => {
    // Track step completion
    pushEvent("form_step_complete", {
      form_name: "musikgladjen_signup",
      form_variant: "B",
      step_number: step + 1,
      step_name: STEP_TRACKING_NAMES_B[step],
      ...(step >= 0 && { grade: formData.grade }),
      ...(step >= 1 && { instruments: formData.instruments }),
    });
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, [step, formData.grade, formData.instruments]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Rate limiting - 5 second cooldown
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    // Honeypot check
    if (honeypot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const utmParams = getUTMParams();
    const refCode = getReferralCodeFromURL();

    const payload: WebhookPayload = {
      grade: formData.grade,
      gradeOther: formData.gradeOther || null,
      instruments: formData.instruments,
      instrumentOther: formData.instrumentOther || null,
      expectations: formData.expectations,
      studentName: formData.studentName,
      guardianName: formData.guardianName,
      address: formData.address,
      postalCode: formData.postalCode,
      phone: formData.phone,
      email: formData.email,
      frequency: formData.frequency,
      lessonLength: formData.lessonLength,
      startPreference: formData.startPreference,
      monthlyPrice: formData.monthlyPrice,
      formVariant: "B",
      meta: {
        submittedAt: new Date().toISOString(),
        ...utmParams,
        referrer: getReferrer(),
        userAgent: getUserAgent(),
        referralCode: refCode,
      },
    };

    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;

    try {
      if (webhookUrl) {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        // Try to get referral code from response
        let responseReferralCode: string | null = null;
        try {
          const responseData = await res.json();
          responseReferralCode = responseData.referralCode || null;
        } catch {
          // Response may not be JSON
        }
        pushEvent("form_submit", {
          form_name: "musikgladjen_signup",
          form_variant: "B",
        });
        onComplete(formData, responseReferralCode);
      } else {
        // No webhook URL configured - still complete for dev
        console.log("Webhook payload (no URL configured):", payload);
        pushEvent("form_submit", {
          form_name: "musikgladjen_signup",
          form_variant: "B",
        });
        // Generate a simple client-side referral code
        const clientRefCode = btoa(
          `${formData.email}-${Date.now()}`
        ).slice(0, 8).toUpperCase();
        onComplete(formData, clientRefCode);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(
        "Något gick fel. Kontrollera din internetanslutning och försök igen."
      );
      pushEvent("form_submit_error", {
        form_name: "musikgladjen_signup",
        form_variant: "B",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, honeypot, onComplete]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <FormHeader />

      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

        <TrustBanner step={step} />

        {/* Honeypot field */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="flex-1">
          {step === 0 && (
            <StepGrade
              value={formData.grade}
              otherValue={formData.gradeOther}
              onChange={(v) => updateField("grade", v)}
              onOtherChange={(v) => updateField("gradeOther", v)}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <StepInstrument
              value={formData.instruments}
              otherValue={formData.instrumentOther}
              onChange={(v) => updateField("instruments", v)}
              onOtherChange={(v) => updateField("instrumentOther", v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <StepContact
              values={{
                studentName: formData.studentName,
                guardianName: formData.guardianName,
                address: formData.address,
                postalCode: formData.postalCode,
                phone: formData.phone,
                email: formData.email,
              }}
              onChange={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
              }}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepPricing
              frequency={formData.frequency}
              lessonLength={formData.lessonLength}
              startPreference={formData.startPreference}
              expectations={formData.expectations}
              onFrequencyChange={(v) => updateField("frequency", v)}
              onLessonLengthChange={(v) => updateField("lessonLength", v)}
              onStartPreferenceChange={(v) => updateField("startPreference", v)}
              onExpectationsChange={(v) => updateField("expectations", v)}
              onSubmit={handleSubmit}
              onBack={goBack}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
