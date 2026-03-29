import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anmälan — Musikglädjen",
  description:
    "Anmäl ditt barn till musiklektioner hemma hos er. Personlig lärare, ingen bindningstid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-bg">{children}</body>
    </html>
  );
}
