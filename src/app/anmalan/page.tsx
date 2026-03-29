"use client";

import { useState } from "react";
import { FormData } from "@/lib/types";
import RegistrationForm from "@/components/RegistrationForm";
import ConfirmationPage from "@/components/ConfirmationPage";

export default function AnmalanPage() {
  const [completed, setCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const handleComplete = (data: FormData, refCode: string | null) => {
    setSubmittedData(data);
    setReferralCode(refCode);
    setCompleted(true);
    // Prevent back navigation to form
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completed && submittedData) {
    return (
      <ConfirmationPage data={submittedData} referralCode={referralCode} />
    );
  }

  return <RegistrationForm onComplete={handleComplete} />;
}
