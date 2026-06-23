"use client";

import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

const VISOR_DECAL_MESH_NAMES = ["Visor_Decal", "visor_decal", "Decal", "Engraving"];

type Props = {
  engraveMap: THREE.Texture | null;
};

export function VisorModel({ engraveMap }: Props) {
  const { scene } = useGLTF("/models/visor-helmet.glb");
  const root = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const candidates: THREE.Mesh[] = [];
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const n = obj.name;
      if (VISOR_DECAL_MESH_NAMES.some((nm) => n === nm || n.includes(nm))) {
        candidates.push(obj);
      }
    });

    const decalMesh = candidates[0];
    if (!decalMesh) return;

    const mat = decalMesh.material;
    const materials = Array.isArray(mat) ? mat : [mat];
    for (const matEntry of materials) {
      if (matEntry instanceof THREE.MeshStandardMaterial) {
        if (engraveMap) {
          matEntry.map = engraveMap;
          matEntry.transparent = true;
        } else {
          matEntry.map = null;
          matEntry.transparent = true;
        }
        matEntry.needsUpdate = true;
        matEntry.roughness = 0.35;
        matEntry.metalness = 0.05;
      }
    }
  }, [root, engraveMap]);

  return <primitive object={root} />;
}

/**
 * Readable “motorhelm + vizier” silhouette: dark shell + curved visor band where the
 * customer upload / template is shown (UVs on the outer arc).
 */
export function VisorFallback({ map }: { map: THREE.Texture | null }) {
  return (
    <group rotation={[0.15, 0, 0]}>
      <mesh position={[0, 0.14, -0.07]} rotation={[-0.38, 0, 0]}>
        <sphereGeometry args={[0.8, 48, 40, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        <meshStandardMaterial
          color="#101010"
          roughness={0.9}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.055, 72, 1, true, 0, Math.PI]} />
        {/* meshStandardMaterial: fewer shader features than physical; avoids some GPU/driver compile failures */}
        <meshStandardMaterial
          map={map ?? undefined}
          color={map ? "#ffffff" : "#0a0a0a"}
          roughness={map ? 0.32 : 0.35}
          metalness={map ? 0.08 : 0.28}
          transparent
          opacity={map ? 1 : 0.92}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
