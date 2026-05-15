"use client";

import { useState, useCallback, useRef } from "react";
import { JobFormData } from "@/lib/job-types";
import JobFormHeader from "./JobFormHeader";
import ProgressBar from "./ProgressBar";
import JobStepInstruments from "./JobStepInstruments";
import JobStepJobDetails from "./JobStepJobDetails";
import JobStepAboutYou from "./JobStepAboutYou";
import JobStepContact from "./JobStepContact";

const TOTAL_STEPS = 4;

interface JobApplicationFormProps {
  onComplete: (data: JobFormData) => void;
}

export default function JobApplicationForm({ onComplete }: JobApplicationFormProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const lastSubmitRef = useRef(0);
  const [honeypot, setHoneypot] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    instruments: [],
    instrumentOther: "",
    studentCount: "",
    areas: [],
    motivations: [],
    musicExperience: "",
    childrenExperience: "",
    name: "",
    birthYear: "",
    address: "",
    postnummer: "",
    city: "",
    phone: "",
    email: "",
    howFound: "",
  });

  const updateField = useCallback(
    <K extends keyof JobFormData>(key: K, value: JobFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    if (honeypot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/jobb-ansokan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      onComplete(formData);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(
        "Något gick fel. Kontrollera din internetanslutning och försök igen."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, honeypot, onComplete]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <JobFormHeader />
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="w-full max-w-[680px] mx-auto flex-1 flex flex-col">
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
            <JobStepInstruments
              value={formData.instruments}
              otherValue={formData.instrumentOther}
              onChange={(v) => updateField("instruments", v)}
              onOtherChange={(v) => updateField("instrumentOther", v)}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <JobStepJobDetails
              studentCount={formData.studentCount}
              areas={formData.areas}
              motivations={formData.motivations}
              onStudentCountChange={(v) => updateField("studentCount", v)}
              onAreasChange={(v) => updateField("areas", v)}
              onMotivationsChange={(v) => updateField("motivations", v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <JobStepAboutYou
              musicExperience={formData.musicExperience}
              childrenExperience={formData.childrenExperience}
              onMusicExperienceChange={(v) => updateField("musicExperience", v)}
              onChildrenExperienceChange={(v) =>
                updateField("childrenExperience", v)
              }
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <JobStepContact
              name={formData.name}
              birthYear={formData.birthYear}
              address={formData.address}
              postnummer={formData.postnummer}
              city={formData.city}
              phone={formData.phone}
              email={formData.email}
              howFound={formData.howFound}
              onNameChange={(v) => updateField("name", v)}
              onBirthYearChange={(v) => updateField("birthYear", v)}
              onAddressChange={(v) => updateField("address", v)}
              onPostnummerChange={(v) => updateField("postnummer", v)}
              onCityChange={(v) => updateField("city", v)}
              onPhoneChange={(v) => updateField("phone", v)}
              onEmailChange={(v) => updateField("email", v)}
              onHowFoundChange={(v) => updateField("howFound", v)}
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
