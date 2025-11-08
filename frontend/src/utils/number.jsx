// src/utils/number.jsx
import { toNum, fmtOrDash } from "./format";

/** k/m/b/t compactor (always lowercase) */
export function compactNumber(n, digits = 1) {
  const v = toNum(n);
  if (!Number.isFinite(v)) return "—";
  const abs = Math.abs(v);
  const parts = [
    { t: 1e12, s: "t" },
    { t: 1e9,  s: "b" },
    { t: 1e6,  s: "m" },
    { t: 1e3,  s: "k" },
  ];
  for (const { t, s } of parts) {
    if (abs >= t) {
      const val = v / t;
      const fixed = Math.abs(val) >= 10 ? val.toFixed(0) : val.toFixed(digits);
      return fixed.replace(/\.0$/, "") + s;
    }
  }
  return fmtOrDash(v);
}

/** Small React wrapper that shows compact value, full value on hover */
export function CompactNum({ value, digits = 1, className = "" }) {
  const v = toNum(value);
  const full = Number.isFinite(v) ? fmtOrDash(v) : "—";
  const small = compactNumber(v, digits);
  return (
    <span title={full} className={`whitespace-nowrap tabular-nums ${className}`}>
      {small}
    </span>
  );
}

/** Formatting helpers */
export const fmtUSD = (n, maxFrac = 2) => {
  const v = toNum(n);
  if (!Number.isFinite(v)) return "—";
  const sign = v < 0 ? "-" : "";
  return (
    sign +
    "$" +
    Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: maxFrac })
  );
};

export const fmtNum = (n, d = 4) => {
  const v = toNum(n);
  return Number.isFinite(v)
    ? v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: d })
    : "—";
};

export const fmtPct = (n, d = 2) => {
  const v = toNum(n);
  if (!Number.isFinite(v)) return "—";
  const sign = v >= 0 ? "+" : "";
  return `${sign}${(v * 100).toFixed(d)}%`;
};

export const clsPnL = (n) => {
  const v = toNum(n);
  return v > 0 ? "pnl-pos" : v < 0 ? "pnl-neg" : "pnl-flat";
};

/** Trading math helpers (kept here since they’re number-centric) */
export function unrealizedPnlUSD({ side, size, entry, mark, contractSize = 1, fees = 0 }) {
  const s = toNum(size);
  const e = toNum(entry);
  const m = toNum(mark);
  const f = toNum(fees) || 0;
  if (!Number.isFinite(s) || !Number.isFinite(e) || !Number.isFinite(m)) return NaN;
  const dir = side === "SHORT" ? -1 : 1;
  return dir * (m - e) * s * contractSize - f;
}

export function pnlPercent({ pnlUSD, marginUSD }) {
  const p = toNum(pnlUSD);
  const mg = toNum(marginUSD);
  if (!Number.isFinite(p) || !Number.isFinite(mg) || mg === 0) return NaN;
  return p / mg;
}
