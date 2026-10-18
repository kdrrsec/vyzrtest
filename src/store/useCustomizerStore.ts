import { create } from "zustand";
import type { CustomizerSetupId, SingleSide, SlotUploads, VisorSlotId } from "@/lib/customizerSetup";
import { slotsForSetup } from "@/lib/customizerSetup";

export type DesignTransform = { scale: number; x: number; y: number; rotation: number };
export const defaultTransform: DesignTransform = { scale: 80, x: 0, y: 0, rotation: 0 };
const freshTransforms = () => ({ left: { ...defaultTransform }, right: { ...defaultTransform }, top: { ...defaultTransform } });

type CustomizerState = {
  transforms: Record<VisorSlotId, DesignTransform>;
  setTransform: (slot: VisorSlotId, patch: Partial<DesignTransform>) => void;
  setup: CustomizerSetupId | null;
  singleSide: SingleSide;
  uploads: SlotUploads;
  setSetup: (setup: CustomizerSetupId) => void;
  setSingleSide: (side: SingleSide) => void;
  setSlotUpload: (slot: VisorSlotId, dataUrl: string | null) => void;
  reset: () => void;
};

const emptyUploads: SlotUploads = { left: null, right: null, top: null };

const initial = {
  setup: null as CustomizerSetupId | null,
  singleSide: "left" as SingleSide,
  uploads: { ...emptyUploads },
  transforms: freshTransforms(),
};

export const useCustomizerStore = create<CustomizerState>((set) => ({
  ...initial,
  setTransform: (slot, patch) => set((s) => ({ transforms: { ...s.transforms, [slot]: { ...s.transforms[slot], ...patch } } })),
  setSetup: (setup) =>
    set((s) => {
      const allowed = new Set(slotsForSetup(setup, s.singleSide));
      const uploads = { ...s.uploads };
      (["left", "right", "top"] as const).forEach((slot) => {
        if (!allowed.has(slot)) uploads[slot] = null;
      });
      return { setup, uploads };
    }),
  setSingleSide: (singleSide) =>
    set((s) => {
      const uploads = { ...s.uploads };
      // Clear old side upload when switching
      if (s.setup === "single") {
        uploads[s.singleSide] = null;
      }
      return { singleSide, uploads };
    }),
  setSlotUpload: (slot, dataUrl) =>
    set((s) => ({
      uploads: { ...s.uploads, [slot]: dataUrl },
    })),
  reset: () => set({ ...initial, uploads: { ...emptyUploads }, transforms: freshTransforms() }),
}));
