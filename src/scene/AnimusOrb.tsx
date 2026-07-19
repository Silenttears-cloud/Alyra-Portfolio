import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { TIER_PRESETS, type Tier } from "./useDeviceTier";

// Renamed conceptually to CrystalCluster but exported as AnimusOrb for
// call-site compatibility. Renders a slowly orbiting cluster of refractive
// glass shards (Aurora Glass identity).

type ShardDef = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

const BASE_SHARDS: ShardDef[] = [
  { pos: [0, 0, 0], rot: [0.3, 0.2, 0], scale: 1.05 },
  { pos: [1.4, 0.6, -0.4], rot: [1.1, 0.4, 0.2], scale: 0.75 },
  { pos: [-1.3, -0.4, 0.3], rot: [0.2, 1.3, 0.7], scale: 0.85 },
  { pos: [0.4, -1.2, 0.5], rot: [1.4, 0.7, 0.9], scale: 0.6 },
  { pos: [-0.6, 1.2, -0.6], rot: [0.8, 0.2, 1.1], scale: 0.65 },
  { pos: [1.7, -0.7, 0.6], rot: [0.5, 1.6, 0.3], scale: 0.5 },
  { pos: [-1.7, 0.8, 0.5], rot: [1.2, 0.3, 0.6], scale: 0.55 },
  { pos: [0.9, 1.4, 0.9], rot: [0.6, 1.0, 0.4], scale: 0.45 },
  { pos: [-0.9, -1.4, -0.7], rot: [1.3, 0.6, 0.9], scale: 0.5 },
];

export function AnimusOrb({ dark, tier }: { dark: boolean; tier: Tier }) {
  const preset = TIER_PRESETS[tier];
  const group = useRef<THREE.Group>(null);
  const count = tier === "low" ? 5 : tier === "mid" ? 7 : 9;
  const shards = useMemo(() => BASE_SHARDS.slice(0, count), [count]);
  const useTransmission = tier !== "low";

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += dt * 0.08;
    group.current.rotation.x = Math.sin(t * 0.18) * 0.2;
    group.current.children.forEach((child, i) => {
      child.rotation.x += dt * (0.15 + i * 0.02);
      child.rotation.y += dt * (0.1 + i * 0.015);
      child.position.y += Math.sin(t * 0.6 + i) * 0.0008;
    });
  });

  return (
    <>
      {useTransmission && (
        <Environment preset={dark ? "night" : "dawn"} background={false} />
      )}

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.003, 12, 160]} />
        <meshBasicMaterial color={dark ? "#f0abfc" : "#c4b5fd"} transparent opacity={0.35} />
      </mesh>
      {preset.halos >= 2 && (
        <mesh rotation={[0.4, 0, Math.PI / 3]}>
          <torusGeometry args={[2.85, 0.002, 12, 160]} />
          <meshBasicMaterial color={dark ? "#c4b5fd" : "#f0abfc"} transparent opacity={0.28} />
        </mesh>
      )}
      {preset.halos >= 3 && (
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[3.1, 0.0015, 12, 160]} />
          <meshBasicMaterial color={dark ? "#f5f3ff" : "#1a1424"} transparent opacity={0.18} />
        </mesh>
      )}

      <group ref={group}>
        {shards.map((s, i) => (
          <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
            <icosahedronGeometry args={[0.85, 0]} />
            {useTransmission ? (
              <MeshTransmissionMaterial
                thickness={0.5}
                roughness={0.08}
                transmission={1}
                ior={1.5}
                chromaticAberration={0.06}
                anisotropicBlur={0.2}
                distortion={0.2}
                distortionScale={0.4}
                temporalDistortion={0.15}
                color={dark ? "#e9defc" : "#ffffff"}
                attenuationColor={dark ? "#c4b5fd" : "#f0abfc"}
                attenuationDistance={0.6}
                backside={false}
                samples={tier === "high" ? 6 : 3}
                resolution={tier === "high" ? 512 : 256}
              />
            ) : (
              <meshStandardMaterial
                color={dark ? "#c4b5fd" : "#e2d8ec"}
                metalness={0.2}
                roughness={0.3}
                transparent
                opacity={0.7}
              />
            )}
          </mesh>
        ))}
      </group>

      {/* Soft aurora point lights */}
      <pointLight position={[3, 3, 2]} intensity={dark ? 3 : 1.2} color="#f0abfc" />
      <pointLight position={[-3, -2, 2]} intensity={dark ? 2.5 : 1} color="#c4b5fd" />
    </>
  );
}
