// src/utils/format.js

/** Safe number parsing (string or number) -> number | NaN */
export const toNum = (v) => {
    if (v === null || v === undefined || v === "") return NaN;
    const n = typeof v === "string" ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : NaN;
};

/** Format number, default 2 decimals; "—" if not finite */
export const fmt = (v, d = 2) => {
    const n = toNum(v);
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: d,
    });
};

/** Like fmt, but also hides ~zero as "—" */
export const fmtOrDash = (v, d = 2) => {
    const n = toNum(v);
    if (!Number.isFinite(n) || Math.abs(n) < 1e-12) return "—";
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: d,
    });
};
// --- Time helpers ---
export function fromNow(ts) {
    const d = new Date(ts);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (!isFinite(diff)) return "—";
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleString();
}

export function shortAgo(ms) {
    if (ms == null) return "never";
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return `${h}h`;
}

// --- Number formatting ---
export function formatNumberAbbrev(value, decimals = 1) {
    if (value == null || isNaN(value)) return "0";
    const abs = Math.abs(value);
    if (abs >= 1e12) return (value / 1e12).toFixed(decimals) + "T";
    if (abs >= 1e9) return (value / 1e9).toFixed(decimals) + "B";
    if (abs >= 1e6) return (value / 1e6).toFixed(decimals) + "M";
    if (abs >= 1e3) return (value / 1e3).toFixed(decimals) + "K";
    return value.toFixed(decimals);
}
