"use client";

import { useState } from "react";
import { JobFormData } from "@/lib/job-types";
import JobApplicationForm from "@/components/JobApplicationForm";
import JobConfirmation from "@/components/JobConfirmation";

export default function JobbPage() {
  const [completed, setCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState<JobFormData | null>(null);

  const handleComplete = (data: JobFormData) => {
    setSubmittedData(data);
    setCompleted(true);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completed && submittedData) {
    return <JobConfirmation data={submittedData} />;
  }

  return <JobApplicationForm onComplete={handleComplete} />;
}
