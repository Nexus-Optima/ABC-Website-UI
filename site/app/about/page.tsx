import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import styles from "./about.module.css";

export const metadata: Metadata = { title: "About" };

const PILLARS = [
  { label: "WHAT WE DO TODAY", title: "Two industries, run in production.", text: "We run in polyfilm manufacturing and terry towel. In each, we model the plant's machines, materials and changeovers as constraints. The Slitting Planner and Loom Planner run in plants today; other modules are in development." },
  { label: "WHAT COMES NEXT", title: "One industry at a time.", text: "We add industries where constraints are physical and planning is still done by hand. Each new industry starts with a plant that runs it, not a template, and new modules follow the problems our customers bring us." },
  { label: "HOW WE WORK", title: "Model first, planners in charge.", text: "We model your plant's rules before we generate any plan, and accommodate custom needs rather than force a template. Planners keep control of every plan. We measure ourselves on what the plant actually runs." },
];

// TODO: replace placeholder facts with real figures.
const FACTS = [
  { value: "Year", label: "FOUNDED" },
  { value: "City", label: "HEADQUARTERS" },
  { value: "2", label: "INDUSTRIES LIVE" },
  { value: "00", label: "PLANTS PLANNED DAILY" },
];

// TODO: replace with real founder names, roles, bios, photos and LinkedIn URLs.
const FOUNDERS = [1, 2, 3].map((n) => ({
  id: n,
  name: "Founder Name",
  role: "CO-FOUNDER · ROLE",
  bio: "Short paragraph placeholder. Three or four sentences on who they are, the problem they have spent their career on, and what they lead at Applied Bell Curve.",
  linkedin: "#",
}));

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">ABOUT APPLIED BELL CURVE</div>
        <h1 className="page-title" style={{ maxWidth: "22ch" }}>Planning software for factories that know their constraints.</h1>
        <p className="page-lead" style={{ maxWidth: "64ch" }}>
          Applied Bell Curve builds planning and scheduling software for manufacturers. We turn order books, machine data and production rules into plans a plant can run, and replan when the day goes wrong.
        </p>
      </section>

      <section className={`section ${styles.overview}`}>
        <div className="cells">
          {PILLARS.map((p) => (
            <div key={p.label} className={`cell ${styles.pillar}`}>
              <span className={styles.pillarLabel}>{p.label}</span>
              <div className={styles.pillarTitle}>{p.title}</div>
              <p className={styles.pillarText}>{p.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.facts}>
          {FACTS.map((f) => (
            <div key={f.label} className={styles.fact}>
              <span className={styles.factValue}>{f.value}</span>
              <span className={styles.factLabel}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="section-head" style={{ marginBottom: 32 }}>
          <span className="rule" />
          <div className="eyebrow">FOUNDERS</div>
          <h2 className="h2">The people behind the plan.</h2>
        </div>
        <div className={styles.founders}>
          {FOUNDERS.map((f) => (
            <article key={f.id} className={`card ${styles.founder}`}>
              <div className={styles.photo}><ImagePlaceholder caption="Founder photo" /></div>
              <div className={styles.founderBody}>
                <div className={styles.founderHead}>
                  <div className={styles.founderName}>{f.name}</div>
                  <div className={styles.founderRole}>{f.role}</div>
                </div>
                <p className={styles.bio}>{f.bio}</p>
                <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedin}>
                  LinkedIn<i className="material-icons" aria-hidden="true">open_in_new</i>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
