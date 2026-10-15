import type { Metadata } from "next";
import CareersRoles from "@/components/CareersRoles";

export const metadata: Metadata = { title: "Careers" };

const VALUES = [
  { icon: "factory", title: "Close to the floor", text: "Everyone spends time in a customer plant. You see the machine before you model it." },
  { icon: "group", title: "Small team, real ownership", text: "You own a module or a customer end to end, from the first data file to go-live." },
  { icon: "functions", title: "Hard problems, stated plainly", text: "Scheduling and cutting problems with real costs attached. We write them down before we solve them." },
];

export default function CareersPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">CAREERS</div>
        <h1 className="page-title" style={{ maxWidth: "20ch" }}>Build the plan a factory runs on.</h1>
        <p className="page-lead">
          We are a small team of engineers and planners. The work is close to the plant: real constraints, real schedules, and people who use what you ship the next morning.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="cells">
          {VALUES.map((v) => (
            <div key={v.title} className="cell">
              <span className="chip"><i className="material-icons" aria-hidden="true">{v.icon}</i></span>
              <div className="cell-title">{v.title}</div>
              <p className="cell-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CareersRoles />
    </>
  );
}
