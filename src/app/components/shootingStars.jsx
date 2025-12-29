"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ShootingStars({ count = 6 }) {
    const group = useRef();

    const stars = useMemo(() => {
        const arr = [];

        for (let i = 0; i < count; i++) {
            arr.push({
                position: new THREE.Vector3(
                    -55,
                    Math.random() * 35 + 5,
                    -20
                ),
                speed: Math.random() * 0.15 + 0.08,
                life: Math.random() * 8 + 6,
                opacity: 0
            });
        }

        return arr;
    }, [count]);

    const angle = -18 * (Math.PI / 180);

    // direction vector (right + slightly down)
    const direction = new THREE.Vector3(1, -0.35, -0.15).normalize();

    useFrame(() => {
        group.current.children.forEach((star, i) => {
            const s = stars[i];

            // move along direction
            star.position.addScaledVector(direction, s.speed);

            // fade in / out
            const mat = star.material;
            s.opacity = Math.min(s.opacity + 0.025, 1);
            mat.opacity = Math.pow(s.opacity, 1.5);

            s.life -= 0.02;

            if (s.life <= 0 || star.position.x > 70 || star.position.y < -25) {
                star.position.set(-55, Math.random() * 35 + 5, -20);

                s.speed = Math.random() * 0.15 + 0.08;
                s.life = Math.random() * 9 + 6;
                s.opacity = 0;
            }
        });
    });



    return (
        <group ref={group}>
            {stars.map((s, i) => (
                <mesh key={i} position={s.position} rotation={[Math.PI / 2, 0, 0]}>
                    {/* thinner + longer */}
                    <cylinderGeometry args={[0.015, 0.002, 3.8, 12]} />

                    {/* soft dreamy glow */}
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.0}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />

                </mesh>
            ))}
        </group>
    );
}
