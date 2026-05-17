"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ElevNonFormData,
  ElevNonView,
  ElevNonContactFields,
  emptyChild,
} from "@/lib/elev-non-types";
import { PRICE_TABLE } from "@/lib/types";
import { pushEvent, getUTMParams, getReferralCodeFromURL, getReferrer, getUserAgent } from "@/lib/tracking";
import FormHeader from "./FormHeader";
import ProgressBar from "./ProgressBar";
import ElevNonStepGrade from "./ElevNonStepGrade";
import ElevNonStepInstrument from "./ElevNonStepInstrument";
import ElevNonStepSibling from "./ElevNonStepSibling";
import ElevNonStepContact from "./ElevNonStepContact";
import StepPricing from "./StepPricing";

// 3 main phases: Barn (0), Kontakt (1), Pris (2)
const TOTAL_PHASES = 3;

interface ElevNonRegistrationFormProps {
  onComplete: (data: ElevNonFormData) => void;
}

export default function ElevNonRegistrationForm({ onComplete }: ElevNonRegistrationFormProps) {
  const [currentView, setCurrentView] = useState<ElevNonView>("grade");
  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const lastSubmitRef = useRef(0);
  const [honeypot, setHoneypot] = useState("");

  const [formData, setFormData] = useState<ElevNonFormData>({
    children: [emptyChild()],
    guardianName: "",
    address: "",
    postalCode: "",
    phone: "",
    email: "",
    expectations: [],
    frequency: "weekly",
    lessonLength: "45-60",
    startPreference: "asap",
    formVariant: "elev-non",
  });

  useEffect(() => {
    pushEvent("form_start", { form_name: "musikgladjen_signup", form_variant: "elev-non" });
  }, []);

  // Helpers to update the current child
  const updateChild = useCallback(
    <K extends keyof ElevNonFormData["children"][number]>(
      key: K,
      value: ElevNonFormData["children"][number][K]
    ) => {
      setFormData((prev) => {
        const children = prev.children.map((c, i) =>
          i === currentChildIndex ? { ...c, [key]: value } : c
        );
        return { ...prev, children };
      });
    },
    [currentChildIndex]
  );

  const updateFormField = useCallback(
    <K extends keyof Omit<ElevNonFormData, "children">>(
      key: K,
      value: ElevNonFormData[K]
    ) => {
      setFormData((prev) => {
        const updated = { ...prev, [key]: value };
        if (key === "frequency" || key === "lessonLength") {
          const freq = key === "frequency" ? (value as string) : prev.frequency;
          const len = key === "lessonLength" ? (value as string) : prev.lessonLength;
          (updated as ElevNonFormData & { monthlyPrice?: number }).monthlyPrice =
            PRICE_TABLE[len]?.[freq] ?? 0;
        }
        return updated;
      });
    },
    []
  );

  // Progress phase index
  const progressStep =
    currentView === "contact" ? 1 : currentView === "pricing" ? 2 : 0;

  // Navigation
  const goToGrade = useCallback((childIdx: number) => {
    setCurrentChildIndex(childIdx);
    setCurrentView("grade");
  }, []);

  const handleGradeNext = useCallback(() => setCurrentView("instrument"), []);

  const handleInstrumentNext = useCallback(() => setCurrentView("sibling"), []);

  const handleAddSibling = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, emptyChild()],
    }));
    setCurrentChildIndex((i) => i + 1);
    setCurrentView("grade");
  }, []);

  const handleSiblingContinue = useCallback(() => setCurrentView("contact"), []);

  const handleContactChange = useCallback((data: ElevNonContactFields) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleContactNext = useCallback(() => setCurrentView("pricing"), []);

  // Back navigation
  const handleGradeBack = useCallback(() => {
    if (currentChildIndex === 0) return;
    // Go back to sibling screen for previous child (remove the empty child we just added)
    setFormData((prev) => ({
      ...prev,
      children: prev.children.slice(0, -1),
    }));
    setCurrentChildIndex((i) => i - 1);
    setCurrentView("sibling");
  }, [currentChildIndex]);

  const handleInstrumentBack = useCallback(() => setCurrentView("grade"), []);
  const handleSiblingBack = useCallback(() => setCurrentView("instrument"), []);
  const handleContactBack = useCallback(() => setCurrentView("sibling"), []);
  const handlePricingBack = useCallback(() => setCurrentView("contact"), []);

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

  const currentChild = formData.children[currentChildIndex];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <FormHeader />

      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <ProgressBar currentStep={progressStep} totalSteps={TOTAL_PHASES} />

        {/* Honeypot */}
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
              name={currentChild.name}
              onNameChange={(v) => updateChild("name", v)}
              grade={currentChild.grade}
              onGradeChange={(v) => updateChild("grade", v)}
              onNext={handleGradeNext}
              onBack={handleGradeBack}
              showBack={currentChildIndex > 0}
              childIndex={currentChildIndex}
            />
          )}

          {currentView === "instrument" && (
            <ElevNonStepInstrument
              childName={currentChild.name}
              value={currentChild.instruments}
              otherValue={currentChild.instrumentOther}
              onChange={(v) => updateChild("instruments", v)}
              onOtherChange={(v) => updateChild("instrumentOther", v)}
              onNext={handleInstrumentNext}
              onBack={handleInstrumentBack}
            />
          )}

          {currentView === "sibling" && (
            <ElevNonStepSibling
              children={formData.children}
              onAddSibling={handleAddSibling}
              onContinue={handleSiblingContinue}
              onBack={handleSiblingBack}
            />
          )}

          {currentView === "contact" && (
            <ElevNonStepContact
              values={{
                guardianName: formData.guardianName,
                address: formData.address,
                postalCode: formData.postalCode,
                phone: formData.phone,
                email: formData.email,
              }}
              onChange={handleContactChange}
              onNext={handleContactNext}
              onBack={handleContactBack}
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
              onBack={handlePricingBack}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
