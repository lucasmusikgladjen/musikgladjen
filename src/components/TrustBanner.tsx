"use client";

const BANNERS: Record<number, { icon: string; bold: string; text: string }> = {
  0: {
    icon: "⏱️",
    bold: "Det tar bara 60 sekunder",
    text: "— och anmälan är helt kostnadsfri och inte bindande.",
  },
  1: {
    icon: "🎯",
    bold: "Personlig matchning",
    text: "— vi hittar en lärare som passar just ert barn.",
  },
  2: {
    icon: "🏠",
    bold: "Vi kommer hem till er",
    text: "— slipper logistik, väntan och stress.",
  },
  3: {
    icon: "🔒",
    bold: "Tryggt och enkelt",
    text: "— ingen bindningstid, avsluta när ni vill.",
  },
};

export default function TrustBanner({ step }: { step: number }) {
  const banner = BANNERS[step] || BANNERS[0];

  return (
    <div className="bg-accent-soft border border-primary/10 rounded-xl px-4 py-3 mx-4 md:mx-0 mb-6">
      <p className="text-sm text-text-primary">
        <span className="mr-1.5">{banner.icon}</span>
        <span className="font-semibold">{banner.bold}</span>
        {" "}
        <span className="text-text-secondary">{banner.text}</span>
      </p>
    </div>
  );
}
