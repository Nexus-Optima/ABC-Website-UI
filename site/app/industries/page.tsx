import type { Metadata } from "next";
import Link from "next/link";
import FeasibilityForm from "@/components/FeasibilityForm";
import IndustryPhoto from "@/components/IndustryPhoto";
import { suites } from "@/lib/data";
import styles from "./industries.module.css";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">INDUSTRIES WE SERVE</div>
        <h1 className="page-title" style={{ maxWidth: "18ch" }}>Two industries, modelled in depth.</h1>
        <p className="page-lead" style={{ maxWidth: "60ch" }}>
          We build planning systems for industries where the constraints are physical and the margins are thin. Each one is modelled from the machine up before a single plan is generated.
        </p>
      </section>

      <section className={styles.suites}>
        {suites.map((s, i) => (
          <article key={s.id} className={styles.suite}>
            <div className={styles.media}>
              <IndustryPhoto suite={s} sizes="(max-width: 1099px) 100vw, 560px" priority={i === 0} />
            </div>
            <div className={styles.body}>
              <div className={styles.intro}>
                <span className={styles.kicker}>INDUSTRY · {s.num}</span>
                <h2 className={styles.name}>{s.industry}</h2>
                <p className={styles.desc}>{s.desc}</p>
              </div>
              <div className={styles.cols}>
                <div className="ruled-list">
                  <span className="label">WHAT WE PLAN AROUND</span>
                  {s.constraints.map((c) => (
                    <div key={c} className="ruled-item">
                      <i className="material-icons" aria-hidden="true">check</i>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
                <div className="ruled-list">
                  <span className="label">MODULES · {s.modules.length}</span>
                  {s.modules.map((m) => (
                    <div key={m.id} className={styles.module}>
                      <span className={styles.moduleIcon}><i className="material-icons" aria-hidden="true">{m.icon}</i></span>
                      <span className={styles.moduleName}>{m.name}</span>
                      {m.dev && <span className="tag">IN DEVELOPMENT</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.actions}>
                <Link href={`/products/${s.id}`} className="btn btn-primary">
                  Explore {s.name}<i className="material-icons" aria-hidden="true">arrow_forward</i>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section id="not-listed" data-sec="not-listed" className="section section--soft">
        <div className={styles.notListed}>
          <div className={styles.nlCopy}>
            <span className="rule" />
            <div className="eyebrow">INDUSTRY NOT LISTED</div>
            <h2 className="h2" style={{ maxWidth: "16ch" }}>Check feasibility for your industry.</h2>
            <p className={styles.nlText}>
              If you cannot find your industry listed, describe your process. A planning engineer will review it and tell you whether it fits.
            </p>
          </div>
          <div className={`card ${styles.formCard}`}>
            <FeasibilityForm />
          </div>
        </div>
      </section>
    </>
  );
}
