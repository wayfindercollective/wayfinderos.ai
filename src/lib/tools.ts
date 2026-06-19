// Single source of truth for the Wayfinder OS tool set.
// `svg` holds the inner markup of each Lucide icon (public/icons/*.svg) so it can be
// rendered both in the DOM (Icon component) and onto the WebGL/canvas constellation.

export type Tool = {
  key: string;
  label: string; // short label used by the orbiting constellation
  title: string; // module card title
  desc: string; // module card description
  svg: string; // inner SVG markup (stroke=currentColor, viewBox 0 0 24 24)
};

export const TOOLS: Tool[] = [
  {
    key: "crm",
    label: "CRM",
    title: "CRM & Pipeline",
    desc: "Deals, stages, bulk actions and analytics — wired straight to payments, bookings and commissions.",
    svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  },
  {
    key: "payments",
    label: "Payments",
    title: "Payments & Plans",
    desc: "Stripe + QuickBooks, saved cards, subscriptions, payment plans and failed-payment alerts.",
    svg: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  },
  {
    key: "dialer",
    label: "Dialer",
    title: "AI Dialer",
    desc: "Call recording, transcription, SMS, number porting and AI voice campaigns that auto-qualify leads.",
    svg: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  },
  {
    key: "inbox",
    label: "Inbox",
    title: "Unified Inbox",
    desc: "Email, SMS and webchat threaded per contact. Gmail / IMAP sync and shared templates.",
    svg: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  },
  {
    key: "email",
    label: "Email",
    title: "Email Marketing",
    desc: "Audience segmentation, campaigns, tracking and analytics — triggered by anything in the system.",
    svg: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
  },
  {
    key: "booking",
    label: "Booking",
    title: "Booking & Calendar",
    desc: "Booking pages, two-way Google Calendar sync, reminders, events and cohorts.",
    svg: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  },
  {
    key: "video",
    label: "Video",
    title: "Video Rooms",
    desc: "Persistent video rooms built in. No separate Zoom, no copy-pasting links.",
    svg: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  },
  {
    key: "webchat",
    label: "Web Chat",
    title: "Web Chat Widgets",
    desc: "Embeddable webchat bound per-page to your funnels, routing every lead into the unified inbox.",
    svg: '<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>',
  },
  {
    key: "website",
    label: "Website",
    title: "Website Builder",
    desc: "Build funnels and pages that are wired to the same CRM, payments and analytics as everything else.",
    svg: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  },
  {
    key: "commissions",
    label: "Commissions",
    title: "Commissions & Tiers",
    desc: "Tiered structures, brackets, per-order allocation and automatic tier upgrades. No spreadsheets.",
    svg: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  },
];

// The Wayfinder arrow mark, as polyline points in a 120x120 box (from public/brand/logo.svg).
export const ARROW_POINTS: [number, number][] = [
  [25, 95],
  [50, 35],
  [95, 80],
  [50, 60],
  [25, 95],
];
