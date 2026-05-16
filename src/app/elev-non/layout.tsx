import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmäl barn till musiklektioner",
  robots: { index: false, follow: false },
};

export default function ElevNonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
