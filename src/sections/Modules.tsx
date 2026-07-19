import { motion } from "motion/react";
import { useSectionInView } from "@/lib/useSectionInView";
import { Magnetic } from "@/ui/Magnetic";

type Project = {
  name: string;
  date: string;
  blurb: string;
  tags: string[];
  live?: string;
  code?: string;
};

const PROJECTS: Project[] = [
  {
    name: "Zero-Knowledge Password Manager",
    date: "Feb 2026",
    blurb:
      "Client-side encrypted vault with local-first cryptography and a secure sync protocol. No plaintext ever leaves the device.",
    tags: ["React", "TypeScript", "Web Crypto API", "AES-GCM", "PBKDF2"],
    live: "https://alyra-lock.vercel.app/",
    code: "https://github.com/Silenttears-cloud/Zero-knowledge-password-manager-",
  },
  {
    name: "AXIOM Orchestration Gateway",
    date: "May 2026",
    blurb:
      "High-performance systems orchestration control plane with low-latency routing and live service telemetry over WebSockets.",
    tags: ["Python", "FastAPI", "React", "Redis", "WebSockets"],
    live: "https://axiom-orchestration-gateway.onrender.com/dashboard",
    code: "https://github.com/Silenttears-cloud/AXIOM-Orchestration-Gateway",
  },
  {
    name: "Astra Vision",
    date: "Apr 2026",
    blurb:
      "Real-time image segmentation, object tracking pipelines, and spatial intelligence for computer vision workloads.",
    tags: ["Python", "PyTorch", "OpenCV", "FastAPI", "React", "YOLO"],
    live: "https://astra-frontend-mrfinklbba-uc.a.run.app/",
    code: "https://github.com/Silenttears-cloud/Astra_vision",
  },
  {
    name: "IDBI FinSync",
    date: "Mar 2026",
    blurb:
      "A personal finance dashboard that aggregates multiple bank accounts into a single feed, visualizes spending habits, and uses a built-in AI companion to offer tailored investment advice.",
    tags: ["React", "TypeScript", "Fastify", "PostgreSQL", "Prisma", "Zustand", "Redis", "Gemini API"],
    live: "https://idbi-fin-sync-web.vercel.app/",
    code: "https://github.com/Silenttears-cloud/IDBI-FinSync",
  },
];

export function Modules() {
  const ref = useSectionInView("modules");
  return (
    <section
      id="modules"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-24 sm:px-8 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="02 · Work" title="Selected Projects" caption="Systems I've designed, shipped, and open-sourced." />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              className="glass-panel scan-hover flex flex-col gap-4 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl leading-tight" style={{ fontWeight: 500 }}>
                  {p.name}
                </h3>
                <span className="hud-label whitespace-nowrap">{p.date}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>

              <ul className="flex flex-wrap gap-1.5 pt-1">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border bg-card/60 px-2.5 py-1 font-mono text-[10px] tracking-widest text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex flex-wrap items-center gap-2 pt-2">
                {p.live && (
                  <Magnetic label="LIVE">
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="scan-hover inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-2 text-[11px] font-medium text-background"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--pink)" }} />
                      Live Demo
                    </a>
                  </Magnetic>
                )}
                {p.code && (
                  <Magnetic label="CODE">
                    <a
                      href={p.code}
                      target="_blank"
                      rel="noreferrer"
                      className="scan-hover inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] font-medium"
                    >
                      Source →
                    </a>
                  </Magnetic>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  caption,
}: {
  eyebrow: string;
  title: string;
  caption?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-foreground/40" />
        <span className="hud-label">{eyebrow}</span>
      </div>
      <h2
        className="mt-4 font-display text-4xl md:text-5xl"
        style={{ letterSpacing: "-0.015em", fontWeight: 400 }}
      >
        <span style={{ fontStyle: "italic" }} className="aurora-text">
          {title.split(" ")[0]}
        </span>{" "}
        {title.split(" ").slice(1).join(" ")}
      </h2>
      {caption && (
        <p className="mt-3 text-base text-muted-foreground">{caption}</p>
      )}
    </div>
  );
}
