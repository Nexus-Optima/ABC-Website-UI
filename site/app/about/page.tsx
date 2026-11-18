import type { Metadata } from "next";
import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import styles from "./about.module.css";

export const metadata: Metadata = { title: "About" };

const STORY = [
  {
    label: "WHERE WE STARTED",
    text: "We first put that idea to work in packaging films, on a single question: how to cut every jumbo roll with the least trim. That became our Slitting Planner. The Loom Planner followed, scheduling every loom in a terry towel mill. Together they are the foundation of a full Advanced Planning & Scheduling (APS) suite for manufacturers.",
  },
  {
    label: "WHY PLANNING",
    text: "Why planning? It decides what every machine in a plant does next, yet it is often the least supported job in the building. We exist to change that, bringing the maths of optimisation to the planning desk in a form your whole team can use.",
  },
];

type Founder = { name: string; tagline: string; bio: string; photo?: string; linkedin: string };

// TODO: add Shrikant's and Vansh's photos under /public/founders.
const FOUNDERS: Founder[] = [
  {
    name: "Shrikant Sharma",
    tagline: "The craft of every feature",
    bio: "Shrikant holds a B.Tech in Mechanical Engineering from IIT Bombay, so he understands the machines and processes our customers plan around. He spent over five years in product and strategy in the gaming industry, where even feature-packed software must feel easy to use. He brings that thinking to our planning software: powerful underneath, simple on screen.",
    linkedin: "https://www.linkedin.com/in/link-shrikant/",
  },
  {
    name: "Kaivan Shah",
    tagline: "The backbone of every plan",
    bio: "Kaivan has spent over six years building software, including at Amazon, where he learned to design systems that stay reliable under heavy, real-world use. For a manufacturer, a planning system that fails can bring a plant to a stop. That's why he builds ours to be dependable first.",
    photo: "/founders/kaivan-shah.jpg",
    linkedin: "https://www.linkedin.com/in/kaivan-shah-7441b4143/",
  },
  {
    name: "Vansh Chiripal",
    tagline: "The bridge to every plant",
    bio: "Vansh comes from a manufacturing family. As a second-generation entrepreneur at the Chiripal Group, he has worked across several manufacturing businesses and seen firsthand how one planning decision can ripple across the shop floor. That experience keeps our product grounded in how plants actually run, not how they look on paper.",
    linkedin: "https://www.linkedin.com/in/vansh-chiripal/",
  },
];

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className={`page-hero ${styles.hero}`}>
        <div className="eyebrow">ABOUT APPLIED BELL CURVE</div>
        <h1 className={`page-title ${styles.title}`}>Advanced planning and scheduling systems, plants can rely on.</h1>
        <p className={`page-lead ${styles.lead}`}>
          Applied Bell Curve was founded on one idea: enterprises deserve intelligent solutions that are easily integrated, quick to adopt and simple to use every day.
        </p>
      </section>

      <section className={styles.story}>
        {STORY.map((s) => (
          <div key={s.label} className={styles.storyCol}>
            <span className="rule" />
            <div className="eyebrow">{s.label}</div>
            <p className={styles.storyText}>{s.text}</p>
          </div>
        ))}
      </section>

      <section className={`section section--soft ${styles.foundersSection}`}>
        <div className="section-head" style={{ marginBottom: 24 }}>
          <span className="rule" />
          <div className="eyebrow">FOUNDERS</div>
          <h2 className="h2">The people behind the plan.</h2>
        </div>
        <div className={styles.founders}>
          {FOUNDERS.map((f) => (
            <article key={f.name} className={`card ${styles.founder}`}>
              <div className={styles.photo}>
                {f.photo ? (
                  <Image src={f.photo} alt={f.name} fill sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 380px" quality={90} style={{ objectFit: "cover" }} />
                ) : (
                  <ImagePlaceholder caption={`${f.name} photo`} />
                )}
              </div>
              <div className={styles.founderBody}>
                <div className={styles.founderHead}>
                  <h3 className={styles.founderName}>{f.name}</h3>
                  <div className={styles.founderTagline}>{f.tagline}</div>
                </div>
                <p className={styles.bio}>{f.bio}</p>
                <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedin} aria-label={`${f.name} on LinkedIn`}>
                  <LinkedInIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
