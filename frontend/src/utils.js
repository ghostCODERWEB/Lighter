// src/utils.js
export const fmtUSD = (n) =>
    (isFinite(n) ? (n < 0 ? "-" : "") + "$" + Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—");
export const fmtNum = (n, d = 4) =>
    (isFinite(n) ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: d }) : "—");
export const fmtPct = (n) => (isFinite(n) ? (n >= 0 ? "+" : "") + (n * 100).toFixed(2) + "%" : "—");
export const clsPnL = (n) => (n > 0 ? "pnl-pos" : n < 0 ? "pnl-neg" : "pnl-flat");

export function unrealizedPnlUSD({ side, size, entry, mark, contractSize = 1, fees = 0 }) {
    // side: "LONG" | "SHORT", size: absolute position size in contracts or units
    if (!isFinite(size) || !isFinite(entry) || !isFinite(mark)) return NaN;
    const dir = side === "SHORT" ? -1 : 1;
    const pnl = dir * (mark - entry) * size * contractSize - (fees || 0);
    return pnl;
}
export function pnlPercent({ pnlUSD, marginUSD }) {
    if (!isFinite(pnlUSD) || !isFinite(marginUSD) || marginUSD === 0) return NaN;
    return pnlUSD / marginUSD;
}
