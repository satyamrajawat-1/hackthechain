"use client";

import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function Planet({ textureUrl, position, scale = 3, speed = 0.2 }) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const ref = useRef();

  texture.colorSpace = THREE.SRGBColorSpace;

  // 🌍 rotation animation
  useFrame(() => {
    ref.current.rotation.y += speed * 0.01;   // rotate slowly
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}
