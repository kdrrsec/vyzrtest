/**
 * Offline demo: set `NEXT_PUBLIC_DEMO_SPIN_FRAMES=24` (or any integer ≥ 2) in `.env.local`
 * to show a placeholder sequence on `DEMO_PRODUCT` / when using the demo listing.
 */
export function getDemoSpinFrames(): string[] | null {
  const raw = process.env.NEXT_PUBLIC_DEMO_SPIN_FRAMES?.trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 2 || n > 120) return null;
  return Array.from({ length: n }, (_, i) => {
    const label = String(i + 1).padStart(2, "0");
    return `https://placehold.co/800x800/101010/a8a8a8/png?text=${label}`;
  });
}
