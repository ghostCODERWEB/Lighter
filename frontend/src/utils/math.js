// src/utils/math.js
import { toNum } from "./format";

export const pct = (part, total, d = 1) => {
    const p = toNum(part);
    const t = toNum(total);
    if (!Number.isFinite(p) || !Number.isFinite(t) || t === 0) return "—";
    return ((p / t) * 100).toFixed(d) + "%";
};
