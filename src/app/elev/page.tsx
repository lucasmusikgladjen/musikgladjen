"use client";

import { useState } from "react";
import { ElevFormData } from "@/lib/elev-types";
import ElevRegistrationForm from "@/components/ElevRegistrationForm";
import ElevConfirmation from "@/components/ElevConfirmation";

export default function ElevPage() {
  const [completed, setCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ElevFormData | null>(null);

  const handleComplete = (data: ElevFormData) => {
    setSubmittedData(data);
    setCompleted(true);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completed && submittedData) {
    return <ElevConfirmation data={submittedData} />;
  }

  return <ElevRegistrationForm onComplete={handleComplete} />;
}
