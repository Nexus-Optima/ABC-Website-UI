import Link from "next/link";
import HeroSheets from "@/components/HeroSheets";
import IndustryAccordion from "@/components/IndustryAccordion";
import styles from "./home.module.css";

const WHY = [
  { icon: "layers", title: "Depth over breadth", text: "Two industries modelled properly, not twenty configured badly." },
  { icon: "calculate", title: "A solver, not a guess", text: "An optimisation engine running against constraints you can read." },
  { icon: "tune", title: "Planners stay in charge", text: "Any plan can be overridden. The cost of the override is recorded.", short: "Any plan can be overridden. The cost is recorded." },
  { icon: "storage", title: "Data layer first", text: "We reconcile and fix the inputs before we optimise anything." },
  { icon: "schedule", title: "Weeks, not quarters", text: "A first validated schedule in weeks, not a multi-quarter programme.", short: "A first validated schedule in weeks, not quarters." },
  { icon: "build_circle", title: "Built for a bad day", text: "A machine drops at 02:00. Replanning is routine, not a crisis.", short: "A machine drops at 02:00. Replanning is routine." },
];

// Mobile-only proof strip. Superscripts mark placeholder figures (see footer note).
const STATS = [
  { value: "18%", sup: "1", label: "TRIM RECOVERED" },
  { value: "31%", sup: "2", label: "PLANNER HOURS BACK" },
  { value: "2", label: "INDUSTRIES LIVE" },
  { value: "6 WK", sup: "3", label: "TO FIRST SCHEDULE" },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={`${styles.kicker} mobile-only`}>
            MATHEMATICAL OPTIMISATION<br />PRODUCTION PLANNING &amp; SCHEDULING
          </div>
          <h1 className={styles.title}>From spreadsheet to executable schedule.</h1>
          <p className={styles.lead}>Your constraints, stated once and enforced — resolved into a schedule your plant can run today.</p>
          <div className={`${styles.heroActions} mobile-only`}>
            <Link href="/demo" className="btn btn-caps">REQUEST A DEMO</Link>
            <Link href="/contact" className={styles.textLink}>Talk to Us</Link>
          </div>
        </div>
        <div className={styles.heroFigure}>
          <HeroSheets />
        </div>
      </section>

      <div className={`${styles.stats} mobile-only`}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statValue}>
              {s.value}
              {s.sup && <sup>{s.sup}</sup>}
            </div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <section id="why" data-sec="why" className="section">
        <div className={`section-head ${styles.whyHead}`}>
          <span className="rule" />
          <h2 className="h2">Why Applied Bell Curve</h2>
        </div>
        <div className="cells cells--list">
          {WHY.map((w) => (
            <div key={w.title} className="cell">
              <span className="chip"><i className="material-icons" aria-hidden="true">{w.icon}</i></span>
              <div className="cell-body">
                <div className="cell-title">{w.title}</div>
                <p className="cell-text">
                  {w.short ? (
                    <>
                      <span className="desktop-only">{w.text}</span>
                      <span className="mobile-only">{w.short}</span>
                    </>
                  ) : (
                    w.text
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="industries" data-sec="industries" className="section">
        <div className={`section-head ${styles.indHead}`}>
          <span className="rule" />
          <h2 className="h2">Industries We Serve</h2>
        </div>
        <IndustryAccordion />
        <div className={`${styles.notListed} desktop-only`}>
          <span>Industry not listed?</span>
          <Link href="/industries#not-listed" className="btn btn-outline">
            Check feasibility<i className="material-icons" aria-hidden="true">arrow_forward</i>
          </Link>
        </div>
      </section>
    </>
  );
}
