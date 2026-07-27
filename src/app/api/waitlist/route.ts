// Waitlist submissions. Primary destination is the production Wayfinder waitlist
// API (same list the wayfindercollective.io form feeds), with an optional webhook
// fallback. Fails loudly if nothing accepts the lead in production - a silent
// success that drops a lead is worse than an error the visitor can retry.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UPSTREAM =
  process.env.WAYFINDER_WAITLIST_UPSTREAM ??
  "https://wayfindercollective.io/api/internal/waitlist-submit";

// Only these upstream statuses are genuine verdicts about THIS submission, and
// so are terminal - retrying them elsewhere would defeat the upstream's own
// validation and rate limiting. Anything else (401/403/404/405, 5xx, network)
// means the integration itself is broken, which must fail over and be logged
// loudly rather than blaming the visitor's details.
//
// 400 is what the upstream actually returns for field validation today; 422 is
// accepted too so this keeps working if it moves to the more precise code. Both
// are still logged (below) so an integration bug that surfaces as a 400 is
// visible rather than hiding behind a "check your details" message.
const TERMINAL_STATUSES = new Set([400, 422, 429]);

class UpstreamRejected extends Error {
  constructor(readonly status: number) {
    super(`upstream rejected with ${status}`);
  }
}

async function forward(url: string, payload: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (TERMINAL_STATUSES.has(res.status)) throw new UpstreamRejected(res.status);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
}

// The upstream waitlist endpoint rate-limits per client IP (5 / 10 min) and
// reads x-forwarded-for. Because we proxy server-side, it would otherwise see
// this function's IP for EVERY visitor and start 429-ing everyone after the
// fifth submission. Pass the real client IP through so its limiter works
// per-visitor as intended.
function clientIpHeaders(req: Request): Record<string, string> {
  const xff = req.headers.get("x-forwarded-for");
  const ip =
    xff?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "";
  return ip ? { "x-forwarded-for": ip, "x-real-ip": ip } : {};
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const d = (body ?? {}) as Record<string, unknown>;

  // honeypot: real visitors never see this field, so a value means a bot -
  // report success and drop it
  if (String(d.website ?? "").trim()) return Response.json({ ok: true });

  const s = (k: string, max = 500) => String(d[k] ?? "").trim().slice(0, max);
  const fullName = s("fullName", 120);
  const email = s("email", 200);
  const phone = s("phone", 20).replace(/\D/g, "");
  const businessName = s("businessName", 200);

  if (!fullName || !EMAIL.test(email) || phone.length < 10 || !businessName) {
    return Response.json(
      { ok: false, error: "Name, a valid email, a phone number and a business name are required." },
      { status: 422 }
    );
  }

  // exact shape the production waitlist endpoint expects
  const payload = {
    fullName,
    email,
    phone,
    businessName,
    currentSoftware: s("currentSoftware", 60),
    monthlySpend: s("monthlySpend", 60),
    biggestFrustration: s("biggestFrustration", 2000),
    desiredFeature: s("desiredFeature", 2000),
    utm_source: s("utm_source", 200),
    utm_medium: s("utm_medium", 200),
    utm_campaign: s("utm_campaign", 200),
  };

  try {
    await forward(UPSTREAM, payload, clientIpHeaders(req));
    return Response.json({ ok: true });
  } catch (upstreamErr) {
    // Rate limited or rejected: pass the verdict straight back to the visitor.
    if (upstreamErr instanceof UpstreamRejected) {
      const tooMany = upstreamErr.status === 429;
      // logged even though it's the visitor's problem: a spike of these means
      // our validation has drifted from the upstream's
      console.warn("[waitlist] upstream rejected submission", upstreamErr.status);
      return Response.json(
        {
          ok: false,
          error: tooMany
            ? "Too many applications from this connection just now. Please try again shortly."
            : "That application was rejected. Please check your details and try again.",
        },
        { status: tooMany ? 429 : 422 }
      );
    }
    // Anything else is an integration failure on our side - moved endpoint,
    // auth change, outage. Log it as such so it is visible, then fail over.
    console.error("[waitlist] upstream integration failure", upstreamErr);
    const webhook = process.env.WAYFINDER_APPLY_WEBHOOK;
    if (webhook) {
      try {
        await forward(
          webhook,
          { ...payload, source: "wayfinderos-site", receivedAt: new Date().toISOString() },
          process.env.WAYFINDER_APPLY_TOKEN
            ? { Authorization: `Bearer ${process.env.WAYFINDER_APPLY_TOKEN}` }
            : {}
        );
        // The visitor is fine - their lead is captured - but the real funnel got
        // NOTHING, and a silent fallback looks identical to success from the
        // outside. Alert on this string: a steady stream of it means the primary
        // integration is down (e.g. WAITLIST_FUNNEL_SECRET missing upstream) and
        // leads are piling up somewhere nobody is reading.
        console.error(
          "[waitlist][ALERT] primary upstream FAILED - lead delivered via fallback webhook only"
        );
        return Response.json({ ok: true });
      } catch {
        // fall through to the shared failure path below
      }
    }
    if (process.env.NODE_ENV !== "production") {
      // local dev without network/webhook: log so the flow stays testable
      console.log("[waitlist] upstream unreachable, submission was:", payload, upstreamErr);
      return Response.json({ ok: true });
    }
    console.error("[waitlist] FAILED to deliver submission", upstreamErr);
    return Response.json(
      { ok: false, error: "Could not deliver your application. Please try again." },
      { status: 502 }
    );
  }
}
