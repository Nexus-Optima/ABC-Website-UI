import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Common = { label: string; required?: boolean; optional?: boolean };

function Label({ label, required, optional }: Common) {
  return (
    <span className="field-label">
      {label}
      {required && <span aria-hidden="true" className="req">*</span>}
      {optional && <> <span className="opt">(OPTIONAL)</span></>}
    </span>
  );
}

export function Field({ label, required, optional, ...input }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <Label label={label} required={required} optional={optional} />
      <input className="input" aria-required={required || undefined} {...input} />
    </label>
  );
}

export function TextArea({ label, required, optional, ...input }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="field">
      <Label label={label} required={required} optional={optional} />
      <textarea className="input" aria-required={required || undefined} {...input} />
    </label>
  );
}

export const EMAIL_RE = /^\S+@\S+\.\S+$/;
