"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface BubbleData {
  size: number;
  startX: number;
  startY: number;
  startZ: number;
  floatSpeed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rotSpeed: number;
}

function ToneMapping() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.6;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);
  return null;
}

function BlueEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new THREE.Scene();

    const lights: Array<{ color: number; pos: [number, number, number]; intensity: number }> = [
      { color: 0x4a9eff, pos: [10, 5, 5],    intensity: 8 },
      { color: 0x88d4ff, pos: [-10, 3, 5],   intensity: 7 },
      { color: 0xffffff, pos: [0, 10, 0],    intensity: 10 },
      { color: 0x6cb8ff, pos: [0, -8, 5],    intensity: 6 },
      { color: 0xc7e9ff, pos: [5, 0, -8],    intensity: 5 },
      { color: 0x2980ff, pos: [-5, -2, -8],  intensity: 6 },
    ];

    lights.forEach((l) => {
      const geo = new THREE.SphereGeometry(3, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: l.color });
      mat.color.multiplyScalar(l.intensity);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...l.pos);
      envScene.add(mesh);
    });

    const bgGeo = new THREE.SphereGeometry(50, 32, 32);
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top: { value: new THREE.Color(0x88d4ff) },
        bottom: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
        varying vec3 vP;
        void main() {
          vP = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 top;
        uniform vec3 bottom;
        varying vec3 vP;
        void main() {
          float h = normalize(vP).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(bottom, top, h), 1.0);
        }
      `,
    });
    envScene.add(new THREE.Mesh(bgGeo, bgMat));

    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    return () => {
      pmrem.dispose();
      envMap.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  return null;
}

function Bubble({ data }: { data: BubbleData }) {
  const ref = useRef<THREE.Mesh>(null);
  const baseXRef = useRef(data.startX);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const mesh = ref.current;

    mesh.position.y += data.floatSpeed;
    if (mesh.position.y > 4) {
      mesh.position.y = -4;
      baseXRef.current = data.startX + (Math.random() - 0.5) * 2;
    }

    mesh.position.x =
      baseXRef.current + Math.sin(t * data.swayFreq + data.phase) * data.swayAmp;

    mesh.rotation.x += data.rotSpeed;
    mesh.rotation.y += data.rotSpeed * 1.3;
  });

  return (
    <mesh ref={ref} position={[data.startX, data.startY, data.startZ]}>
      <sphereGeometry args={[data.size, 64, 64]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.7}
        roughness={0.0}
        metalness={0.0}
        transmission={1.0}
        thickness={0.6}
        ior={1.33}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        iridescence={1.0}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[400, 1000]}
        envMapIntensity={3.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function AmbientSparkles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 100;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      (pos.array as Float32Array)[i * 3 + 1] += 0.005;
      if ((pos.array as Float32Array)[i * 3 + 1] > 3)
        (pos.array as Float32Array)[i * 3 + 1] = -3;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MouseParallax() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function BubblesBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 10 : 24;

  const bubbles = useMemo<BubbleData[]>(
    () =>
      Array.from({ length: count }, () => ({
        size: 0.15 + Math.random() * 0.55,
        startX: (Math.random() - 0.5) * 14,
        startY: (Math.random() - 0.5) * 6 - 1,
        startZ: (Math.random() - 0.5) * 4,
        floatSpeed: 0.002 + Math.random() * 0.004,
        swayAmp: 0.3 + Math.random() * 0.5,
        swayFreq: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      })),
    [count]
  );

  if (reducedMotion) return null;

  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: "transparent" }}
      >
        <ToneMapping />
        <BlueEnvironment />

        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 8, 4]} intensity={2.5} color="#b8e0ff" />
        <directionalLight position={[-5, 2, 5]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[0, -3, -5]} intensity={2.0} color="#4a9eff" />
        <pointLight position={[3, 4, 3]} intensity={30} distance={15} color="#ffffff" />
        <pointLight position={[-4, -2, 2]} intensity={25} distance={15} color="#6cb8ff" />

        {bubbles.map((data, i) => (
          <Bubble key={i} data={data} />
        ))}

        <AmbientSparkles />
        <MouseParallax />
      </Canvas>
    </div>
  );
}
