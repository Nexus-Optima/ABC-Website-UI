"use client";

import { useRef, useState } from "react";
import { EMAIL_RE, Field, TextArea } from "@/components/FormField";
import { MAX_CV_BYTES, jdDownloadUrl, submitForm, uploadFile, type Role } from "@/lib/api";
import styles from "./CareersRoles.module.css";

const GENERAL: Role = { id: "general", title: "General application", team: "Any team", location: "Any", type: "OPEN",
  summary: "Tell us what you do and where you would help. We read every application.", do: ["Tell us which problems you want to work on"], need: ["A CV and a short note"] };

const BLANK = { name: "", email: "", phone: "", link: "", currentCtc: "", expectedCtc: "", note: "" };
const PHONE_RE = /^\d{10}$/;
const CTC_RE = /^\d+(\.\d{1,2})?$/;

export default function CareersRoles({ roles }: { roles: Role[] }) {
  const teams = ["All", ...new Set(roles.map((r) => r.team))];
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [applyId, setApplyId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [general, setGeneral] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cv, setCv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const cvUpload = useRef<{ file: File; promise: Promise<string> } | null>(null);
  const [v, setV] = useState(BLANK);
  const set = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const list = (general ? [GENERAL] : []).concat(roles.filter((r) => filter === "All" || r.team === filter));

  const startApply = (id: string) => { setApplyId(id); setError(""); setCvFile(null); setCv(""); setV(BLANK); cvUpload.current = null; };

  const chooseCv = (file: File | null) => {
    cvUpload.current = null;
    if (file && file.size > MAX_CV_BYTES) {
      setCvFile(null);
      setCv("");
      return setError("Your CV must be under 5 MB.");
    }
    setCvFile(file);
    setCv(file?.name ?? "");
    setError("");
    if (!file) return;
    const promise = uploadFile(file);
    promise.catch(() => {});
    cvUpload.current = { file, promise };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = list.find((r) => r.id === applyId);
    const miss = [
      v.name.trim() ? "" : "name",
      v.email.trim() ? "" : "email",
      v.phone.trim() ? "" : "phone number",
      v.currentCtc.trim() ? "" : "current or last CTC",
      v.expectedCtc.trim() ? "" : "expected CTC",
      cvFile ? "" : "CV",
    ].filter(Boolean);
    if (miss.length) return setError("Add your " + miss.join(", ") + " to apply.");
    if (!EMAIL_RE.test(v.email)) return setError("Enter a valid email.");
    if (!PHONE_RE.test(v.phone.trim())) return setError("Enter a 10-digit phone number.");
    if (!CTC_RE.test(v.currentCtc.trim()) || !CTC_RE.test(v.expectedCtc.trim())) return setError("Enter CTC as a number in lakhs per annum, e.g. 12.");
    setError("");
    setSubmitting(true);
    try {
      let cvKey = "";
      if (cvFile) {
        const pending = cvUpload.current?.file === cvFile ? cvUpload.current.promise : uploadFile(cvFile);
        cvKey = await pending.catch(() => uploadFile(cvFile));
      }
      await submitForm("career", {
        ...v,
        phone: v.phone.trim(),
        currentCtc: v.currentCtc.trim(),
        expectedCtc: v.expectedCtc.trim(),
        roleId: applyId!,
        roleTitle: role?.title ?? applyId!,
        cvKey,
        cvName: cvFile?.name ?? "",
      });
      setDone((d) => ({ ...d, [applyId!]: true }));
      setApplyId(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section section--soft" style={{ paddingBottom: 88 }}>
      <div className={styles.head}>
        <div className="section-head" style={{ margin: 0 }}>
          <span className="rule" />
          <div className="eyebrow">OPEN ROLES · {roles.length}</div>
          <h2 className="h2" style={{ lineHeight: 1.08, letterSpacing: "-0.03em" }}>Where you could fit.</h2>
        </div>
        <div className={styles.filters} role="group" aria-label="Filter by team">
          {teams.map((t) => (
            <button key={t} type="button" className={styles.filter} aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.roles}>
        {list.map((r) => {
          const open = openId === r.id, applying = applyId === r.id, isDone = !!done[r.id];
          return (
            <div key={r.id} className={styles.role}>
              <button
                type="button"
                className={styles.roleHead}
                aria-expanded={open}
                onClick={() => { setOpenId(open ? null : r.id); setApplyId(null); setError(""); }}
              >
                <span className={styles.title}>{r.title}</span>
                <span className={styles.team}>{r.team}</span>
                <span className={styles.loc}><i className="material-icons" aria-hidden="true">location_on</i>{r.location}</span>
                <span className={styles.type}>{r.type}</span>
                <i className={`material-icons ${styles.chev}`} aria-hidden="true">{open ? "expand_less" : "expand_more"}</i>
              </button>

              {open && (
                <div className={styles.body}>
                  <div className={styles.bodyTop}>
                    <p className={styles.summary}>{r.summary}</p>
                    {r.jdKey && (
                      <a className={styles.jd} href={jdDownloadUrl(r.id)} aria-label="Job description">
                        <i className="material-icons" aria-hidden="true">download</i>
                      </a>
                    )}
                  </div>
                  {(r.do.length > 0 || r.need.length > 0) && (
                    <div className={styles.cols}>
                      {r.do.length > 0 && (
                        <div className="ruled-list">
                          <span className="label">WHAT YOU WILL DO</span>
                          {r.do.map((d) => (
                            <div key={d} className="ruled-item" style={{ lineHeight: 1.5 }}>
                              <i className="material-icons" aria-hidden="true">arrow_right</i><span>{d}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {r.need.length > 0 && (
                        <div className="ruled-list">
                          <span className="label">WHAT YOU BRING</span>
                          {r.need.map((d) => (
                            <div key={d} className="ruled-item" style={{ lineHeight: 1.5 }}>
                              <i className="material-icons" aria-hidden="true">check</i><span>{d}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!applying && !isDone && (
                    <button type="button" className="btn btn-caps" style={{ alignSelf: "flex-start", padding: "16px 26px" }} onClick={() => startApply(r.id)}>
                      APPLY FOR THIS ROLE
                    </button>
                  )}

                  {applying && (
                    <form className={styles.apply} onSubmit={submit} noValidate>
                      <div className={styles.applyLabel}>APPLICATION</div>
                      <div className={styles.grid4}>
                        <Field label="FULL NAME" required value={v.name} onChange={set("name")} autoComplete="name" />
                        <Field label="EMAIL" required type="email" value={v.email} onChange={set("email")} autoComplete="email" />
                        <Field
                          label="PHONE NUMBER"
                          required
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="10-digit number"
                          value={v.phone}
                          onChange={(e) => setV((s) => ({ ...s, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                          autoComplete="tel-national"
                        />
                        <Field label="LINKEDIN OR PORTFOLIO" value={v.link} onChange={set("link")} autoComplete="url" />
                      </div>
                      <div className="form-grid">
                        <Field label="CURRENT OR LAST CTC (IN LPA)" required inputMode="decimal" placeholder="e.g. 12" value={v.currentCtc} onChange={set("currentCtc")} />
                        <Field label="EXPECTED CTC (IN LPA)" required inputMode="decimal" placeholder="e.g. 15" value={v.expectedCtc} onChange={set("expectedCtc")} />
                      </div>
                      <label className={styles.upload}>
                        <span className={styles.uploadIcon}><i className="material-icons" aria-hidden="true">upload_file</i></span>
                        <span className={styles.uploadText}>
                          <span className={styles.uploadTitle}>
                            {cv || "Upload your CV"}<span aria-hidden="true" className={styles.req}>*</span>
                          </span>
                          <span className={styles.uploadHint}>PDF or DOCX, up to 5 MB *</span>
                        </span>
                        <span className={styles.choose}>Choose file</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="sr-only"
                          onChange={(e) => chooseCv(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <TextArea label="WHY THIS ROLE?" rows={4} value={v.note} onChange={set("note")} />
                      {error && <div className="form-error" role="alert">{error}</div>}
                      <div className={styles.applyActions}>
                        <button type="submit" className="btn btn-caps" disabled={submitting} style={{ padding: "16px 26px" }}>
                          {submitting ? "SUBMITTING…" : "SUBMIT APPLICATION"}
                        </button>
                        <button type="button" className={styles.cancel} onClick={() => { setApplyId(null); setError(""); }}>Cancel</button>
                      </div>
                    </form>
                  )}

                  {isDone && (
                    <div className={styles.done} role="status">
                      <i className="material-icons" aria-hidden="true">task_alt</i>
                      <div>
                        <span className={styles.doneTitle}>Application received.</span>
                        <span className={styles.doneText}>We read every application and reply within two weeks, whatever the outcome.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.general}>
        <div className={styles.generalCopy}>
          <span className={styles.generalTitle}>No role that fits?</span>
          <span className={styles.generalText}>Send a general application. We keep strong profiles on file as the team grows.</span>
        </div>
        <button
          type="button"
          className={`btn ${styles.generalBtn}`}
          onClick={() => { setGeneral(true); setOpenId("general"); startApply("general"); }}
        >
          General application
        </button>
      </div>
    </section>
  );
}
