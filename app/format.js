// HomeLedger formatting helpers — money and dates, one place, used by every view.
const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeMoneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// $1,234.56 — used for amounts, totals and table cells.
export function fmtMoney(amount) {
  return moneyFormatter.format(amount);
}

// $1,235 — used for big stat cards and chart labels.
export function fmtMoneyWhole(amount) {
  return wholeMoneyFormatter.format(amount);
}

// "Nov 26" from an ISO date like "2026-11-26".
export function fmtShortDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Clamp a number into a range; keeps sliders and progress bars honest.
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Escape text the household typed (expense names, goal names) before it is
// placed into a page, so a stray "<" can never break the markup.
export function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
