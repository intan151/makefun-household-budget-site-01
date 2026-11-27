// HomeLedger charts — small hand-rolled SVG charts, no library. Both return
// an SVG string the views drop into the page, so the charts work offline and
// add almost nothing to the first load.
import { fmtMoneyWhole } from "./format.js";

// A donut of spending by category. Slices with no spending are skipped; the
// hole in the middle carries the total spent.
export function donutChart(slices, total) {
  const size = 190;
  const radius = 80;
  const thickness = 30;
  const cx = size / 2;
  const cy = size / 2;
  const shown = slices.filter((s) => s.value > 0);
  const sum = shown.reduce((acc, s) => acc + s.value, 0) || 1;
  let offset = 25; // start at the top
  const paths = shown.map((slice) => {
    const fraction = slice.value / sum;
    const startAngle = (offset / 100) * Math.PI * 2;
    const endAngle = ((offset + fraction * 100) / 100) * Math.PI * 2;
    offset += fraction * 100;
    const large = fraction > 0.5 ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${slice.color}" stroke-width="${thickness}"/>`;
  });
  const legend = shown
    .map(
      (s) =>
        `<span style="--sw:${s.color}">${s.label} — ${fmtMoneyWhole(s.value)}</span>`,
    )
    .join("");
  return `<div class="donut-wrap">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, total ${fmtMoneyWhole(total)}">
      ${paths.join("")}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" fill="#5f6f66">Spent</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="17" font-weight="700" fill="#22312a">${fmtMoneyWhole(total)}</text>
    </svg>
    <div class="legend">${legend}</div>
  </div>`;
}

// Vertical bars of monthly spending, oldest month first. The tallest bar
// sets the scale; this month's bar is highlighted in green.
export function barChart(months) {
  const width = 520;
  const height = 190;
  const top = 18;
  const bottom = 26;
  const max = Math.max(...months.map((m) => m.spent), 1);
  const gap = 14;
  const barWidth = (width - gap * (months.length + 1)) / months.length;
  const bars = months.map((month, i) => {
    const barHeight = ((height - top - bottom) * month.spent) / max;
    const x = gap + i * (barWidth + gap);
    const y = height - bottom - barHeight;
    const isCurrent = i === months.length - 1;
    const fill = isCurrent ? "#1d5c46" : "#9db8a8";
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="4" fill="${fill}"/>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="11" fill="#5f6f66">${fmtMoneyWhole(month.spent)}</text>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#22312a">${month.month}</text>`;
  });
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly spending for the last six months">${bars.join("")}</svg>`;
}
