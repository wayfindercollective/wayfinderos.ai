"use client";

import { useEffect, useState } from "react";

type Form = { name: string; email: string; company: string; message: string };
const EMPTY: Form = { name: "", email: "", company: "", message: "" };

export default function ApplyForm() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<Form>(EMPTY);

  useEffect(() => {
    const openers = Array.from(document.querySelectorAll<HTMLElement>(".apply-open"));
    const onOpen = (e: Event) => {
      e.preventDefault();
      setErr("");
      setOpen(true);
    };
    openers.forEach((b) => b.addEventListener("click", onOpen));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      openers.forEach((b) => b.removeEventListener("click", onOpen));
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/.+@.+\..+/.test(form.email) || !form.company.trim()) {
      setErr("Please add your name, a valid work email, and your company.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error("request failed");
      setOpen(false);
      setForm(EMPTY);
      // hand off to the spatial scene — plays the hyperspace jump -> "Welcome aboard"
      window.dispatchEvent(new CustomEvent("wf:warp"));
    } catch {
      setErr("Something went wrong sending your application. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label="Apply for access">
        <button className="close" type="button" aria-label="Close" onClick={() => setOpen(false)}>
          ×
        </button>
        <div className="eyebrow">Founding access</div>
        <h3>Apply for access</h3>
        <p className="msub">
          Tell us a little about your company and we&apos;ll book a call.
        </p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="af-name">Name</label>
            <input id="af-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="af-email">Work email</label>
            <input id="af-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="af-company">Company</label>
            <input id="af-company" value={form.company} onChange={set("company")} placeholder="Acme Coaching" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="af-msg">What are you trying to replace? (optional)</label>
            <textarea id="af-msg" value={form.message} onChange={set("message")} placeholder="The stack we're duct-taping together right now…" />
          </div>
          {err && <p className="err">{err}</p>}
          <div className="row">
            <button className="btn lg" type="submit" disabled={busy}>
              {busy ? "Launching…" : "Apply for access →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
