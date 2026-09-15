// Tiny SVG line chart, returned as an HTML string.
import { shortDate } from "./logic.js";

const W = 320;
const H = 150;
const PAD = { left: 38, right: 12, top: 14, bottom: 26 };

const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** points: [{date: "YYYY-MM-DD", value: number}], oldest first. */
export function lineChart(points, { color = "var(--accent)", unit = "" } = {}) {
  if (points.length < 2) {
    const text = points.length
      ? `${fmt(points[0].value)} ${unit} so far. Log one more to see a chart.`
      : "No data yet.";
    return `<p class="muted small">${text}</p>`;
  }

  const values = points.map((p) => p.value);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const min = low === high ? low - 1 : low;
  const max = low === high ? high + 1 : high;
  const x = (i) => PAD.left + (i * (W - PAD.left - PAD.right)) / (points.length - 1);
  const y = (v) => PAD.top + ((max - v) * (H - PAD.top - PAD.bottom)) / (max - min);
  const coords = points.map((p, i) => [x(i).toFixed(1), y(p.value).toFixed(1)]);

  return `
  <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Chart from ${fmt(values[0])} to ${fmt(values.at(-1))} ${unit}">
    <line class="grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${y(high)}" y2="${y(high)}"/>
    <line class="grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${y(low)}" y2="${y(low)}"/>
    <text class="axis" x="${PAD.left - 6}" y="${y(high) + 4}" text-anchor="end">${fmt(high)}</text>
    <text class="axis" x="${PAD.left - 6}" y="${y(low) + 4}" text-anchor="end">${fmt(low)}</text>
    <polyline points="${coords.map((c) => c.join(",")).join(" ")}" style="fill:none;stroke:${color};stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round"/>
    ${coords.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.5" style="fill:${color}"/>`).join("")}
    <text class="axis" x="${PAD.left}" y="${H - 6}">${shortDate(points[0].date)}</text>
    <text class="axis" x="${W - PAD.right}" y="${H - 6}" text-anchor="end">${shortDate(points.at(-1).date)}</text>
  </svg>`;
}
