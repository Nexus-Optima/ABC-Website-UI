import Link from "next/link";
import HeroSheets from "@/components/HeroSheets";
import IndustryAccordion from "@/components/IndustryAccordion";
import styles from "./home.module.css";

const WHY = [
  { icon: "auto_mode", title: "Automation-First", text: "The system builds the plan, so planners stop spending hours on Excel." },
  { icon: "trending_up", title: "Measurable Efficiency Gains", text: "Less downtime, higher throughput and less production waste." },
  { icon: "layers", title: "Depth Over Breadth", text: "We handle the industry-specific problems that off-the-shelf tools miss, instead of forcing a generic fit." },
  { icon: "build_circle", title: "Accommodates Custom Needs", text: "Your plant's rules, processes and workflows are built into the plan, not worked around." },
  { icon: "tune", title: "Stay in Charge", text: "The system proposes, you decide. Any plan can be edited by hand." },
  { icon: "handshake", title: "A Hands-On Partner", text: "Close collaboration, quick turnarounds, and outcomes shaped around your operation." },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 className={styles.title}>Every order, every machine, every minute. Planned.</h1>
          <p className={styles.lead}>Advanced Planning &amp; Scheduling for manufacturers</p>
        </div>
        <div className={styles.heroFigure}>
          <HeroSheets />
        </div>
      </section>

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
                <p className="cell-text">{w.text}</p>
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
        <div className={styles.notListed}>
          <span>Industry not listed?</span>
          <Link href="/industries#not-listed" className="btn btn-outline">
            Check feasibility<i className="material-icons" aria-hidden="true">arrow_forward</i>
          </Link>
        </div>
      </section>
    </>
  );
}
