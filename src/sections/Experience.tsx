import { motion } from "motion/react";
import { useSectionInView } from "@/lib/useSectionInView";
import { SectionHeader } from "./Modules";

type Role = {
  org: string;
  title: string;
  date: string;
  points: string[];
  stack: string[];
};

const ROLES: Role[] = [
  {
    org: "Y Combinator · Shiptivity",
    title: "Software Engineering Simulation",
    date: "June 2026",
    points: [
      "Architected a 3-column Kanban dashboard (Backlog, In Progress, Complete) to replace legacy spreadsheet logging.",
      "Integrated Dragula for drag-and-drop and synchronized event-driven UI transitions into React state.",
      "Patched Node 25.9 compatibility errors around http-deceiver and legacy OpenSSL providers.",
    ],
    stack: ["React.js", "Dragula", "Node.js", "Webpack", "OpenSSL"],
  },
  {
    org: "Hewlett Packard Enterprise",
    title: "Software Engineering Job Simulation",
    date: "June 2026",
    points: [
      "Built a Spring Boot + Gradle RESTful service to process and persist employee data in-memory over HTTP GET/POST.",
      "Resolved JVM compatibility conflicts by upgrading to Gradle 9.5.1 for Java 25 (LTS).",
      "Wrote a Mockito-free JUnit 5 + MockMvc suite with a 100% build pass rate.",
    ],
    stack: ["Java", "Spring Boot", "Gradle", "JUnit 5", "MockMvc", "REST"],
  },
  {
    org: "Walmart USA",
    title: "Advanced Software Engineering Simulation",
    date: "May 2026",
    points: [
      "Designed a generic Power-of-Two Max Heap in Java for dynamic shipping queues using bitwise index transitions.",
      "Wrote a zero-dependency unit test suite and micro-benchmarks across varying branching exponents.",
      "Produced UML class and ER diagrams for new department-asset schemas.",
    ],
    stack: ["Java", "Data Structures", "OOP", "UML", "ERD"],
  },
];

export function Experience() {
  const ref = useSectionInView("experience");
  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-24 sm:px-8 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="03 · Experience"
          title="Engineering Log"
          caption="Real-world simulations and internships across product companies."
        />

        <div className="mt-14 flex flex-col gap-6">
          {ROLES.map((r, i) => (
            <motion.article
              key={r.org}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="glass-panel grid gap-6 p-6 md:grid-cols-[240px_1fr] md:p-8"
            >
              <div>
                <span className="hud-label">{r.date}</span>
                <h3
                  className="mt-2 font-display text-xl leading-tight"
                  style={{ fontWeight: 500 }}
                >
                  {r.org}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.title}</p>
              </div>
              <div>
                <ul className="flex flex-col gap-2.5 text-sm leading-relaxed">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span
                        className="mt-2 inline-block h-1 w-3 shrink-0"
                        style={{ background: "var(--pink)" }}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {r.stack.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-border bg-card/60 px-2.5 py-1 font-mono text-[10px] tracking-widest text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
