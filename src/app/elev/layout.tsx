import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmäl ditt barn musiklektioner",
  robots: { index: false, follow: false },
};

export default function ElevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
