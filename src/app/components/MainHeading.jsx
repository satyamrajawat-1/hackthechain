"use client";

import { Text3D, Center } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

export default function Heading3D() {
  const group = useRef();

  const t1 = useRef();
  const t2 = useRef();
  const t3 = useRef();

  // floating effect
  useFrame((state) => {
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
  });

  // ⭐ GSAP ANIMATION ⭐
//   useEffect(() => {
//   const ctx = gsap.context(() => {
//     // Start above & invisible
//     [t1.current, t2.current, t3.current].forEach((obj) => {
//       obj.position.y += 3;
//       obj.visible = false;
//     });

//     gsap.to(t1.current.position, {
//       y: t1.current.position.y - 3,
//       duration: 1,
//       ease: "power3.out",
//       onStart: () => (t1.current.visible = true),
//     });

//     gsap.to(t2.current.position, {
//       y: t2.current.position.y - 3,
//       duration: 1,
//       ease: "power3.out",
//       delay: 0.25,
//       onStart: () => (t2.current.visible = true),
//     });

//     gsap.to(t3.current.position, {
//       y: t3.current.position.y - 3,
//       duration: 1,
//       ease: "power3.out",
//       delay: 0.45,
//       onStart: () => (t3.current.visible = true),
//     });
//   });

//   return () => ctx.revert();
// }, []);


  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {/* TOP LINE */}
      <Center position={[0, 2.3, -2]}>
        <group ref={t1}>
          <Text3D
            font="/fonts/Montserrat_Bold.json"
            size={1.6}
            height={0.15}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.01}
          >
            CODEBASE PRESENTS
            <meshStandardMaterial color="#E2DFD2" />
          </Text3D>
        </group>
      </Center>

      {/* MAIN TITLE */}
      <Center position={[0, 0.7, -2]}>
        <group ref={t2}>
          <Text3D
            font="/fonts/Montserrat_Bold.json"
            size={1.0}
            height={0.15}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.01}
          >
            HACK THE CHAIN 4.0
            <meshStandardMaterial color="#E2DFD2" />
          </Text3D>
        </group>
      </Center>

      {/* SUBTEXT */}
      <Center position={[0, -0.4, -2]}>
        <group ref={t3}>
          <Text3D
            font="/fonts/Montserrat_Bold.json"
            size={0.4}
            height={0.15}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.01}
          >
            BIGGEST HACKATHON IN KOTA CITY
            <meshStandardMaterial color="#E2DFD2" />
          </Text3D>
        </group>
      </Center>
    </group>
  );
}
