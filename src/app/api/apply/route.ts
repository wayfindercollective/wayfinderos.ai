// Apply form endpoint. Forwards validated applications to the Wayfinder OS webhook
// configured via the WAYFINDER_APPLY_WEBHOOK env var. If it's not set (local dev),
// the application is logged and a success is returned so the flow stays unblocked.

const EMAIL = /.+@.+\..+/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const d = (body ?? {}) as Record<string, unknown>;
  const name = String(d.name ?? "").trim();
  const email = String(d.email ?? "").trim();
  const company = String(d.company ?? "").trim();
  const message = String(d.message ?? "").trim();

  if (!name || !EMAIL.test(email) || !company) {
    return Response.json(
      { ok: false, error: "Name, a valid email, and company are required." },
      { status: 422 }
    );
  }

  const payload = {
    name,
    email,
    company,
    message,
    source: "wayfinderos-site",
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.WAYFINDER_APPLY_WEBHOOK;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WAYFINDER_APPLY_TOKEN
            ? { Authorization: `Bearer ${process.env.WAYFINDER_APPLY_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return Response.json(
          { ok: false, error: "Upstream webhook rejected the application." },
          { status: 502 }
        );
      }
    } catch {
      return Response.json(
        { ok: false, error: "Could not reach the application webhook." },
        { status: 502 }
      );
    }
  } else {
    // No webhook configured yet - log so nothing is lost in local/dev.
    console.log("[apply] new application (set WAYFINDER_APPLY_WEBHOOK to forward):", payload);
  }

  return Response.json({ ok: true });
}
