"use client";

import { useState, Suspense } from "react";
import { JobFormData } from "@/lib/job-types";
import JobTestApplicationForm from "@/components/JobTestApplicationForm";
import JobConfirmation from "@/components/JobConfirmation";

function JobbTestPageInner() {
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

  return <JobTestApplicationForm onComplete={handleComplete} />;
}

export default function JobbTestPage() {
  return (
    <Suspense>
      <JobbTestPageInner />
    </Suspense>
  );
}
