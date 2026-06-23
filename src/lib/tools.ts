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

// Additional platform modules shown in the grid/bento (beyond the orbiting core tools).
export const EXTRAS: Tool[] = [
  {
    key: "automations",
    label: "Automations",
    title: "Automations",
    desc: "If-this-then-that across your whole stack. Trigger on new leads, deal-stage changes, inbound messages or calendar events — then email, text, AI-call, update deals, or wait for a reply.",
    svg: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
  },
  {
    key: "reporting",
    label: "Analytics",
    title: "Analytics & Reporting",
    desc: "Full P&L with forward projections, sales attribution, funnel health, speed-to-lead and margin analysis — fed by a live bank-feed (Mercury / Plaid) so the numbers reconcile themselves.",
    svg: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  },
  {
    key: "team",
    label: "Team",
    title: "Team & Leaderboards",
    desc: "Live team-activity dashboard, sales leaderboards, speed-to-lead rankings and a live office view — with per-coach data isolation underneath.",
    svg: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  },
  {
    key: "portal",
    label: "Portal",
    title: "Customer Portal",
    desc: "Customers view orders, payment history and upcoming payments, and update their own cards — fewer support tickets for you.",
    svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.66a8 8 0 0 1 10 0"/>',
  },
  {
    key: "products",
    label: "Checkout",
    title: "Products & Checkout",
    desc: "Branded checkout pages and SKU management, wired to the same CRM, payments and analytics as everything else.",
    svg: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  },
  {
    key: "compliance",
    label: "Compliance",
    title: "Compliance, built in",
    desc: "TCPA and DNC handling, SMS consent and STOP-keywords, plus a HIPAA / PHI mode for medical. We keep your outbound legal.",
    svg: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  },
];

// AI capabilities (dedicated AI-native section).
export const AI_POINTS = [
  { t: "AI email drafting", d: "Replies and campaigns drafted in each coach's own voice.", svg: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>' },
  { t: "AI lead scoring", d: "Every form, call and webchat scored so reps work the hottest leads first.", svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
  { t: "Call summaries & scorecards", d: "Automatic transcription, one-paragraph recaps, and objection & coaching scorecards.", svg: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>' },
  { t: "AI buyer personas", d: "Generated from your real pipeline, not a generic template.", svg: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>' },
  { t: "AI upsell briefs", d: "The next best offer for each customer, written for you.", svg: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>' },
  { t: "AI voice campaigns", d: "Outbound that dials and qualifies leads automatically.", svg: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>' },
];

// Coaching-specific moat features.
export const COACHING_POINTS = [
  { t: "AI deal insights", d: "AI reads every call, email and stage change, then tells you exactly where each deal stands and the next move — before you even open it.", svg: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>' },
  { t: "Cohort tracking", d: "Track students through cohorts and program history per customer — not just deals through pipeline stages.", svg: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>' },
  { t: "Per-coach voice profiles", d: "Every AI draft and call sounds like the coach who owns the relationship.", svg: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>' },
  { t: "Live sales leaderboards", d: "Leaderboards, speed-to-lead rankings and a live office view that keep reps moving.", svg: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>' },
];

// The Wayfinder arrow mark, as polyline points in a 120x120 box (from public/brand/logo.svg).
export const ARROW_POINTS: [number, number][] = [
  [25, 95],
  [50, 35],
  [95, 80],
  [50, 60],
  [25, 95],
];
