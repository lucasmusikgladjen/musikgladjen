"use client";

import { useFormContext } from "react-hook-form";
import { INSTRUMENTS, type FormData } from "@/lib/schema";

export default function StepInstruments({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<FormData>();
  const selected = watch("instruments") || [];
  const showOther = selected.includes("Övrigt");

  function toggle(name: string) {
    const updated = selected.includes(name)
      ? selected.filter((s) => s !== name)
      : [...selected, name];
    setValue("instruments", updated, { shouldValidate: true });
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-2">
        Vilket eller vilka instrument är intressanta?
      </h2>
      <p className="text-text-secondary text-center mb-6">
        Välj gärna flera — det hjälper oss hitta rätt lärare.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.name}
            type="button"
            onClick={() => toggle(inst.name)}
            className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl text-base font-medium transition-all duration-200 border-2 cursor-pointer min-h-[80px] ${
              selected.includes(inst.name)
                ? "bg-accent-soft border-primary text-primary"
                : "bg-white border-gray-200 hover:border-primary"
            }`}
          >
            <span className="text-2xl">{inst.emoji}</span>
            <span>{inst.name}</span>
          </button>
        ))}
      </div>

      {showOther && (
        <div className="mb-4">
          <label
            htmlFor="instrumentOther"
            className="block text-sm font-medium mb-1 text-text-secondary"
          >
            Berätta kort vilket instrument
          </label>
          <input
            id="instrumentOther"
            type="text"
            {...register("instrumentOther")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition min-h-[44px]"
            placeholder="T.ex. ukulele, cello..."
          />
        </div>
      )}

      {errors.instruments && (
        <p className="text-error text-sm mb-4" role="alert">
          {errors.instruments.message}
        </p>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary transition cursor-pointer"
        >
          Tillbaka
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] cursor-pointer"
        >
          Nästa
        </button>
      </div>
    </div>
  );
}
