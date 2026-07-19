import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { Tier } from "./useDeviceTier";

export function Effects({ tier }: { tier: Tier }) {
  if (tier === "low") return null;

  if (tier === "mid") {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.5} luminanceThreshold={0.4} luminanceSmoothing={0.6} resolutionScale={0.5} />
        <Vignette eskil={false} offset={0.2} darkness={0.65} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0008, 0.0008)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={0.06} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.2} darkness={0.65} />
    </EffectComposer>
  );
}
