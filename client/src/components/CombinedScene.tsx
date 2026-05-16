import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Points, PointMaterial, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAether } from '@/contexts/AetherContext';
import { useTheme } from '@/contexts/ThemeContext';

// --- Shader Background Components ---
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform float uScrollY;
uniform float uBrightness;
uniform float uTheme; // 0 for dark, 1 for light

#define PI 3.14159265359

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float t = uTime * 0.15;
  float scrollOffset = uScrollY * 0.0005;
  
  vec2 st = uv;
  st.y += scrollOffset;
  
  float n1 = snoise(vec2(st.x * 3.0, st.y * 2.0 - t));
  float n2 = snoise(vec2(st.x * 5.0 + t, st.y * 4.0 - t * 1.5));
  
  float noise = n1 * 0.6 + n2 * 0.4;
  
  // Theme-aware colors
  vec3 darkPlum = mix(vec3(0.01, 0.02, 0.07), vec3(0.97, 0.98, 1.0), uTheme); 
  vec3 primary = mix(vec3(0.91, 0.12, 0.55), vec3(0.88, 0.11, 0.28), uTheme);
  vec3 secondary = mix(vec3(0.61, 0.35, 0.71), vec3(0.48, 0.22, 0.93), uTheme);
  
  vec3 color = darkPlum;
  float f1 = smoothstep(-0.2, 0.8, noise);
  float f2 = smoothstep(0.4, 1.0, noise);
  
  color = mix(color, secondary, f1 * mix(0.12, 0.05, uTheme));
  color = mix(color, primary, f2 * mix(0.08, 0.03, uTheme));
  
  float dist = distance(uv, vec2(0.5));
  color *= smoothstep(1.2, 0.4, dist * 0.7);

  gl_FragColor = vec4(color * uBrightness, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

function BackgroundShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const { settings } = useAether();
  const { theme } = useTheme();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uScrollY: { value: 0 },
    uBrightness: { value: settings.brightness },
    uTheme: { value: theme === 'light' ? 1 : 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScrollY.value = window.scrollY;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uBrightness.value = settings.brightness;
      materialRef.current.uniforms.uTheme.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uTheme.value, 
        theme === 'light' ? 1 : 0, 
        0.05
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}


// --- Hero 3D Components ---
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { settings } = useAether();
  const particleCount = settings.gpuMode === 'eco' ? 500 : 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const stride = i * 3;
      const r = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[stride] = r * Math.sin(phi) * Math.cos(theta);
      pos[stride + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[stride + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
      
      const mouseX = state.pointer.x;
      ref.current.rotation.z += (mouseX * 0.01);
      
      const opacity = Math.max(0, 1 - window.scrollY / 1000);
      if (ref.current.material instanceof THREE.PointsMaterial) {
        ref.current.material.opacity = opacity * 0.6;
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points key={`particles-${particleCount}`} ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff6eb4"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function MorphingCore() {
  const meshRef = useRef<THREE.Points>(null);
  const { settings } = useAether();
  const vertexCount = settings.gpuMode === 'eco' ? 500 : 1500;

  const states = useMemo(() => {
    const geo = {
      crystal: new Float32Array(vertexCount * 3),
      neural: new Float32Array(vertexCount * 3),
      matrix: new Float32Array(vertexCount * 3),
      helix: new Float32Array(vertexCount * 3),
    };

    const oct = new THREE.OctahedronGeometry(2.5, 0);
    const posAttr = oct.getAttribute('position');
    for (let i = 0; i < vertexCount; i++) {
        const index = i % posAttr.count;
        geo.crystal[i * 3] = posAttr.getX(index) + (Math.random() - 0.5) * 0.1;
        geo.crystal[i * 3 + 1] = posAttr.getY(index) + (Math.random() - 0.5) * 0.1;
        geo.crystal[i * 3 + 2] = posAttr.getZ(index) + (Math.random() - 0.5) * 0.1;
    }

    for (let i = 0; i < vertexCount; i++) {
      const r = 2.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      geo.neural[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      geo.neural[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      geo.neural[i * 3 + 2] = r * Math.cos(phi);
    }

    const side = Math.floor(Math.pow(vertexCount, 1/3));
    let idx = 0;
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        for (let z = 0; z < side; z++) {
          if (idx >= vertexCount) break;
          geo.matrix[idx * 3] = (x / side - 0.5) * 5;
          geo.matrix[idx * 3 + 1] = (y / side - 0.5) * 5;
          geo.matrix[idx * 3 + 2] = (z / side - 0.5) * 5;
          idx++;
        }
      }
    }

    for (let i = 0; i < vertexCount; i++) {
      const t = (i / vertexCount) * Math.PI * 10;
      const r = 1.5;
      const spiral = i % 2 === 0 ? 1 : -1;
      geo.helix[i * 3] = r * Math.cos(t * spiral);
      geo.helix[i * 3 + 1] = (i / vertexCount - 0.5) * 8;
      geo.helix[i * 3 + 2] = r * Math.sin(t * spiral);
    }

    return geo;
  }, [vertexCount]);

  const currentPos = useMemo(() => new Float32Array(vertexCount * 3), [vertexCount]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / maxScroll) * 3;
    const stateIdx = Math.floor(progress);
    const weight = progress % 1;

    const p1 = stateIdx === 0 ? states.crystal : stateIdx === 1 ? states.neural : stateIdx === 2 ? states.matrix : states.helix;
    const p2 = stateIdx === 0 ? states.neural : stateIdx === 1 ? states.matrix : stateIdx === 2 ? states.helix : states.helix;

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < vertexCount * 3; i += 3) {
      // Optimized lerp and wobble
      positions[i] = THREE.MathUtils.lerp(p1[i], p2[i], weight) + Math.sin(time + i) * 0.01;
      positions[i+1] = THREE.MathUtils.lerp(p1[i+1], p2[i+1], weight) + Math.cos(time + i) * 0.01;
      positions[i+2] = THREE.MathUtils.lerp(p1[i+2], p2[i+2], weight) + Math.sin(time + i * 0.5) * 0.01;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;

    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, state.pointer.y * 0.2, 0.1);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, state.pointer.x * 0.2, 0.1);

    const scale = 1 + Math.sin(time * 1.5) * 0.03;
    meshRef.current.scale.setScalar(scale);

    const opacity = Math.max(0, 1 - (window.scrollY - 3000) / 1000);
    if (meshRef.current.material instanceof THREE.PointsMaterial) {
        meshRef.current.material.opacity = opacity;
    }
  });

  return (
    <group>
      <Points key={`morph-${vertexCount}`} ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={vertexCount}
            array={currentPos}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#e91e8c"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {settings.gpuMode === 'ultra' && (
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#9b59b6" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
}

