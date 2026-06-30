import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Editorial serif for display — warm, human, deliberately not the default SaaS grotesque.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wayfinderos.com"),
  title: "Wayfinder OS — one place to run a coaching company",
  description:
    "We got tired of running our coaching company across seven tools that didn't talk to each other, so we built one that does. CRM, payments, calls, inbox, booking and commissions — all under one login.",
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
  },
  openGraph: {
    title: "Wayfinder OS — one place to run a coaching company",
    description:
      "The whole coaching business under one roof. Built by operators who were sick of duct-taping seven tools together.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
