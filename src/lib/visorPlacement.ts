import * as THREE from "three";

/** Horizontal position of the customer design on the visor decal UVs (shared by placeholder mesh + GLB). */
export type VisorPlacement = "left" | "center" | "right";

export const VISOR_PLACEMENT_IDS: VisorPlacement[] = ["left", "center", "right"];

/**
 * UV shift along **U** after your Blender unwrap is locked. Positive `offset.x` typically slides
 * the bitmap one way on the band; flip signs here if left/right look swapped on the final GLB.
 */
export const PLACEMENT_U_OFFSET: Record<VisorPlacement, number> = {
  left: 0.2,
  center: 0,
  right: -0.2,
};

export function applyPlacementToTexture(
  texture: THREE.Texture,
  placement: VisorPlacement
): void {
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(PLACEMENT_U_OFFSET[placement], 0);
  texture.needsUpdate = true;
}

export function objectPositionForPlacement(placement: VisorPlacement): string {
  if (placement === "left") return "28% 50%";
  if (placement === "right") return "72% 50%";
  return "50% 50%";
}
