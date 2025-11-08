// test.js (ESM, works with "type": "module")
import https from "https";
import WebSocket from "ws";

const REST_BASE = "https://mainnet.zklighter.elliot.ai";
const WS_URL = "wss://mainnet.zklighter.elliot.ai/stream";

const QUIET_MS = 5000;
const HARD_TIMEOUT_MS = 30000;

const log = (...a) => console.log(new Date().toISOString(), "-", ...a);

function getJSON(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                try {
                    resolve(JSON.parse(body || "null"));
                } catch (e) {
                    reject(new Error("JSON parse error: " + e.message));
                }
            });
        });
        req.on("error", reject);
        req.setTimeout(10000, () => req.destroy(new Error("Request timeout")));
    });
}

// Extract list of {id, symbol} from REST response
function extractMarkets(payload) {
    const arrays = [];

    if (Array.isArray(payload)) arrays.push(payload);
    if (payload && typeof payload === "object") {
        for (const v of Object.values(payload)) {
            if (Array.isArray(v)) arrays.push(v);
        }
    }

    for (const arr of arrays) {
        const out = arr
            .map((item) => item?.market_info || item?.marketInfo || item)
            .filter(Boolean)
            .map((mi) => ({
                id: Number(mi.market_id ?? mi.marketId ?? mi.market_index ?? mi.marketIndex),
                symbol: String(mi.symbol ?? mi.ticker ?? mi.market ?? "")
            }))
            .filter((x) => Number.isFinite(x.id) && x.symbol);

        if (out.length > 0) return out;
    }
    return [];
}

//
// MAIN
//
(async () => {
    log("Fetching market metadata …");

    let idToSymbol = new Map();
    try {
        const json = await getJSON(`${REST_BASE}/api/v1/orderBookDetails`);
        const pairs = extractMarkets(json);
        if (!pairs.length) throw new Error("No markets found");

        for (const { id, symbol } of pairs) idToSymbol.set(id, symbol);

        log(`Loaded ${idToSymbol.size} markets from REST.`);
    } catch (e) {
        log("ERROR:", e.message);
        process.exit(1);
    }

    // If WS fails → fallback must show full sorted list
    let fallbackOutput = [...idToSymbol.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([id, symbol]) => ({ id, symbol }));

    log("Connecting to Lighter WS…");
    const ws = new WebSocket(WS_URL);

    const seen = new Set();
    let lastNewAt = Date.now();
    let hardTimer;
    const startAt = Date.now();

    const finish = () => {
        let out;

        if (seen.size === 0) {
            // ✅ If WS returned nothing → output full sorted list
            out = fallbackOutput;
        } else {
            // ✅ Otherwise → output only confirmed markets, sorted by id
            out = [...idToSymbol.entries()]
                .filter(([id]) => seen.has(id))
                .sort((a, b) => a[0] - b[0])
                .map(([id, symbol]) => ({ id, symbol }));
        }

        console.log(JSON.stringify(out, null, 2));
        try { ws.close(); } catch { }
        clearTimeout(hardTimer);
        process.exit(0);
    };

    const maybeFinish = () => {
        const quiet = Date.now() - lastNewAt >= QUIET_MS;
        const timeout = Date.now() - startAt >= HARD_TIMEOUT_MS;
        const full = seen.size >= idToSymbol.size;

        if (full && quiet) return finish();
        if (timeout) return finish();
    };

    setInterval(maybeFinish, 250);
    hardTimer = setTimeout(maybeFinish, HARD_TIMEOUT_MS);

    ws.on("open", () => {
        log("✅ Connected, subscribing to market_stats/all");
        ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
    });

    ws.on("message", (raw) => {
        let msg;
        try { msg = JSON.parse(raw.toString()); } catch { return; }

        if (msg?.type === "update/market_stats" && msg.market_stats) {
            const id = Number(msg.market_stats.market_id);
            if (Number.isFinite(id) && !seen.has(id)) {
                seen.add(id);
                lastNewAt = Date.now();
                const sym = idToSymbol.get(id) || "(unknown)";
                log(`Market ${id} (${sym}) seen. ${seen.size}/${idToSymbol.size}`);
            }
        }
    });

    ws.on("error", (err) => log("WS error:", err.message));
})();
