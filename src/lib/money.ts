export function formatMoney(amount: string, currencyCode: string) {
  const n = Number.parseFloat(amount);
  if (Number.isNaN(n)) return amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(n);
}
