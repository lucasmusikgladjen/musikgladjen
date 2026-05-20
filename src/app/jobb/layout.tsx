import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobba hos Musikglädjen",
};

export default function JobbLayout({ children }: { children: React.ReactNode }) {
  return children;
}
