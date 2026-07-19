import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { useSectionInView } from "@/lib/useSectionInView";
import { Magnetic } from "@/ui/Magnetic";
import { HeroBackdrop } from "./HeroBackdrop";
const ayushiPhoto = "/images/ayushi.webp";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ayushi-raj-299a99388/", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/Silenttears-cloud", icon: Github },
  { label: "Instagram", href: "https://www.instagram.com/Silenttears_82", icon: Instagram },
  { label: "Email", href: "mailto:ayushi29507@gmail.com", icon: Mail },
];

export function Identity() {
  const ref = useSectionInView("identity");
  return (
    <section
      id="identity"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative flex min-h-screen items-start overflow-hidden px-5 pt-24 pb-14 sm:px-8 md:px-16 md:pt-28"
    >
      <HeroBackdrop />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-foreground/40" />
            <span className="hud-label">Ayushi Raj</span>
          </div>

          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl"
            style={{ letterSpacing: "-0.015em", lineHeight: 1.02 }}
          >
            <RevealLine delay={0}>
              <span style={{ fontWeight: 400 }}>Bridging</span>
            </RevealLine>
            <RevealLine delay={0.12}>
              <span style={{ fontWeight: 400, fontStyle: "italic", color: "color-mix(in oklab, var(--foreground) 65%, transparent)" }}>
                creativity
              </span>{" "}
              <span style={{ fontWeight: 400 }}>and</span>
            </RevealLine>
            <RevealLine delay={0.24}>
              <span className="aurora-text" style={{ fontWeight: 500, fontStyle: "italic" }}>
                artificial intelligence.
              </span>
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            I&rsquo;m an AI &amp; Full-Stack Developer crafting zero-knowledge
            tools, low-latency APIs, and Gemini-powered systems with Python,
            React, and FastAPI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Magnetic label="VIEW WORK">
              <a
                href="#modules"
                className="scan-hover group inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-6 py-3 text-[12px] font-medium tracking-wide text-background"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--pink)" }} />
                View Work
              </a>
            </Magnetic>
            <Magnetic label="GET IN TOUCH">
              <a
                href="#transmission"
                className="scan-hover inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 text-[12px] font-medium tracking-wide"
              >
                Get in touch →
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.9 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-5"
          >
            <Stat n="4" label="Featured Projects" />
            <Stat n="3" label="Job Simulations" />
            <Stat n="1" label="Gemini Certified" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.15, duration: 0.7 }}
            className="mt-5 flex items-center gap-3"
            aria-label="Social links"
          >
            {SOCIALS.map((s) => (
              <Magnetic key={s.label} label={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="scan-hover flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <s.icon size={18} strokeWidth={1.5} />
                </a>
              </Magnetic>
            ))}
          </motion.div>
        </div>

        <ProfileCard />
      </div>
    </section>
  );
}

function ProfileCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      setTilt({ x: dx * 8, y: dy * 8 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const rows: [string, string, boolean?][] = [
    ["Role", "AI & Full-Stack Developer"],
    ["Focus", "AI Systems · Zero-Knowledge"],
    ["Stack", "Python · React · FastAPI"],
    ["Current", "BCA @ Amity Noida"],
    ["Status", "Open to opportunities", true],
    ["Location", "Nawada, Bihar"],
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
        transition: "transform 400ms cubic-bezier(0.2,0.7,0.2,1)",
      }}
      className="glass-panel aurora-border relative mx-auto w-full max-w-[340px] p-5 sm:max-w-sm md:justify-self-end"
    >
      <div className="flex items-center justify-between">
        <span className="hud-label">Profile</span>
        <span className="font-mono text-[10px] tracking-widest" style={{ color: "var(--pink)" }}>
          Available
        </span>
      </div>

      <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-lg border border-border bg-background">
        <img
          src={ayushiPhoto}
          alt="Ayushi Raj — AI & Full-Stack Developer portrait"
          width={720}
          height={960}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="scan-line-loop" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, color-mix(in oklab, #ffffff 25%, transparent) 50%, transparent 60%)",
            transform: "translateX(-100%)",
            animation: "hero-card-sheen 12s ease-in-out infinite",
          }}
        />
      </div>

      <div className="mt-5 flex flex-col divide-y divide-border text-[11px]">
        {rows.map(([k, v, accent]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
            <span className="font-mono uppercase tracking-widest text-muted-foreground">{k}</span>
            <span
              className="text-right font-medium"
              style={{ color: accent ? "var(--pink)" : undefined }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes hero-card-sheen {
          0%   { transform: translateX(-100%); opacity: 0; }
          40%  { opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div
        className="font-display text-3xl sm:text-4xl"
        style={{ fontWeight: 400, letterSpacing: "-0.01em" }}
      >
        {n}
      </div>
      <div className="hud-label mt-1">{label}</div>
    </div>
  );
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "100%", filter: "blur(4px)" }}
        whileInView={{ y: "0%", filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
