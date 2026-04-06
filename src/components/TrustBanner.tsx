"use client";

const BANNERS: Record<number, { icon: string; bold: string; text: string } | null> = {
  0: null,
  1: null,
  2: {
    icon: "🏠",
    bold: "Vi kommer hem till er",
    text: "— slipper logistik, väntan och stress.",
  },
  3: null,
};

export default function TrustBanner({ step }: { step: number }) {
  const banner = BANNERS[step];
  if (!banner) return null;

  return (
    <div className="bg-accent-soft border border-primary/10 rounded-xl px-4 py-3 mx-4 md:mx-0 mb-4">
      <p className="text-sm text-text-primary">
        <span className="mr-1.5">{banner.icon}</span>
        <span className="font-semibold">{banner.bold}</span>
        {" "}
        <span className="text-text-secondary">{banner.text}</span>
      </p>
    </div>
  );
}
