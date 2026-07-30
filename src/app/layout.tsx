import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Schlieren AI Analyzer",
  description: "Browser-only Schlieren analysis workstation for engineering teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}