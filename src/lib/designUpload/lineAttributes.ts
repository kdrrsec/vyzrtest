import type { CustomizerSetupId, SingleSide, VisorSlotId } from "@/lib/customizerSetup";
import { slotsForSetup } from "@/lib/customizerSetup";

type CustomUploadLabels = {
  setupKey: string;
  setupSummary: string;
  slotLeft: string;
  slotRight: string;
  slotTop: string;
};

const SLOT_LABEL: Record<VisorSlotId, keyof CustomUploadLabels> = {
  left: "slotLeft",
  right: "slotRight",
  top: "slotTop",
};

export function buildCustomUploadLineAttributes(
  setup: CustomizerSetupId,
  slotUrls: Partial<Record<VisorSlotId, string>>,
  labels: CustomUploadLabels,
  singleSide: SingleSide = "left"
): { key: string; value: string }[] {
  const attrs: { key: string; value: string }[] = [
    { key: labels.setupKey, value: labels.setupSummary },
  ];

  for (const slot of slotsForSetup(setup, singleSide)) {
    const url = slotUrls[slot]?.trim();
    if (url) {
      attrs.push({ key: labels[SLOT_LABEL[slot]], value: url });
    }
  }

  return attrs;
}
