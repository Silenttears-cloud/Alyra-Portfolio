import { motion } from "motion/react";
import { useSectionInView } from "@/lib/useSectionInView";
import { SectionHeader } from "./Modules";

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["Java", "Python", "Rust", "JavaScript", "TypeScript", "C", "SQL"],
  },
  {
    title: "Backend & Databases",
    items: [
      "Spring Boot",
      "FastAPI",
      "Node.js",
      "REST APIs",
      "WebSockets",
      "PostgreSQL",
      "SQLite",
      "Redis",
    ],
  },
  {
    title: "Frontend & UI",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Motion"],
  },
  {
    title: "AI · Tools · Cloud",
    items: [
      "Gemini API",
      "Prompt Engineering",
      "PyTorch",
      "OpenCV",
      "Git",
      "GitHub Actions",
      "Docker",
      "Vercel",
      "Render",
      "JUnit 5",
    ],
  },
];

export function Matrix() {
  const ref = useSectionInView("matrix");
  return (
    <section
      id="matrix"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-24 sm:px-8 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="04 · Skills"
          title="Technical Stack"
          caption="A snapshot of the tools I use to design and ship systems."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="glass-panel p-6 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--pink)" }}
                />
                <h3
                  className="font-display text-lg italic"
                  style={{ fontWeight: 500 }}
                >
                  {g.title}
                </h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-[12px] font-medium text-foreground/85"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
