import type { Metadata } from "next";
import Link from "next/link";
import IndustryPhoto from "@/components/IndustryPhoto";
import { suites } from "@/lib/data";
import styles from "./products.module.css";

export const metadata: Metadata = { title: "Products" };

const PLATFORM = [
  { icon: "storage", title: "Data you can date", text: "Every screen shows when its order data was last refreshed, so you know what you are planning on." },
  { icon: "rule", title: "Constraint model", text: "Machine limits and plant rules are modelled as constraints. A plan that breaks one is refused." },
  { icon: "calculate", title: "Optimisation solver", text: "Each plan is solved against clear goals, such as weaving cutoffs, changeover time or trim." },
  { icon: "tune", title: "Planner override", text: "Any plan can be edited by hand. Each change is checked against your constraints before it is saved." },
  { icon: "update", title: "Change without starting over", text: "Correct a plan by hand without rerunning it, or test a change before you commit it." },
  { icon: "sync_alt", title: "SAP orders in, Excel out", text: "Orders arrive from SAP each day. Plans export to Excel; slitting plans re-import in the same format." },
];

const STEPS = [
  { when: "WEEKS 1–2", title: "Data audit", text: "We collect orders, masters and one real week of schedules, and fix what doesn't reconcile." },
  { when: "WEEKS 2–4", title: "Constraint model", text: "Your planners and our engineers write down the rules the plant actually runs on." },
  { when: "WEEKS 4–6", title: "Parallel run", text: "The solver plans alongside your team. Every difference is explained line by line." },
  { when: "WEEK 6 ONWARD", title: "Go live", text: "Planners run the system daily. We tune the model as the plant changes." },
];

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">PRODUCTS</div>
        <h1 className="page-title" style={{ maxWidth: "20ch" }}>One planning framework, built per industry.</h1>
        <p className="page-lead">
          Every suite works the same way: your plant&apos;s rules are modelled as constraints, a solver builds the plan, and your planners review and edit it. What changes is the model, built from your industry&apos;s machines up. Buy the full suite or its standalone module.
        </p>
      </section>

      <section className={styles.suites}>
        {suites.map((s, i) => (
          <article key={s.id} className={styles.card}>
            <div className={styles.media}>
              <IndustryPhoto suite={s} sizes="(max-width: 1099px) 100vw, 642px" priority={i === 0} />
            </div>
            <div className={styles.body}>
              <div className={styles.intro}>
                <span className={styles.kicker}>INDUSTRY · {s.num} · {s.industry.toUpperCase()}</span>
                <h2 className={styles.name}>{s.name}</h2>
                <p className={styles.lead}>{s.lead}</p>
              </div>
              <div className="ruled-list">
                <span className="label">MODULES · {s.modules.length}</span>
                {s.modules.map((m) => (
                  <div key={m.id} className={styles.module}>
                    <span className={styles.moduleIcon}><i className="material-icons" aria-hidden="true">{m.icon}</i></span>
                    <div className={styles.moduleText}>
                      <span className={styles.moduleName}>
                        {m.name}
                        {m.standalone && (
                          <span className="standalone-mark" title="Also available standalone" aria-label="Also available standalone">
                            <i className="material-icons" aria-hidden="true">extension</i>
                          </span>
                        )}
                        {m.dev && <span className="tag">IN DEVELOPMENT</span>}
                      </span>
                      <span className={styles.moduleLine}>{m.line}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/products/${s.id}`} className={`btn btn-primary ${styles.view}`}>
                View suite<i className="material-icons" aria-hidden="true">arrow_forward</i>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <span className="rule" />
          <div className="eyebrow">SHARED ACROSS EVERY SUITE</div>
          <h2 className="h2" style={{ maxWidth: "24ch", lineHeight: 1.08, letterSpacing: "-0.03em" }}>Built the same way, whatever you make.</h2>
        </div>
        <div className="cells">
          {PLATFORM.map((p) => (
            <div key={p.title} className="cell">
              <span className="chip"><i className="material-icons" aria-hidden="true">{p.icon}</i></span>
              <div className="cell-title">{p.title}</div>
              <p className="cell-text">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="section-head">
          <span className="rule" />
          <div className="eyebrow">HOW A DEPLOYMENT RUNS</div>
          <h2 className="h2" style={{ maxWidth: "24ch", lineHeight: 1.08, letterSpacing: "-0.03em" }}>From your data to a schedule on the floor.</h2>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((st) => (
            <li key={st.title} className={styles.step}>
              <span className={styles.when}>{st.when}</span>
              <span className="cell-title">{st.title}</span>
              <p className="cell-text">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
