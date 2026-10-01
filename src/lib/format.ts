/**
 * Format a whole-Naira amount for display, e.g. 68000 -> "₦68,000".
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
