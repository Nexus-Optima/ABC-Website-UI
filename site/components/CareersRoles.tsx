"use client";

import { useState } from "react";
import { EMAIL_RE, Field, TextArea } from "@/components/FormField";
import { submitForm, uploadFile } from "@/lib/api";
import styles from "./CareersRoles.module.css";

type Role = { id: string; title: string; team: string; location: string; type: string; summary: string; do: string[]; need: string[] };

const ROLES: Role[] = [
  { id: "opt-eng", title: "Optimisation Engineer", team: "Optimisation", location: "HQ · On-site", type: "FULL-TIME",
    summary: "Build and tune the solvers behind our polyfilm and terry towel planning modules. You will turn plant rules into models and make them fast enough for daily use.",
    do: ["Formulate scheduling and cutting-stock problems as MIP and CP models", "Profile and speed up solver runs on real customer data", "Work with planners to validate every constraint you write"],
    need: ["Degree in operations research, applied maths or similar", "Hands-on experience with a MIP or CP solver", "Python, and patience with messy data"] },
  { id: "fs-eng", title: "Senior Full-stack Engineer", team: "Engineering", location: "Hybrid", type: "FULL-TIME",
    summary: "Own the planner-facing web apps: timelines, parameter matrices and the replanning flow. Planners use these screens for hours every day.",
    do: ["Build dense, fast React interfaces for planners", "Design APIs between the solver and the UI", "Ship, observe and fix in production with customers"],
    need: ["5+ years building web applications", "React and a typed backend language", "Care for data-heavy UI and performance"] },
  { id: "data-eng", title: "Data Engineer", team: "Engineering", location: "Hybrid", type: "FULL-TIME",
    summary: "Build the data layer that reconciles ERP exports, spreadsheets and machine masters before anything is optimised.",
    do: ["Build ingestion pipelines from ERP systems and Excel", "Write validation rules that catch bad inputs early", "Own data quality reporting for each deployment"],
    need: ["3+ years in data engineering", "Strong SQL and Python", "Experience with ERP data is a plus"] },
  { id: "impl-tt", title: "Implementation Consultant, Terry Towel", team: "Implementation", location: "Customer sites", type: "FULL-TIME",
    summary: "Lead deployments at terry towel mills, from the first data audit to the parallel run and go-live.",
    do: ["Map a mill's yarn dyeing, warping, weaving and processing route", "Configure constraints with our engineers", "Train planners and run the parallel-run review"],
    need: ["Experience in textile production or planning", "Comfort with data and spreadsheets", "Willingness to travel to plants"] },
  { id: "designer", title: "Product Designer", team: "Design", location: "Hybrid", type: "FULL-TIME",
    summary: "Design tools planners trust with their schedule: Gantt timelines, override flows and variance views.",
    do: ["Research how planners work on the floor", "Design and prototype dense, data-heavy interfaces", "Work day to day with engineers on shipped detail"],
    need: ["A portfolio of complex B2B or data products", "Strong interaction and information design", "Interest in manufacturing"] },
];

const GENERAL: Role = { id: "general", title: "General application", team: "Any team", location: "Any", type: "OPEN",
  summary: "Tell us what you do and where you would help. We read every application.", do: ["Tell us which problems you want to work on"], need: ["A CV and a short note"] };

const TEAMS = ["All", "Engineering", "Optimisation", "Implementation", "Design"];
const BLANK = { name: "", email: "", phone: "", link: "", note: "" };

export default function CareersRoles() {
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [applyId, setApplyId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [general, setGeneral] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cv, setCv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [v, setV] = useState(BLANK);
  const set = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const list = (general ? [GENERAL] : []).concat(ROLES.filter((r) => filter === "All" || r.team === filter));

  const startApply = (id: string) => { setApplyId(id); setError(""); setCvFile(null); setCv(""); setV(BLANK); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = list.find((r) => r.id === applyId);
    const miss = [v.name.trim() ? "" : "name", v.email.trim() ? "" : "email", v.phone.trim() ? "" : "phone number", cvFile ? "" : "CV"].filter(Boolean);
    if (miss.length) return setError("Add your " + miss.join(", ") + " to apply.");
    if (!EMAIL_RE.test(v.email)) return setError("Enter a valid email.");
    setError("");
    setSubmitting(true);
    try {
      let cvKey = "";
      if (cvFile) {
        cvKey = await uploadFile(cvFile);
      }
      await submitForm("career", {
        ...v,
        roleId: applyId!,
        roleTitle: role?.title ?? applyId!,
        cvKey,
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
          <div className="eyebrow">OPEN ROLES · {ROLES.length}</div>
          <h2 className="h2" style={{ lineHeight: 1.08, letterSpacing: "-0.03em" }}>Where you could fit.</h2>
        </div>
        <div className={styles.filters} role="group" aria-label="Filter by team">
          {TEAMS.map((t) => (
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
                  <p className={styles.summary}>{r.summary}</p>
                  <div className={styles.cols}>
                    <div className="ruled-list">
                      <span className="label">WHAT YOU WILL DO</span>
                      {r.do.map((d) => (
                        <div key={d} className="ruled-item" style={{ lineHeight: 1.5 }}>
                          <i className="material-icons" aria-hidden="true">arrow_right</i><span>{d}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ruled-list">
                      <span className="label">WHAT YOU BRING</span>
                      {r.need.map((d) => (
                        <div key={d} className="ruled-item" style={{ lineHeight: 1.5 }}>
                          <i className="material-icons" aria-hidden="true">check</i><span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!applying && !isDone && (
                    <button type="button" className="btn btn-caps" style={{ alignSelf: "flex-start", padding: "16px 26px" }} onClick={() => startApply(r.id)}>
                      APPLY FOR THIS ROLE
                    </button>
                  )}

                  {applying && (
                    <form className={styles.apply} onSubmit={submit} noValidate>
                      <div className={styles.applyLabel}>APPLICATION · {r.title.toUpperCase()}</div>
                      <div className="form-grid">
                        <Field label="FULL NAME" required value={v.name} onChange={set("name")} autoComplete="name" />
                        <Field label="EMAIL" required type="email" value={v.email} onChange={set("email")} autoComplete="email" />
                        <Field label="PHONE NUMBER" required type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" />
                        <Field label="LINKEDIN OR PORTFOLIO" optional value={v.link} onChange={set("link")} autoComplete="url" />
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
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setCvFile(file);
                            setCv(file?.name ?? "");
                          }}
                        />
                      </label>
                      <TextArea label="WHY THIS ROLE?" optional rows={4} value={v.note} onChange={set("note")} />
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
