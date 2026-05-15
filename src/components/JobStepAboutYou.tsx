"use client";

import StepWrapper from "./StepWrapper";

interface JobStepAboutYouProps {
  musicExperience: string;
  childrenExperience: string;
  onMusicExperienceChange: (value: string) => void;
  onChildrenExperienceChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function JobStepAboutYou({
  musicExperience,
  childrenExperience,
  onMusicExperienceChange,
  onChildrenExperienceChange,
  onNext,
  onBack,
}: JobStepAboutYouProps) {
  const canProceed =
    musicExperience.trim().length >= 10 &&
    childrenExperience.trim().length >= 10;

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!canProceed}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Mer om dig
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Det här hjälper oss förstå vem du är och matcha dig med rätt elever.
      </p>

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
          placeholder="T.ex. hur länge du spelat, vilka genrer du gillar, om du tagit lektioner eller är självlärd..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base bg-bg-white resize-none"
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
        <p className="text-xs text-text-secondary mb-2">
          T.ex. tränare, läxhjälp, syskon, barnvakt etc.
        </p>
        <textarea
          id="childrenExp"
          value={childrenExperience}
          onChange={(e) => onChildrenExperienceChange(e.target.value)}
          placeholder="Berätta kort om dina erfarenheter av att jobba med eller vara runt barn..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base bg-bg-white resize-none"
          maxLength={2000}
        />
        <p className="text-xs text-text-secondary mt-1 text-right">
          {childrenExperience.length}/2000
        </p>
      </div>
    </StepWrapper>
  );
}
