// src/utils/merge.js
const keyForTrade = (t) =>
    `${t?.tx_hash ?? ""}|${t?.log_index ?? ""}|${t?.timestamp ?? ""}|${t?.block_height ?? ""}`;

export function mergeAccountAll(prev = {}, inc = {}) {
    const out = { ...prev, ...inc };

    // positions
    {
        const prevMap = prev?.positions || {};
        const incMap = inc?.positions || {};
        const merged = { ...prevMap };
        for (const [k, v] of Object.entries(incMap)) {
            if (v == null) delete merged[k];
            else merged[k] = { ...(prevMap[k] || {}), ...v };
        }
        out.positions = merged;
    }

    // shares
    {
        const prevArr = Array.isArray(prev?.shares) ? prev.shares : [];
        const incArr = Array.isArray(inc?.shares) ? inc.shares : [];
        const byIdx = new Map(prevArr.map((x) => [x.public_pool_index, x]));
        for (const x of incArr) {
            byIdx.set(x.public_pool_index, { ...(byIdx.get(x.public_pool_index) || {}), ...x });
        }
        out.shares = Array.from(byIdx.values());
    }

    // trades
    {
        const prevTrades = prev?.trades || {};
        const incTrades = inc?.trades || {};
        const merged = { ...prevTrades };
        for (const [mkt, arr] of Object.entries(incTrades)) {
            const base = Array.isArray(prevTrades[mkt]) ? prevTrades[mkt] : [];
            const next = Array.isArray(arr) ? [...arr, ...base] : base;
            const uniq = new Map();
            for (const t of next) uniq.set(keyForTrade(t), t);
            merged[mkt] = Array.from(uniq.values())
                .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0))
                .slice(0, 200);
        }
        out.trades = merged;
    }

    // counters
    for (const k of [
        "daily_trades_count",
        "daily_volume",
        "weekly_trades_count",
        "weekly_volume",
        "monthly_trades_count",
        "monthly_volume",
        "total_trades_count",
        "total_volume",
    ]) {
        if (k in inc) out[k] = inc[k];
    }

    // nested stats
    if (inc?.stats) out.stats = { ...(prev?.stats || {}), ...inc.stats };

    return out;
}
