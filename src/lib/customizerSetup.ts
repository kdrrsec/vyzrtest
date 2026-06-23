export type CustomizerSetupId = "single" | "double" | "full";

export type VisorSlotId = "left" | "right" | "top";

export type SingleSide = "left" | "right";

export type SlotUploads = Record<VisorSlotId, string | null>;

export const SETUP_PRICES_EUR: Record<CustomizerSetupId, number> = {
  single: 49,
  double: 89,
  full: 149,
};

export function slotsForSetup(
  setup: CustomizerSetupId,
  singleSide: SingleSide = "left"
): VisorSlotId[] {
  if (setup === "single") return [singleSide];
  if (setup === "double") return ["left", "right"];
  return ["left", "top", "right"];
}
