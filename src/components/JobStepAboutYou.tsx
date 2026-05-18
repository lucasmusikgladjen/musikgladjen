"use client";

import StepWrapper from "./StepWrapper";

interface JobStepAboutYouProps {
  musicExperience: string;
  childrenExperience: string;
  onMusicExperienceChange: (value: string) => void;
  onChildrenExperienceChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  noValidation?: boolean;
}

export default function JobStepAboutYou({
  musicExperience,
  childrenExperience,
  onMusicExperienceChange,
  onChildrenExperienceChange,
  onNext,
  onBack,
  noValidation = false,
}: JobStepAboutYouProps) {
  const canProceed =
    musicExperience.trim().length >= 10 &&
    childrenExperience.trim().length >= 10;

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!noValidation && !canProceed}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Om dig
      </h2>

      <div className="mb-6">
        <label
          htmlFor="musicExp"
          className="block text-sm font-semibold text-text-primary mb-1"
        >
          Berätta om dig och dina erfarenheter med musik{" "}
          <span className="text-error">*</span>
        </label>
        <textarea
          id="musicExp"
          value={musicExperience}
          onChange={(e) => onMusicExperienceChange(e.target.value)}
          placeholder="T.ex. hur länge du spelat, vilka genrer du gillar och om du tagit lektioner eller är självlärd"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white resize-none placeholder:text-gray-400 placeholder:text-sm"
          maxLength={2000}
        />
        <p className="text-xs text-text-secondary mt-1 text-right">
          {musicExperience.length}/2000
        </p>
      </div>

      <div>
        <label
          htmlFor="childrenExp"
          className="block text-sm font-semibold text-text-primary mb-1"
        >
          Berätta om dina erfarenheter med barn{" "}
          <span className="text-error">*</span>
        </label>
        <textarea
          id="childrenExp"
          value={childrenExperience}
          onChange={(e) => onChildrenExperienceChange(e.target.value)}
          placeholder="T.ex. tränare för juniorer, läxhjälp eller barnpassning, gärna i vilka sammanhang"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white resize-none placeholder:text-gray-400 placeholder:text-sm"
          maxLength={2000}
        />
        <p className="text-xs text-text-secondary mt-1 text-right">
          {childrenExperience.length}/2000
        </p>
      </div>
    </StepWrapper>
  );
}
