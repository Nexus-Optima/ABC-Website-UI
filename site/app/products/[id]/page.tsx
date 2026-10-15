import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import IndustryPhoto from "@/components/IndustryPhoto";
import ModuleExplorer from "@/components/ModuleExplorer";
import SavingsCalculator from "@/components/SavingsCalculator";
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
  const n = s.modules.length;

  return (
    <>
      <section className={styles.hero}>
        <Link href="/products" className={styles.back}>
          <i className="material-icons" aria-hidden="true">arrow_back</i>All products
        </Link>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>INDUSTRY · {s.num} · {s.industry.toUpperCase()}</span>
            <h1 className="page-title">{s.name}</h1>
            <p className="page-lead" style={{ maxWidth: "52ch" }}>{s.lead}</p>
            <div className={styles.chips}>
              <span className={styles.chip}>{n} MODULES</span>
              <span className={styles.chip}>1 SOLD STANDALONE</span>
            </div>
            <div className={styles.heroActions}>
              <Link href="/contact" className="link-underline">Talk to Us</Link>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <IndustryPhoto suite={s} sizes="(max-width: 1099px) 100vw, 560px" priority />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="rule" />
          <div className="eyebrow">THE PROBLEMS WE SOLVE</div>
          <h2 className="h2" style={{ maxWidth: "26ch", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Where {s.industry.toLowerCase()} planning loses money today.
          </h2>
        </div>
        <div className={`cells ${styles.problems}`}>
          {s.problems.map((p) => (
            <div key={p.title} className={`cell ${styles.problem}`}>
              <span className="chip"><i className="material-icons" aria-hidden="true">{p.icon}</i></span>
              <div className="cell-title" style={{ fontSize: 18 }}>{p.title}</div>
              <p className="cell-text">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`section section--soft ${styles.aps}`}>
        <div className={styles.apsHead}>
          <div className={styles.apsKicker}>
            <span className={styles.apsBadge}><i className="material-icons" aria-hidden="true">precision_manufacturing</i></span>
            <span className={styles.apsEyebrow}>ADVANCED PLANNING &amp; SCHEDULING · {String(n).padStart(2, "0")} MODULES</span>
          </div>
          <h2 className={styles.apsTitle}>APS</h2>
          <p className={styles.apsFlow}>{s.flow}</p>
        </div>
        <ModuleExplorer suiteId={s.id} />
      </section>

      <SavingsCalculator suiteId={s.id} />

      <section className={styles.contactBand}>
        <Link href="/contact" className={`btn ${styles.contactBtn}`}>Talk to Us</Link>
      </section>
    </>
  );
}
