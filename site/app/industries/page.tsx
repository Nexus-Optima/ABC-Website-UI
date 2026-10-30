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
      <section className={`page-hero ${styles.hero}`}>
        <div className="eyebrow">INDUSTRIES WE SERVE</div>
        <h1 className={`page-title ${styles.title}`}>Two industries, modelled in depth.</h1>
      </section>

      <section className={styles.suites}>
        {suites.map((s, i) => (
          <article key={s.id} className={styles.suite}>
            <div className={styles.media}>
              <IndustryPhoto suite={s} sizes="(max-width: 1099px) 100vw, 440px" priority={i === 0} />
            </div>
            <div className={styles.body}>
              <div className={styles.intro}>
                <h2 className={styles.name}>{s.industry}</h2>
                <p className={styles.desc}>{s.desc}</p>
              </div>
              <div className={`ruled-list ${styles.plan}`}>
                <span className="label">WHAT WE PLAN AROUND</span>
                {s.constraints.map((c) => (
                  <div key={c} className="ruled-item">
                    <i className="material-icons" aria-hidden="true">check</i>
                    <span>{c}</span>
                  </div>
                ))}
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
            <div className={`eyebrow ${styles.nlEyebrow}`}>INDUSTRY NOT LISTED?</div>
            <h2 className={`h2 ${styles.nlTitle}`}>Check feasibility for your industry.</h2>
          </div>
          <div className={`card ${styles.formCard}`}>
            <FeasibilityForm />
          </div>
        </div>
      </section>
    </>
  );
}
