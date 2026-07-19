import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TIER_PRESETS, type Tier } from "./useDeviceTier";

export function Particles({ dark, tier }: { dark: boolean; tier: Tier }) {
  const ref = useRef<THREE.Points>(null);
  const count = TIER_PRESETS[tier].particles;

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    if (tier === "low") return; // freeze on low
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        sizeAttenuation
        color={dark ? "#ffffff" : "#1a1a1c"}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}
