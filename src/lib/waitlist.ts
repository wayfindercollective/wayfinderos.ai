// Waitlist form spec. Mirrors the production form on wayfindercollective.io/waitlist
// exactly - same steps, labels, placeholders, options and validation - so both sites
// feed the same list with the same shape.

export const SPOTS_LEFT = 10; // founders-pass seats shown across the site

// Canonical legal pages live on the Collective site - link, never duplicate,
// so the two can't drift out of sync when one is updated.
export const PRIVACY_URL = "https://wayfindercollective.io/privacy";
export const TERMS_URL = "https://wayfindercollective.io/terms";

export type WaitlistStep = {
  id:
    | "fullName"
    | "email"
    | "phone"
    | "businessName"
    | "currentSoftware"
    | "monthlySpend"
    | "biggestFrustration"
    | "desiredFeature";
  question: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export const WAITLIST_STEPS: WaitlistStep[] = [
  {
    id: "fullName",
    question: "What's your name?",
    type: "text",
    placeholder: "John Smith",
    required: true,
  },
  {
    id: "email",
    question: "What's your email?",
    type: "email",
    placeholder: "john@company.com",
    required: true,
  },
  {
    id: "phone",
    question: "Best number to reach you?",
    type: "tel",
    placeholder: "(555) 123-4567",
    required: true,
  },
  {
    id: "businessName",
    question: "What's your business called?",
    type: "text",
    placeholder: "Your Company",
    required: true,
  },
  {
    id: "currentSoftware",
    question: "What software do you use now?",
    type: "select",
    options: [
      { value: "gohighlevel", label: "GoHighLevel" },
      { value: "close", label: "Close CRM" },
      { value: "hubspot", label: "HubSpot / Pipedrive" },
      { value: "spreadsheets", label: "Spreadsheets + Stripe" },
      { value: "multiple", label: "Multiple disconnected tools" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "monthlySpend",
    question: "Monthly software spend?",
    type: "select",
    options: [
      { value: "0_300", label: "$0-300/mo" },
      { value: "300_1000", label: "$300-1k/mo" },
      { value: "1000_3000", label: "$1k-3k/mo" },
      { value: "3000_5000", label: "$3k-5k/mo" },
      { value: "5000_10000", label: "$5k-10k/mo" },
      { value: "10000_20000", label: "$10k-20k/mo" },
      { value: "20000_plus", label: "$20k+/mo" },
    ],
  },
  {
    id: "biggestFrustration",
    question: "Biggest frustration?",
    type: "textarea",
    placeholder: "What's driving you crazy...",
  },
  {
    id: "desiredFeature",
    question: "What would help most?",
    type: "textarea",
    placeholder: "If we could fix one thing...",
  },
];

export const formatPhone = (v: string) => {
  const t = v.replace(/\D/g, "").slice(0, 10);
  if (t.length <= 3) return t;
  if (t.length <= 6) return `(${t.slice(0, 3)}) ${t.slice(3)}`;
  return `(${t.slice(0, 3)}) ${t.slice(3, 6)}-${t.slice(6, 10)}`;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
