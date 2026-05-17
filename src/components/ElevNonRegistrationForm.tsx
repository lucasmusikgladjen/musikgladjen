"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ElevNonFormData, ElevNonContactFields, emptyChild } from "@/lib/elev-non-types";
import { PRICE_TABLE } from "@/lib/types";
import { pushEvent, getUTMParams, getReferralCodeFromURL, getReferrer, getUserAgent } from "@/lib/tracking";
import FormHeader from "./FormHeader";
import ProgressBar from "./ProgressBar";
import ElevNonStepGrade from "./ElevNonStepGrade";
import ElevNonStepInstrument from "./ElevNonStepInstrument";
import ElevNonStepChildren from "./ElevNonStepChildren";
import ElevNonStepContact from "./ElevNonStepContact";
import StepPricing from "./StepPricing";

type View = "grade" | "instrument" | "children" | "contact" | "pricing";

// 3 main phases: Barn (0), Kontakt (1), Pris (2)
const TOTAL_PHASES = 3;

interface ElevNonRegistrationFormProps {
  onComplete: (data: ElevNonFormData) => void;
}

export default function ElevNonRegistrationForm({ onComplete }: ElevNonRegistrationFormProps) {
  const [currentView, setCurrentView] = useState<View>("grade");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const lastSubmitRef = useRef(0);
  const [honeypot, setHoneypot] = useState("");

  const [formData, setFormData] = useState<ElevNonFormData>({
    children: [emptyChild()],
    guardianName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    comment: "",
    instrumentAtHome: "",
    expectations: [],
    frequency: "weekly",
    lessonLength: "45-60",
    startPreference: "asap",
    formVariant: "elev-non",
  });

  useEffect(() => {
    pushEvent("form_start", { form_name: "musikgladjen_signup", form_variant: "elev-non" });
  }, []);

  const progressStep =
    currentView === "contact" ? 1 : currentView === "pricing" ? 2 : 0;

  // Grade (step 1) — updates first child's grade
  const handleGradeChange = useCallback((grade: string) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((c, i) => (i === 0 ? { ...c, grade } : c)),
    }));
  }, []);

  // Instrument (step 2) — updates first child's instruments
  const handleInstrumentsChange = useCallback((instruments: string[]) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((c, i) => (i === 0 ? { ...c, instruments } : c)),
    }));
  }, []);

  const handleInstrumentOtherChange = useCallback((instrumentOther: string) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((c, i) => (i === 0 ? { ...c, instrumentOther } : c)),
    }));
  }, []);

  const handleChildrenChange = useCallback((children: ElevNonFormData["children"]) => {
    setFormData((prev) => ({ ...prev, children }));
  }, []);

  const handleContactChange = useCallback((data: ElevNonContactFields) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateFormField = useCallback(
    <K extends keyof Omit<ElevNonFormData, "children">>(key: K, value: ElevNonFormData[K]) => {
      setFormData((prev) => {
        const updated = { ...prev, [key]: value };
        if (key === "frequency" || key === "lessonLength") {
          const freq = key === "frequency" ? (value as string) : prev.frequency;
          const len = key === "lessonLength" ? (value as string) : prev.lessonLength;
          (updated as Record<string, unknown>).monthlyPrice = PRICE_TABLE[len]?.[freq] ?? 0;
        }
        return updated;
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;
    if (honeypot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const utmParams = getUTMParams();
    const refCode = getReferralCodeFromURL();

    const payload = {
      ...formData,
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
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        console.log("Webhook payload (no URL configured):", payload);
      }
      pushEvent("form_submit", { form_name: "musikgladjen_signup", form_variant: "elev-non" });
      onComplete(formData);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError("Något gick fel. Kontrollera din internetanslutning och försök igen.");
      pushEvent("form_submit_error", { form_name: "musikgladjen_signup", form_variant: "elev-non" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, honeypot, onComplete]);

  const firstChild = formData.children[0];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <FormHeader />

      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <ProgressBar currentStep={progressStep} totalSteps={TOTAL_PHASES} />

        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
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
          {currentView === "grade" && (
            <ElevNonStepGrade
              grade={firstChild.grade}
              onGradeChange={handleGradeChange}
              onNext={() => setCurrentView("instrument")}
            />
          )}

          {currentView === "instrument" && (
            <ElevNonStepInstrument
              childName=""
              value={firstChild.instruments}
              otherValue={firstChild.instrumentOther}
              onChange={handleInstrumentsChange}
              onOtherChange={handleInstrumentOtherChange}
              onNext={() => setCurrentView("children")}
              onBack={() => setCurrentView("grade")}
            />
          )}

          {currentView === "children" && (
            <ElevNonStepChildren
              children={formData.children}
              onChange={handleChildrenChange}
              onNext={() => setCurrentView("contact")}
              onBack={() => setCurrentView("instrument")}
            />
          )}

          {currentView === "contact" && (
            <ElevNonStepContact
              values={{
                guardianName: formData.guardianName,
                address: formData.address,
                postalCode: formData.postalCode,
                city: formData.city,
                phone: formData.phone,
                email: formData.email,
              }}
              comment={formData.comment}
              onCommentChange={(v) => setFormData((prev) => ({ ...prev, comment: v }))}
              instrumentAtHome={formData.instrumentAtHome}
              onInstrumentAtHomeChange={(v) => setFormData((prev) => ({ ...prev, instrumentAtHome: v }))}
              onChange={handleContactChange}
              onNext={() => setCurrentView("pricing")}
              onBack={() => setCurrentView("children")}
            />
          )}

          {currentView === "pricing" && (
            <StepPricing
              frequency={formData.frequency}
              lessonLength={formData.lessonLength}
              startPreference={formData.startPreference}
              expectations={formData.expectations}
              onFrequencyChange={(v) => updateFormField("frequency", v)}
              onLessonLengthChange={(v) => updateFormField("lessonLength", v)}
              onStartPreferenceChange={(v) => updateFormField("startPreference", v)}
              onExpectationsChange={(v) => updateFormField("expectations", v)}
              onSubmit={handleSubmit}
              onBack={() => setCurrentView("contact")}
              isSubmitting={isSubmitting}
              submitError={submitError}
              greenFrequencyPill
            />
          )}
        </div>
      </div>
    </div>
  );
}
