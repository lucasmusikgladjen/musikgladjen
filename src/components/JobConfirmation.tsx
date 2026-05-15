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
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4 leading-tight">
              Tack{firstName ? `, ${firstName}` : ""}!
            </h1>
            <p className="text-lg text-[#444] mb-8">
              Vi hör av oss inom kort.
            </p>
            <a
              href="https://www.musikgladjen.se/jobb"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-4 rounded-full hover:bg-primary/90 transition-colors text-base"
            >
              Till startsidan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="w-56 md:w-72 flex-shrink-0">
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
