// src/utils/trading.js
import { toNum, fmtOrDash } from "./format";

/** Whether a position is "open" enough to show in Open tab */
export const isOpenPosition = (p) =>
    Math.abs(toNum(p?.position) || 0) > 0 ||
    Math.abs(toNum(p?.allocated_margin) || 0) > 0 ||
    Math.abs(toNum(p?.unrealized_pnl) || 0) > 0 ||
    (Number(p?.open_order_count) || 0) > 0 ||
    (Number(p?.pending_order_count) || 0) > 0;

/** Derive side reliably: sign -> qty -> text -> fallback */
export const getSide = (p) => {
    if (Number.isFinite(p?.sign)) return p.sign > 0 ? "LONG" : p.sign < 0 ? "SHORT" : "FLAT";
    const q = toNum(p?.position);
    if (Number.isFinite(q) && Math.abs(q) > 1e-12) return q > 0 ? "LONG" : "SHORT";
    const s = String(p?.side || "").toLowerCase();
    if (s.includes("long")) return "LONG";
    if (s.includes("short")) return "SHORT";
    return "FLAT";
};

export const sidePillCls = (side) =>
    side === "LONG"
        ? "px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
        : side === "SHORT"
            ? "px-2 py-0.5 text-xs rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
            : "px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";

/** Strictly resolve *position* leverage (no account-level fallbacks) */
export const resolvePositionLeverage = (p) => {
    const lev = toNum(p?.leverage) || toNum(p?.effective_leverage);
    return Number.isFinite(lev) && lev > 0 ? lev : NaN;
};

/** Value-only leverage for column display */
export const positionLeverage = (p) => resolvePositionLeverage(p);

/**
 * margin_mode: 0 => Cross, 1 => Isolated
 * Cross margin = |position_value| / position_leverage
 */
export const marginCell = (p) => {
    const mm = Number(p?.margin_mode);
    const allocated = toNum(p?.allocated_margin);
    const posVal = toNum(p?.position_value);

    if (mm === 1) {
        return {
            label: fmtOrDash(allocated, 3),
            badge: "Isolated",
            badgeCls: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
        };
    }

    const lev = resolvePositionLeverage(p);
    const cross =
        Number.isFinite(posVal) && Number.isFinite(lev) && lev > 0
            ? Math.abs(posVal) / lev
            : NaN;

    return {
        label: fmtOrDash(cross, 3),
        badge: "Cross",
        badgeCls: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    };
};

/** PnL badge colors */
export const pnlPill = (n) => {
    const x = toNum(n);
    if (!Number.isFinite(x) || Math.abs(x) < 1e-12)
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
    return x > 0
        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
        : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300";
};

/** Row tinting for trades */
export const tradeRow = (type) => {
    const t = String(type || "").toLowerCase();
    if (t === "buy")
        return "bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500/60";
    if (t === "sell")
        return "bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500/60";
    return "bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400/40";
};
