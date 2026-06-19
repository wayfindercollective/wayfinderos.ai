import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wayfinderos.com"),
  title: "Wayfinder OS — Everything orbits. Nothing leaves.",
  description:
    "The operating system for coaching companies. CRM, payments, dialer, inbox, booking, video, email and your website — ten tools collapsed into one core.",
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
  },
  openGraph: {
    title: "Wayfinder OS — Everything orbits. Nothing leaves.",
    description:
      "Ten tools collapsed into one core. The operating system built for coaching companies.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
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
