import type { VisorCatalogEntry } from "@/lib/visorCatalog";
import { visorDisplayLabel } from "@/lib/visorCatalog";
import { formatMoney } from "@/lib/money";

export type VisorFulfillmentId =
  | "own_visor"
  | "vyzr_supplies_visor"
  | "dropoff_visor";

/** Discount on engraving only when VYZR sources the visor (visor cost is separate). */
export const VYZR_SUPPLIES_ENGRAVING_DISCOUNT_PERCENT = 10;

/** Drop-off saves shipping both ways — same engraving discount applies. */
export function fulfillmentHasEngravingDiscount(
  fulfillment: VisorFulfillmentId
): boolean {
  return fulfillment === "vyzr_supplies_visor" || fulfillment === "dropoff_visor";
}

export function discountedEngravingAmount(
  amount: string,
  fulfillment: VisorFulfillmentId
): string {
  if (!fulfillmentHasEngravingDiscount(fulfillment)) return amount;
  const n = Number.parseFloat(amount);
  if (Number.isNaN(n) || n <= 0) return amount;
  const discounted = n * (1 - VYZR_SUPPLIES_ENGRAVING_DISCOUNT_PERCENT / 100);
  return discounted.toFixed(2);
}

/** Calendly booking page for in-person drop-off (set NEXT_PUBLIC_CALENDLY_URL). */
export function calendlyDropoffUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  return raw || undefined;
}

type FulfillmentLabels = {
  attrFulfillment: string;
  attrFulfillmentOwn: string;
  attrFulfillmentVyzr: string;
  attrFulfillmentDropoff: string;
  attrDropoffBooking: string;
  attrHelmet: string;
  attrVisorModel: string;
  attrVisorPrice: string;
};

export function buildFulfillmentLineAttributes(
  fulfillment: VisorFulfillmentId,
  opts: {
    helmetNote?: string;
    selectedVisor?: VisorCatalogEntry | null;
    labels: FulfillmentLabels;
  }
): { key: string; value: string }[] {
  const { helmetNote = "", selectedVisor, labels } = opts;

  const fulfillmentValue =
    fulfillment === "vyzr_supplies_visor"
      ? labels.attrFulfillmentVyzr
      : fulfillment === "dropoff_visor"
        ? labels.attrFulfillmentDropoff
        : labels.attrFulfillmentOwn;

  const attrs: { key: string; value: string }[] = [
    { key: labels.attrFulfillment, value: fulfillmentValue },
  ];

  if (fulfillment === "dropoff_visor") {
    const booking = calendlyDropoffUrl();
    if (booking) {
      attrs.push({ key: labels.attrDropoffBooking, value: booking });
    }
  }

  if (selectedVisor) {
    if (fulfillment === "vyzr_supplies_visor") {
      attrs.push({
        key: labels.attrVisorModel,
        value: visorDisplayLabel(selectedVisor),
      });
      attrs.push({
        key: labels.attrVisorPrice,
        value: formatMoney(String(selectedVisor.priceEUR), "EUR"),
      });
    } else {
      attrs.push({
        key: labels.attrHelmet,
        value: visorDisplayLabel(selectedVisor),
      });
    }
  } else {
    const note = helmetNote.trim();
    if (note) {
      attrs.push({ key: labels.attrHelmet, value: note });
    }
  }

  return attrs;
}

export function vyzrSuppliesDiscountCode(): string | undefined {
  const raw = process.env.SHOPIFY_VYZR_SUPPLIES_DISCOUNT_CODE?.trim();
  return raw || undefined;
}
