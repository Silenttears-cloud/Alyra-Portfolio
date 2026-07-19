import { useEffect, useState, useSyncExternalStore } from "react";

export type Tier = "high" | "mid" | "low";

const KEY = "animus.tier";
const listeners = new Set<() => void>();
let current: Tier | null = null;

function detect(): Tier {
  if (typeof window === "undefined") return "high";

  const cached = sessionStorage.getItem(KEY) as Tier | null;
  if (cached === "high" || cached === "mid" || cached === "low") return cached;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return persist("low");

  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  let renderer = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return persist("low");
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbg) renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
  } catch {
    /* ignore */
  }

  const r = renderer.toLowerCase();
  const weakGpu = /(swiftshader|llvmpipe|mali|adreno [1-5]|powervr|intel.*hd|intel.*uhd)/.test(r);

  if (weakGpu || cores <= 2 || mem <= 2) return persist("low");
  if ((coarse && narrow) || cores <= 4 || mem <= 4) return persist("mid");
  return persist("high");
}

function persist(t: Tier): Tier {
  try {
    sessionStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
  return t;
}

function ensure(): Tier {
  if (current === null) current = detect();
  return current;
}

export function downgradeTier() {
  const c = ensure();
  const next: Tier = c === "high" ? "mid" : c === "mid" ? "low" : "low";
  if (next !== c) {
    current = persist(next);
    listeners.forEach((l) => l());
    // eslint-disable-next-line no-console
    console.info(`[animus] perf downgrade → ${next}`);
  }
}

export function useDeviceTier(): Tier {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ensure(),
    () => "high",
  );
}

export const TIER_PRESETS = {
  high: { dpr: [1, 1.75] as [number, number], particles: 2400, orbDetail: 64, halos: 3, postFx: "full" as const, dolly: true, antialias: true, power: "high-performance" as const },
  mid:  { dpr: [1, 1.25] as [number, number], particles: 1200, orbDetail: 32, halos: 2, postFx: "min"  as const, dolly: true, antialias: true, power: "high-performance" as const },
  low:  { dpr: [1, 1]    as [number, number], particles: 500,  orbDetail: 16, halos: 1, postFx: "none" as const, dolly: false, antialias: false, power: "low-power" as const },
};

export function useAutoDowngrade(threshold = 40, sampleMs = 3000) {
  const [warming, setWarming] = useState(true);
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let start = performance.now();
    let done = false;
    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - start >= sampleMs) {
        const fps = (frames * 1000) / (now - start);
        if (fps < threshold && !done) {
          done = true;
          downgradeTier();
        }
        setWarming(false);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [threshold, sampleMs]);
  return warming;
}

// While the FPS probe is still running, temporarily clamp the tier down one
// step so we don't blow the frame budget with the full high-tier scene before
// we know the device can sustain it.
export function warmupTier(tier: Tier, warming: boolean): Tier {
  if (!warming) return tier;
  if (tier === "high") return "mid";
  return "low";
}
