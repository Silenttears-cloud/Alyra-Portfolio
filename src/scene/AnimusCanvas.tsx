import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimusOrb } from "./AnimusOrb";
import { Particles } from "./Particles";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { TIER_PRESETS, useAutoDowngrade, useDeviceTier, warmupTier } from "./useDeviceTier";
import { sceneBus, type SectionId } from "@/lib/scene-bus";

export function AnimusCanvas({ dark }: { dark: boolean }) {
  const rawTier = useDeviceTier();
  const warming = useAutoDowngrade();
  const tier = warmupTier(rawTier, warming);
  const preset = TIER_PRESETS[tier];

  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const [section, setSection] = useState<SectionId>(sceneBus.current);
  useEffect(() => {
    const unsub = sceneBus.subscribe(setSection);
    return () => { unsub(); };
  }, []);
  const dim = section === "identity";

  return (
    <div
      className="pointer-events-none fixed inset-0 transition-opacity duration-700"
      style={{ zIndex: 0, opacity: dim ? 0.22 : 1 }}
      aria-hidden
    >
      <Canvas
        dpr={preset.dpr}
        frameloop={frameloop}
        performance={{ min: 0.5 }}
        gl={{ antialias: preset.antialias, alpha: true, powerPreference: preset.power }}
        camera={{ position: [0, 0.2, 6], fov: 42, near: 0.1, far: 100 }}
      >
        <color attach="background" args={[dark ? "#0b0714" : "#f7f4fb"]} />
        <fog attach="fog" args={[dark ? "#0b0714" : "#f7f4fb", 6, 22]} />
        <ambientLight intensity={dark ? 0.5 : 0.7} />
        <directionalLight position={[4, 5, 3]} intensity={0.6} />
        <Suspense fallback={null}>
          <AnimusOrb dark={dark} tier={tier} />
          <Particles dark={dark} tier={tier} />
        </Suspense>
        <CameraRig tier={tier} />
        <Effects tier={tier} />
      </Canvas>
    </div>
  );
}
