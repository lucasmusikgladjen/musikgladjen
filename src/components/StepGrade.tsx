"use client";

import { useFormContext } from "react-hook-form";
import { GRADES, type FormData } from "@/lib/schema";

export default function StepGrade({ onNext }: { onNext: () => void }) {
  const { setValue, watch } = useFormContext<FormData>();
  const selected = watch("grade");

  function handleSelect(grade: string) {
    setValue("grade", grade, { shouldValidate: true });
    setTimeout(onNext, 300);
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-8">
        Vilken årskurs går eleven i?
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {GRADES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => handleSelect(g)}
            className={`px-5 py-3 rounded-full text-base font-medium transition-all duration-200 border-2 cursor-pointer min-h-[44px] ${
              selected === g
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-primary border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
