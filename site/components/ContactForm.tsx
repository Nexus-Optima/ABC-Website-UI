"use client";

import { useState } from "react";
import { EMAIL_RE, Field, TextArea } from "@/components/FormField";
import { submitForm } from "@/lib/api";

const BLANK = { name: "", phone: "", email: "", company: "", msg: "" };

export default function ContactForm() {
  const [v, setV] = useState(BLANK);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const miss = ([["name", "name"], ["phone", "phone number"], ["msg", "message"]] as const).filter(([k]) => !v[k].trim()).map((x) => x[1]);
    if (miss.length) return setError("Add your " + miss.join(", ") + " to continue.");
    if (v.email.trim() && !EMAIL_RE.test(v.email)) return setError("Enter a valid work email.");
    setError("");
    setSubmitting(true);
    try {
      await submitForm("contact", v);
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
        <div className="label">MESSAGE SENT</div>
        <h3 className="success-title">Thank you, {v.name}.</h3>
        <p className="success-text">We will get back to you within one business day.</p>
        <button type="button" className="btn btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => { setV(BLANK); setSubmitted(false); }}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label="FULL NAME" required value={v.name} onChange={set("name")} autoComplete="name" />
        <Field label="PHONE NUMBER" required type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" />
        <Field label="WORK EMAIL" type="email" value={v.email} onChange={set("email")} autoComplete="email" />
        <Field label="COMPANY" value={v.company} onChange={set("company")} autoComplete="organization" />
      </div>
      <TextArea label="MESSAGE" required rows={6} value={v.msg} onChange={set("msg")} />
      {error && <div className="form-error" role="alert">{error}</div>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <span style={{ font: "400 12.5px/1.5 var(--sans)", color: "var(--muted)", maxWidth: "36ch" }}>
          Your details are used only to reply to this message.
        </span>
        <button type="submit" className="btn btn-caps" disabled={submitting}>
          {submitting ? "SENDING…" : "SEND MESSAGE"}
        </button>
      </div>
    </form>
  );
}
