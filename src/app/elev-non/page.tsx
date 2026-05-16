"use client";

import { useState } from "react";
import { FormData } from "@/lib/types";
import ElevNonRegistrationForm from "@/components/ElevNonRegistrationForm";
import ConfirmationPage from "@/components/ConfirmationPage";

export default function ElevNonPage() {
  const [completed, setCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const handleComplete = (data: FormData, refCode: string | null) => {
    setSubmittedData(data);
    setReferralCode(refCode);
    setCompleted(true);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completed && submittedData) {
    return (
      <ConfirmationPage data={submittedData} referralCode={referralCode} />
    );
  }

  return <ElevNonRegistrationForm onComplete={handleComplete} />;
}
