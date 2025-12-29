"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ShootingStars({ count = 4 }) {
  const group = useRef();

  const stars = useMemo(
    () =>
      new Array(count).fill().map(() => ({
        pos: new THREE.Vector3(
          -70 - Math.random() * 40,
          Math.random() * 40 + 10,
          -20
        ),
        speed: Math.random() * 0.3 + 0.18,
        life: Math.random() * 3 + 2,
        delay: Math.random() * 6,
        active: false,
      })),
    [count]
  );

  const dir = new THREE.Vector3(1.4, 2.55, 0.1).normalize();

  useFrame(() => {
    group.current.children.forEach((mesh, i) => {
      const s = stars[i];

      if (!s.active) {
        s.delay -= 0.02;
        if (s.delay <= 0) {
          s.active = true;
          mesh.visible = true;
        }
        return;
      }

      mesh.position.addScaledVector(dir, s.speed);
      s.life -= 0.02;

      mesh.material.uniforms.uLife.value = s.life;

      if (s.life <= 0 || mesh.position.x > 90 || mesh.position.y < -25) {
        s.pos.set(
          -70 - Math.random() * 40,
          Math.random() * 40 + 10,
          -20
        );
        mesh.position.copy(s.pos);

        s.speed = Math.random() * 0.3 + 0.18;
        s.life = Math.random() * 3 + 2;
        s.delay = Math.random() * 5;
        s.active = false;
        mesh.visible = false;
      }
    });
  });

  return (
    <group ref={group}>
      {stars.map((_, i) => (
        <mesh key={i}>
          <planeGeometry args={[5, 1]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              uLife: { value: 1.0 },
            }}
            fragmentShader={`
              uniform float uLife;
              varying vec2 vUv;

              void main() {
                float head = exp(-pow((vUv.x - 0.15) * 6.0, 2.0));
                float tail = smoothstep(1.0, 0.0, vUv.x) * 0.9;
                float shape = max(head, tail);

                float alpha = shape * uLife * 1.4;

                vec3 color = mix(vec3(0.7, 0.9, 1.0), vec3(1.0), head);

                gl_FragColor = vec4(color * shape * 2.0, alpha);
              }
            `}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
          />
        </mesh>
      ))}
    </group>
  );
}
