import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneBus, type SectionId } from "@/lib/scene-bus";
import type { Tier } from "./useDeviceTier";

const TARGETS: Record<SectionId, { pos: [number, number, number]; look: [number, number, number] }> = {
  identity: { pos: [0, 0.2, 6], look: [0, 0, 0] },
  modules: { pos: [3.5, 1.5, 7], look: [0, 0, 0] },
  experience: { pos: [-3.2, 0.8, 6.5], look: [0, 0, 0] },
  matrix: { pos: [0, 5.5, 4.5], look: [0, 0, 0] },
  transmission: { pos: [-0.8, -0.4, 3.6], look: [0, 0, 0] },
};

export function CameraRig({ tier }: { tier: Tier }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3(...TARGETS.identity.pos));
  const look = useRef(new THREE.Vector3(...TARGETS.identity.look));
  const currentLook = useRef(new THREE.Vector3(...TARGETS.identity.look));
  const mouse = useRef(new THREE.Vector2(0, 0));
  const lastMouse = useRef(0);
  const snap = tier === "low";

  useEffect(() => {
    const unsub = sceneBus.subscribe((id) => {
      desired.current.set(...TARGETS[id].pos);
      look.current.set(...TARGETS[id].look);
      if (snap) {
        camera.position.set(...TARGETS[id].pos);
        currentLook.current.set(...TARGETS[id].look);
        camera.lookAt(currentLook.current);
      }
    });
    const throttle = snap ? 33 : 0;
    const move = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouse.current < throttle) return;
      lastMouse.current = now;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      unsub();
      window.removeEventListener("mousemove", move);
    };
  }, [camera, snap]);

  useFrame(() => {
    if (snap) return;
    const dx = mouse.current.x * 0.4;
    const dy = mouse.current.y * 0.25;
    camera.position.x += (desired.current.x + dx - camera.position.x) * 0.04;
    camera.position.y += (desired.current.y + dy - camera.position.y) * 0.04;
    camera.position.z += (desired.current.z - camera.position.z) * 0.04;
    currentLook.current.lerp(look.current, 0.06);
    camera.lookAt(currentLook.current);
  });

  return null;
}
