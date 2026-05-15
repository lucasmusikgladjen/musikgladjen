import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobba hos Musikglädjen",
  robots: { index: false, follow: false },
};

export default function JobbLayout({ children }: { children: React.ReactNode }) {
  return children;
}
