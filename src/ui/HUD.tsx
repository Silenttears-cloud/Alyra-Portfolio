import { useEffect, useState } from "react";
import { sceneBus, type SectionId } from "@/lib/scene-bus";
import { useDeviceTier } from "@/scene/useDeviceTier";

const MODULE_LABELS: Record<SectionId, string> = {
  identity: "01 · About",
  modules: "02 · Work",
  experience: "03 · Experience",
  matrix: "04 · Skills",
  transmission: "05 · Contact",
};

const NAV: [SectionId, string, string][] = [
  ["identity", "About", "About"],
  ["modules", "Work", "Work"],
  ["experience", "Experience", "Exp"],
  ["matrix", "Skills", "Skills"],
  ["transmission", "Contact", "Contact"],
];

function useUtcClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t.toISOString().slice(11, 19);
}

function useFps() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

export function HUD({
  theme,
  onToggleTheme,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const utc = useUtcClock();
  const fps = useFps();
  const tier = useDeviceTier();
  const [section, setSection] = useState<SectionId>(sceneBus.current);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const unsub = sceneBus.subscribe(setSection);
    return () => { unsub(); };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Top bar */}
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-5">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "var(--pink)", boxShadow: "0 0 12px var(--pink)" }}
            />
            <span className="font-display text-lg italic tracking-tight">Ayushi Raj</span>
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                data-magnetic
                data-label={label}
                className="text-[12px] font-medium tracking-wide transition-colors hover:text-foreground"
                style={{
                  color:
                    section === id
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-4 xl:flex">
            <Telemetry k="FPS" v={String(fps).padStart(2, "0")} />
            <Telemetry k="TIER" v={tier.toUpperCase()} />
            <Telemetry k="UTC" v={utc} />
          </div>
          <button
            data-magnetic
            data-label="THEME"
            onClick={onToggleTheme}
            className="scan-hover pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur"
            aria-label="Toggle theme"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--pink)" }} />
            {theme === "dark" ? "Dark" : "Light"}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur lg:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="pointer-events-auto absolute right-4 top-14 z-50 flex flex-col gap-1 rounded-lg border border-border bg-background/95 p-3 backdrop-blur lg:hidden">
          {NAV.map(([id, , short]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
              style={{ color: section === id ? "var(--pink)" : "var(--muted-foreground)" }}
            >
              {short}
            </a>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-3 md:px-8 md:py-5">
        <div className="flex flex-col gap-1">
          <span className="hud-label">Current</span>
          <span className="font-display text-sm italic md:text-base">
            {MODULE_LABELS[section]}
          </span>
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <Telemetry k="LOC" v="Nawada, IN" />
          <Telemetry k="ROLE" v="AI · Full-Stack" />
          <Telemetry k="AVAIL" v="Open" accent />
        </div>
      </div>
    </div>
  );
}

function Telemetry({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest">
      <span className="text-muted-foreground">{k}</span>
      <span style={{ color: accent ? "var(--pink)" : undefined }}>{v}</span>
    </div>
  );
}