function SectionHeaders() {
  const headers = [
    { text: "ABOUT PROTOCOL", y: -10 },
    { text: "COMPILED PROJECTS", y: -30 },
    { text: "TACTICAL ARSENAL", y: -50 },
    { text: "INITIATE UPLINK", y: -70 },
  ];

  return (
    <>
      {headers.map((h, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, h.y + (window.scrollY * 0.01), -8]}
            fontSize={1.2}
            color="#fdf0ff"
            font="https://fonts.gstatic.com/s/orbitron/v11/y97ZGS6ndY96C8UqWw.woff"
            material-toneMapped={false}
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
            textAlign="center"
          >
            {h.text}
            <meshStandardMaterial 
              emissive="#e91e8c" 
              emissiveIntensity={0.3} 
              toneMapped={false} 
            />
          </Text>
        </Float>
      ))}
    </>
  );
}

function OrbitalLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const { settings } = useAether();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scrollFactor = Math.max(0, 1 - window.scrollY / 1500);
    
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.5) * 6;
      light1Ref.current.position.z = Math.cos(t * 0.5) * 6;
      light1Ref.current.intensity = 25 * scrollFactor * settings.brightness;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(t * 0.4 + Math.PI) * 5;
      light2Ref.current.position.z = Math.cos(t * 0.4 + Math.PI) * 5;
      light2Ref.current.intensity = 15 * scrollFactor * settings.brightness;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} color="#e91e8c" intensity={25} distance={25} />
      <pointLight ref={light2Ref} color="#9b59b6" intensity={15} distance={20} />
    </>
  );
}

export function CombinedScene() {
  const { settings } = useAether();
  const { theme } = useTheme(); // Assuming useTheme is available or we can get it from context

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 40 }}
        dpr={settings.gpuMode === 'eco' ? 1 : [1, 2]}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        <Suspense fallback={null}>
          <BackgroundShader />
          
          <ambientLight intensity={0.15 * settings.brightness} color="#cc99ff" />
          {settings.gpuMode === 'ultra' && <Environment preset="night" />}
          
          <OrbitalLights />
          <ParticleField />
          <MorphingCore />
          <SectionHeaders />

          <EffectComposer disableNormalPass>
            <Bloom 
              intensity={settings.bloom * 1.2} 
              luminanceThreshold={0.3} 
              luminanceSmoothing={0.75} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

