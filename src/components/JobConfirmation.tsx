"use client";

import { JobFormData } from "@/lib/job-types";
import JobFormHeader from "./JobFormHeader";

interface JobConfirmationProps {
  data: JobFormData;
}

export default function JobConfirmation({ data }: JobConfirmationProps) {
  const firstName = data.name.split(" ")[0];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f5f4f0]">
      <JobFormHeader />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Vad kul att du vill jobba hos oss!
            </h1>
            <p className="text-sm text-text-secondary mb-8">
              Vi ringer upp dig inom de närmaste dagarna.
            </p>
            <a
              href="https://www.musikgladjen.se/jobb"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 sm:py-4 px-6 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-lg shadow-primary/20"
            >
              Till startsidan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="w-32 md:w-44 flex-shrink-0">
            <img
              src="/Musikglädjen 3.svg"
              alt=""
              aria-hidden="true"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
