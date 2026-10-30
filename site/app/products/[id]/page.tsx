import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryPhoto from "@/components/IndustryPhoto";
import ModuleExplorer from "@/components/ModuleExplorer";
import { getSuite, suites } from "@/lib/data";
import styles from "./product.module.css";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return suites.map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const suite = getSuite((await params).id);
  return suite ? { title: suite.name, description: suite.lead } : {};
}

export default async function ProductPage({ params }: Params) {
  const s = getSuite((await params).id);
  if (!s) notFound();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className="rule" />
          <div className="eyebrow">{s.industry.toUpperCase()}</div>
          <h1 className={`page-title ${styles.title}`}>{s.name}</h1>
          <p className="page-lead" style={{ maxWidth: "48ch" }}>{s.lead}</p>
        </div>
        <div className={styles.heroMedia}>
          <IndustryPhoto suite={s} sizes="(max-width: 1099px) 100vw, 480px" priority />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="rule" />
          <div className="eyebrow">THE PROBLEMS WE SOLVE</div>
          <h2 className="h2" style={{ maxWidth: "30ch", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Where planning loses money in {s.industry.toLowerCase()} today.
          </h2>
        </div>
        <div className={`cells ${styles.problems}`}>
          {s.problems.map((p) => (
            <div key={p.title} className={`cell ${styles.problem}`}>
              <span className={`chip ${styles.problemChip}`}><i className="material-icons" aria-hidden="true">{p.icon}</i></span>
              <div className="cell-title" style={{ fontSize: 16 }}>{p.title}</div>
              <p className="cell-text" style={{ fontSize: 13.5 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`section section--soft ${styles.aps}`}>
        <div className={styles.apsHead}>
          <div className={styles.apsTitleRow}>
            <span className={styles.apsBadge}><i className="material-icons" aria-hidden="true">precision_manufacturing</i></span>
            <h2 className={styles.apsTitle}>APS</h2>
          </div>
          <p className={styles.apsFlow}>{s.flow}</p>
        </div>
        <ModuleExplorer suiteId={s.id} />
      </section>
    </>
  );
}
