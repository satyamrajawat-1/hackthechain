"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function GradientSky() {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.y = state.mouse.x * 0.05;
    ref.current.rotation.x = state.mouse.y * 0.03;
  });

  return (
    <mesh ref={ref} scale={[-150, 150, 150]}>
      <sphereGeometry args={[1, 64, 64]} />

      <shaderMaterial
        side={THREE.BackSide}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;   // use UV instead of world normals
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;

          void main() {

            // simple straight gradient using UV.y
            float h = vUv.y;

            vec3 top    = vec3(0.05, 0.02, 0.30);
            vec3 mid    = vec3(0.12, 0.06, 0.48);
            vec3 bottom = vec3(0.22, 0.10, 0.65);

            vec3 color = mix(bottom, mid, smoothstep(0.0, 0.55, h));
            color = mix(color, top, smoothstep(0.45, 1.0, h));

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function StarSky() {
  const ref = useRef();
  const texture = new THREE.TextureLoader().load("/textures/8k_stars_milky_way.jpg");

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  useFrame((state) => {
    ref.current.rotation.y = state.mouse.x * 0.1;
    ref.current.rotation.x = state.mouse.y * 0.05;
  });

  return (
    <mesh ref={ref} scale={[-118, 118, 118]}>
      <sphereGeometry args={[1, 64, 64]} />

      <shaderMaterial
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}

        uniforms={{
          starMap: { value: texture },
          boost: { value: 8.5 },      // star brightness
          threshold: { value: 0.18 }, // what counts as a star
          fadeNebula: { value: 0.75 },// remove cloudy band
          opacity: { value: 7.5 }
        }}

        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `}

       fragmentShader={`
  uniform sampler2D starMap;
  uniform float boost;
  uniform float threshold;
  uniform float fadeNebula;
  uniform float opacity;

  varying vec2 vUv;

  void main() {
    vec3 tex = texture2D(starMap, vUv).rgb;

    // luminance
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));

    // remove cloudy nebula completely
    float starMask = smoothstep(threshold, 0.97, lum);

    // bright white stars only
    vec3 starColor = vec3(1.0) * starMask * (boost + 5.0);

    // 🔥 IMPORTANT:
    // instead of painting over gradient — we *alpha mix*
    gl_FragColor = vec4(starColor, starMask * opacity * 0.45);
  }
`}


      />
    </mesh>
  );
}

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} color="purple" />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />

        <GradientSky />
        <StarSky />

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
