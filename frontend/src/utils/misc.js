export function cn(...cls) {
    return cls.filter(Boolean).join(" ");
}

export function buildPageRange(current, total) {
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const within = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < within.length; i++) {
        out.push(within[i]);
        if (i < within.length - 1 && within[i + 1] - within[i] > 1) out.push("…");
    }
    return out;
}
