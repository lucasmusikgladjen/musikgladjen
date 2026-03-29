import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anmälan — Musikglädjen",
  description:
    "Anmäl ditt barn till musiklektioner hemma hos er med Musikglädjen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
