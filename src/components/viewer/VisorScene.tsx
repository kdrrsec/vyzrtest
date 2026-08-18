"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { applyPlacementToTexture, type VisorPlacement } from "@/lib/visorPlacement";
import { VisorFallback, VisorModel } from "./VisorModel";

type Props = {
  textureUrl: string | null;
  usePlaceholderModel?: boolean;
  placement: VisorPlacement;
};

function SceneContent({
  textureUrl,
  usePlaceholderModel,
  placement,
}: {
  textureUrl: string | null;
  usePlaceholderModel: boolean;
  placement: VisorPlacement;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!textureUrl) {
      setTexture((prev) => {
        prev?.dispose();
        return null;
      });
      return;
    }

    const loader = new THREE.TextureLoader();
    /* Shopify / CDN previews must be fetched with CORS or WebGL texturing often fails at draw time. */
    loader.setCrossOrigin("anonymous");
    let cancelled = false;
    const next = loader.load(
      textureUrl,
      () => {
        if (cancelled) {
          next.dispose();
          return;
        }
        try {
          next.colorSpace = THREE.SRGBColorSpace;
          next.wrapS = THREE.ClampToEdgeWrapping;
          next.wrapT = THREE.ClampToEdgeWrapping;
          next.flipY = false;
          next.needsUpdate = true;
        } catch {
          next.dispose();
          setTexture((prev) => {
            prev?.dispose();
            return null;
          });
          return;
        }
        setTexture((prev) => {
          prev?.dispose();
          return next;
        });
      },
      undefined,
      () => {
        if (!cancelled) {
          setTexture((prev) => {
            prev?.dispose();
            return null;
          });
        }
      }
    );

    return () => {
      cancelled = true;
      next.dispose();
    };
  }, [textureUrl]);

  useEffect(() => {
    if (!texture) return;
    applyPlacementToTexture(texture, placement);
  }, [texture, placement]);

  const showGlb = !usePlaceholderModel;

  return (
    <>
      {/* No <Environment preset>: HDR loads from a CDN; failures rethrow to the outer error boundary. */}
      <hemisphereLight intensity={0.38} color="#e8e8e8" groundColor="#080808" />
      <ambientLight intensity={0.28} />
      <spotLight position={[4, 6, 4]} angle={0.35} penumbra={1} intensity={1.25} />
      <spotLight position={[-4, 3, -2]} intensity={0.45} color="#ffffff" />
      <directionalLight position={[0, 4, 6]} intensity={0.35} />
      <Suspense fallback={<VisorFallback map={texture} />}>
        <group position={[0, 0, 0]}>
          {showGlb ? (
            <VisorModel engraveMap={texture} />
          ) : (
            <VisorFallback map={texture} />
          )}
        </group>
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        rotateSpeed={0.85}
        zoomSpeed={0.8}
        minPolarAngle={0.2 * Math.PI}
        maxPolarAngle={Math.PI / 2 + 0.12}
        minDistance={1.85}
        maxDistance={5.5}
      />
    </>
  );
}

export function VisorScene({
  textureUrl,
  usePlaceholderModel = false,
  placement,
}: Props) {
  return (
    <Canvas
      className="!block h-full w-full !touch-none"
      shadows={false}
      camera={{ position: [2.4, 1.2, 2.6], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 2]}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0xffffff, 0);
        scene.background = null;
      }}
    >
      <SceneContent
        textureUrl={textureUrl}
        usePlaceholderModel={usePlaceholderModel}
        placement={placement}
      />
    </Canvas>
  );
}
