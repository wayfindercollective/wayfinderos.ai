import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// Geist - the same font family the Wayfinder OS product runs on, so the site and the
// app read as one brand. Sans for everything; mono for labels, numbers and code.

export const metadata: Metadata = {
  metadataBase: new URL("https://wayfinderos.com"),
  title: "Wayfinder OS - one place to run a coaching company",
  description:
    "We got tired of running our coaching company across seven tools that didn't talk to each other, so we built one that does. CRM, payments, calls, inbox, booking and commissions - all under one login.",
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
  },
  openGraph: {
    title: "Wayfinder OS - one place to run a coaching company",
    description:
      "The whole coaching business under one roof. Built by operators who were sick of duct-taping seven tools together.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
