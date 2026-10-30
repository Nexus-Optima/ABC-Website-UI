"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EMAIL_RE, Field, TextArea } from "@/components/FormField";
import { getSuite, suites } from "@/lib/data";
import { submitForm } from "@/lib/api";

const BLANK = { name: "", phone: "", industry: "", company: "", role: "", email: "", comments: "" };

export default function DemoForm() {
  const params = useSearchParams();
  const [v, setV] = useState(() => {
    const ind = params?.get("industry") ?? "";
    return { ...BLANK, industry: getSuite(ind) ? ind : "" };
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const miss: string[] = [];
    if (!v.name.trim()) miss.push("full name");
    if (!v.phone.trim()) miss.push("phone number");
    if (miss.length) return setError("Add your " + miss.join(", ") + " to continue.");
    if (v.email.trim() && !EMAIL_RE.test(v.email)) return setError("Enter a valid work email.");
    setError("");
    setSubmitting(true);
    try {
      await submitForm("demo", v);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="success" role="status" style={{ gap: 16 }}>
        <h2 className="success-title">Thank you, {v.name}.</h2>
        <p className="success-text">We will contact you within one business day.</p>
        <button type="button" className="btn btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => setSubmitted(false)}>
          Edit request
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form-grid form-grid--auto">
        <Field label="FULL NAME" required value={v.name} onChange={set("name")} autoComplete="name" />
        <Field label="PHONE NUMBER" required type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
        <div style={{ font: "600 10px/1 var(--sans)", letterSpacing: ".14em", color: "var(--navy)" }}>
          OTHER DETAILS <span style={{ color: "var(--muted)", letterSpacing: ".06em", fontWeight: 400 }}>(OPTIONAL)</span>
        </div>
        <div className="form-grid form-grid--auto">
          <label className="field">
            <span className="field-label">INDUSTRY</span>
            <select className="input" value={v.industry} onChange={set("industry")}>
              <option value="">Select</option>
              {suites.map((s) => <option key={s.id} value={s.id}>{s.industry}</option>)}
            </select>
          </label>
          <Field label="COMPANY" value={v.company} onChange={set("company")} autoComplete="organization" />
          <Field label="ROLE" value={v.role} onChange={set("role")} autoComplete="organization-title" />
          <Field label="WORK EMAIL" type="email" value={v.email} onChange={set("email")} autoComplete="email" />
        </div>
        <TextArea label="COMMENTS" rows={3} value={v.comments} onChange={set("comments")} placeholder="Anything we should know before the demo" />
      </div>
      {error && <div className="form-error" role="alert" style={{ fontSize: 13.5 }}>{error}</div>}
      <button type="submit" className="btn btn-caps" disabled={submitting} style={{ alignSelf: "flex-start", padding: "18px 32px", fontSize: 12 }}>
        {submitting ? "SUBMITTING…" : "SUBMIT"}
      </button>
    </form>
  );
}
