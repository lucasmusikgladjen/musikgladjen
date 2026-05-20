"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { JobFormData, JOB_HOW_FOUND } from "@/lib/job-types";
import { trackMetaLead } from "@/lib/tracking";
import JobFormHeader from "./JobFormHeader";
import ProgressBar from "./ProgressBar";
import JobStepInstruments from "./JobStepInstruments";
import JobStepMotivations from "./JobStepMotivations";
import JobStepJobDetails from "./JobStepJobDetails";
import JobStepAboutYou from "./JobStepAboutYou";
import JobStepCalculator from "./JobStepCalculator";
import JobStepContact from "./JobStepContact";

const TOTAL_STEPS = 6;

const JOB_STEP_SLUGS = [
  "instrument",
  "motivation",
  "omraden",
  "om-dig",
  "loneberakning",
  "kontaktuppgifter",
] as const;

interface JobApplicationFormProps {
  onComplete: (data: JobFormData) => void;
}

export default function JobApplicationForm({
  onComplete,
}: JobApplicationFormProps) {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? "";
  const lockedSource =
    JOB_HOW_FOUND.find((s) => s.toLowerCase() === fromParam.toLowerCase()) ??
    "";

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
    howFound: lockedSource,
  });

  const updateField = useCallback(
    <K extends keyof JobFormData>(key: K, value: JobFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    // Form data is not persisted across reloads, so always start at step 1
    // and rewrite the URL so deep-loads of later steps reset cleanly.
    const url = new URL(window.location.href);
    url.pathname = `/jobb/${JOB_STEP_SLUGS[0]}`;
    window.history.replaceState(null, "", url.toString());
  }, []);

  useEffect(() => {
    const handler = () => {
      const slug = window.location.pathname.split("/").filter(Boolean).pop() ?? "";
      const idx = (JOB_STEP_SLUGS as readonly string[]).indexOf(slug);
      if (idx >= 0) setStep(idx);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => {
      const next = Math.min(s + 1, TOTAL_STEPS - 1);
      if (next !== s) {
        const url = new URL(window.location.href);
        url.pathname = `/jobb/${JOB_STEP_SLUGS[next]}`;
        window.history.pushState(null, "", url.toString());
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleSubmit = useCallback(async () => {
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    if (honeypot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const eventId = crypto.randomUUID();
      const getCookie = (name: string) =>
        document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))?.[2];

      const res = await fetch("/api/jobb-ansokan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventId,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
          eventSourceUrl: window.location.href,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      trackMetaLead(eventId);
      onComplete(formData);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(
        "Något gick fel. Kontrollera din internetanslutning och försök igen.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, honeypot, onComplete]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <JobFormHeader />
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
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
            <JobStepMotivations
              motivations={formData.motivations}
              onMotivationsChange={(v) => updateField("motivations", v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <JobStepJobDetails
              studentCount={formData.studentCount}
              areas={formData.areas}
              onStudentCountChange={(v) => updateField("studentCount", v)}
              onAreasChange={(v) => updateField("areas", v)}
              onNext={goNext}
              onBack={goBack}
              enableAutocomplete
              showStudentCount={false}
              showAreasFieldLabel={false}
            />
          )}
          {step === 3 && (
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
          {step === 4 && <JobStepCalculator onNext={goNext} onBack={goBack} />}
          {step === 5 && (
            <JobStepContact
              name={formData.name}
              birthYear={formData.birthYear}
              address={formData.address}
              postnummer={formData.postnummer}
              city={formData.city}
              phone={formData.phone}
              email={formData.email}
              howFound={formData.howFound}
              howFoundLocked={!!lockedSource}
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
