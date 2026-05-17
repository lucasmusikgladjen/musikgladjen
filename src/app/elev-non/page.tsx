"use client";

import { useState } from "react";
import { ElevNonFormData } from "@/lib/elev-non-types";
import ElevNonRegistrationForm from "@/components/ElevNonRegistrationForm";
import ElevNonConfirmation from "@/components/ElevNonConfirmation";

export default function ElevNonPage() {
  const [completed, setCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ElevNonFormData | null>(null);

  const handleComplete = (data: ElevNonFormData) => {
    setSubmittedData(data);
    setCompleted(true);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completed && submittedData) {
    return <ElevNonConfirmation data={submittedData} />;
  }

  return <ElevNonRegistrationForm onComplete={handleComplete} />;
}
