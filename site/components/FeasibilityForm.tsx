"use client";

import { useState } from "react";
import { EMAIL_RE, Field } from "@/components/FormField";
import { submitForm } from "@/lib/api";

const BLANK = { name: "", email: "", company: "", phone: "", industry: "" };

export default function FeasibilityForm() {
  const [v, setV] = useState(BLANK);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const miss = ([["name", "full name"], ["email", "work email"], ["company", "company"], ["phone", "phone number"], ["industry", "industry"]] as const)
      .filter(([k]) => !v[k].trim())
      .map((x) => x[1]);
    if (miss.length) return setError("Add your " + miss.join(", ") + " to continue.");
    if (!EMAIL_RE.test(v.email)) return setError("Enter a valid work email.");
    setError("");
    setSubmitting(true);
    try {
      await submitForm("feasibility", v);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="success" role="status">
        <span className="chip"><i className="material-icons" aria-hidden="true">task_alt</i></span>
        <div className="label">FEASIBILITY REQUEST RECEIVED</div>
        <h3 className="success-title">Thank you, {v.name}.</h3>
        <p className="success-text">A planning engineer will review your process and reply within two business days.</p>
        <button type="button" className="btn btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => { setV(BLANK); setSubmitted(false); }}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label="FULL NAME" required value={v.name} onChange={set("name")} autoComplete="name" />
        <Field label="WORK EMAIL" required type="email" value={v.email} onChange={set("email")} autoComplete="email" />
        <Field label="COMPANY" required value={v.company} onChange={set("company")} autoComplete="organization" />
        <Field label="PHONE NUMBER" required type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" />
        <Field label="YOUR INDUSTRY" required value={v.industry} onChange={set("industry")} placeholder="e.g. Corrugated board" />
      </div>
      {error && <div className="form-error" role="alert">{error}</div>}
      <button type="submit" className="btn btn-caps" disabled={submitting}>
        {submitting ? "SUBMITTING…" : "CHECK FEASIBILITY"}
      </button>
    </form>
  );
}
