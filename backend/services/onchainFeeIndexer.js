// services/onchainFeeIndexer.js
import WebSocket from "ws";

const WS_URL = process.env.LIGHTER_WS_URL || "wss://mainnet.zklighter.elliot.ai/stream";

// divisor can be changed at runtime via setFeeDivisor
let CURRENT_FEE_DIVISOR = Number(process.env.FEE_DIVISOR || 1_000_000);

// How many markets to blind-subscribe at startup (discovery can lag)
const BLIND_MARKET_MAX = Number(process.env.BLIND_MARKET_MAX || 512);

// Heartbeat / resiliency
const HEARTBEAT_MS = Number(process.env.HEARTBEAT_MS || 15_000);
const STALE_MS = Number(process.env.STALE_MS || 45_000);
const LOG_TICK_MS = Number(process.env.LOG_TICK_MS || 10_000); // print a compact debug line every 10s

const ONE_HOUR = 3600 * 1000;
const MAX_WINDOW = ONE_HOUR * 48;

// With-fee events buffer (~48h), values are already scaled to display units (USDC)
const FEE_EVENTS = []; // { ts(ms), maker_fee, taker_fee, total, market_id, tx_hash, trade_id }

// Optional raw buffers (debug)
const RAW_TRADES = []; // last ~500
const RAW_TXS = [];    // last ~500

const SUBSCRIBED_MARKETS = new Set(); // what we *want* to be subscribed to
const LIVE_SUBSCRIPTIONS = new Set(); // what we've actually sent to WS

const STATS = {
    opened: 0,
    closed: 0,
    messages: 0,
    market_updates: 0,
    trade_updates: 0,
    executed_updates: 0,
    trans_updates: 0,
    last_types: [],
    last_samples: [], // [{kind, at, count}]
    last_msg_at: 0,
};

let ws = null;
let heartbeatTimer = null;
let staleTimer = null;
let logTicker = null;

function log(...args) { console.log("[onchainFeeIndexer]", ...args); }
function ringPush(arr, item, max = 500) { arr.push(item); if (arr.length > max) arr.shift(); }
function trackType(t) { if (t) { STATS.last_types.push(t); if (STATS.last_types.length > 50) STATS.last_types.shift(); } }
function markMessage() { STATS.last_msg_at = Date.now(); }

function startTimers() {
    clearTimers();

    heartbeatTimer = setInterval(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        try { ws.ping(); } catch { /* noop */ }
    }, HEARTBEAT_MS);

    staleTimer = setInterval(() => {
        const now = Date.now();
        if (now - (STATS.last_msg_at || 0) > STALE_MS) {
            log("no messages for", Math.round((now - (STATS.last_msg_at || 0)) / 1000), "s → restarting websocket");
            safeClose();
        }
    }, Math.min(STALE_MS, HEARTBEAT_MS * 2));

    logTicker = setInterval(() => {
        log(
            `tick msgs=${STATS.messages} trades+=${STATS.trade_updates} exec+=${STATS.executed_updates}` +
            ` subs=${LIVE_SUBSCRIPTIONS.size}/${SUBSCRIBED_MARKETS.size} events=${FEE_EVENTS.length}` +
            ` divisor=${CURRENT_FEE_DIVISOR}`
        );
    }, LOG_TICK_MS);
}

function clearTimers() {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    if (staleTimer) clearInterval(staleTimer);
    if (logTicker) clearInterval(logTicker);
    heartbeatTimer = staleTimer = logTicker = null;
}

function safeClose() {
    try { ws && ws.close(); } catch { /* noop */ }
}

function pruneOld() {
    const cutoff = Date.now() - MAX_WINDOW;
    if (!FEE_EVENTS.length) return;
    const kept = FEE_EVENTS.filter(e => e.ts >= cutoff);
    if (kept.length !== FEE_EVENTS.length) {
        FEE_EVENTS.length = 0;
        FEE_EVENTS.push(...kept);
    }
}

function numOrNull(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function addSample(kind, count) {
    STATS.last_samples.unshift({ kind, at: Date.now(), count });
    STATS.last_samples = STATS.last_samples.slice(0, 10);
}

function wantSubscribe(marketId) {
    if (!Number.isFinite(marketId)) return;
    SUBSCRIBED_MARKETS.add(marketId);
}

function ensureTradeSub(ws, marketId) {
    if (!Number.isFinite(marketId)) return;
    wantSubscribe(marketId);
    const chan = `trade/${marketId}`;
    if (LIVE_SUBSCRIPTIONS.has(chan)) return;
    try {
        ws.send(JSON.stringify({ type: "subscribe", channel: chan }));
        LIVE_SUBSCRIPTIONS.add(chan);
    } catch (e) {
        log("subscribe error", chan, e?.message);
    }
}

function resubscribeAll(ws) {
    // Always market discovery
    try {
        ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
    } catch { /* noop */ }

    // Fallback: executed tx stream (sometimes fee fields live in event_info/info)
    try {
        ws.send(JSON.stringify({ type: "subscribe", channel: "executed_transaction" }));
    } catch { /* noop */ }

    // Blind subscribe baseline range
    for (let i = 0; i < BLIND_MARKET_MAX; i++) ensureTradeSub(ws, i);

    // Plus everything we wanted before reconnect
    for (const mid of SUBSCRIBED_MARKETS) ensureTradeSub(ws, mid);
}

function pushFeeEventFromTrade(t) {
    // per docs: maker_fee/taker_fee are INTEGERs and omitted when zero
    const makerRaw = numOrNull(t?.maker_fee) ?? 0;
    const takerRaw = numOrNull(t?.taker_fee) ?? 0;
    if (makerRaw === 0 && takerRaw === 0) return false;

    const maker = makerRaw / CURRENT_FEE_DIVISOR;
    const taker = takerRaw / CURRENT_FEE_DIVISOR;
    const ts = Number.isFinite(Number(t?.timestamp)) ? Number(t.timestamp) * 1000 : Date.now();
    const market_id = numOrNull(t?.market_id) ?? numOrNull(t?.market_index) ?? -1;

    FEE_EVENTS.push({
        ts,
        maker_fee: maker,
        taker_fee: taker,
        total: maker + taker,
        market_id,
        tx_hash: t?.tx_hash || "",
        trade_id: t?.trade_id,
    });
    return true;
}

function tryParseJson(str) {
    if (!str || typeof str !== "string") return null;
    try { return JSON.parse(str); } catch { return null; }
}

function pushFeeEventFromExecutedTx(tx) {
    // Try both event_info and info (both are JSON strings in docs)
    const info = tryParseJson(tx?.event_info) || tryParseJson(tx?.info) || {};
    const makerRaw = numOrNull(info?.maker_fee) ?? 0;
    const takerRaw = numOrNull(info?.taker_fee) ?? 0;
    if (makerRaw === 0 && takerRaw === 0) return false;

    const maker = makerRaw / CURRENT_FEE_DIVISOR;
    const taker = takerRaw / CURRENT_FEE_DIVISOR;
    const ts = Number.isFinite(Number(tx?.executed_at)) ? Number(tx.executed_at) : Date.now();
    const market_id = numOrNull(info?.market_id) ?? numOrNull(info?.MarketIndex) ?? -1;

    FEE_EVENTS.push({
        ts,
        maker_fee: maker,
        taker_fee: taker,
        total: maker + taker,
        market_id,
        tx_hash: tx?.hash || "",
        trade_id: undefined,
    });
    return true;
}

function handleTrades(trades = []) {
    if (!Array.isArray(trades) || trades.length === 0) return;

    for (const t of trades) ringPush(RAW_TRADES, t);

    let counted = 0;
    for (const t of trades) {
        if (pushFeeEventFromTrade(t)) counted++;
    }
    if (counted) {
        pruneOld();
        STATS.trade_updates += counted;
        addSample("trade_fees", counted);
    }
}

function handleExecutedTxs(txs = []) {
    if (!Array.isArray(txs) || txs.length === 0) return;

    for (const tx of txs) ringPush(RAW_TXS, tx);

    let counted = 0;
    for (const tx of txs) {
        if (pushFeeEventFromExecutedTx(tx)) counted++;
    }
    if (counted) {
        pruneOld();
        STATS.executed_updates += counted;
        addSample("executed_tx_fees", counted);
    }
}

export function startOnchainFeeIndexer() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    log("connecting to", WS_URL);
    ws = new WebSocket(WS_URL);

    ws.on("open", () => {
        STATS.opened++;
        STATS.last_msg_at = Date.now();
        LIVE_SUBSCRIPTIONS.clear();
        log("connected");
        resubscribeAll(ws);
        startTimers();
    });

    ws.on("pong", () => {
        markMessage();
    });

    ws.on("message", (buf) => {
        STATS.messages++;
        markMessage();

        let msg;
        try { msg = JSON.parse(buf.toString()); } catch { return; }
        const type = msg?.type;
        trackType(type);

        if (type === "update/market_stats") {
            STATS.market_updates++;
            const mid =
                numOrNull(msg?.market_stats?.market_id) ??
                numOrNull(msg?.market_stats?.market_index) ??
                numOrNull(msg?.market_id) ??
                numOrNull(msg?.market_index);
            if (mid !== null) ensureTradeSub(ws, mid);
            return;
        }

        if (type === "update/trade" && Array.isArray(msg?.trades)) {
            handleTrades(msg.trades);
            return;
        }

        if (type === "update/executed_transaction" && Array.isArray(msg?.txs)) {
            handleExecutedTxs(msg?.txs);
            return;
        }

        if (type === "update/transaction" && Array.isArray(msg?.txs)) {
            // not used for fees, but useful to see traffic
            STATS.trans_updates += msg?.txs.length || 0;
            addSample("transaction", msg?.txs.length || 0);
            return;
        }
    });

    ws.on("close", () => {
        STATS.closed++;
        clearTimers();
        log("socket closed — retrying in 1500ms");
        setTimeout(startOnchainFeeIndexer, 1500);
    });

    ws.on("error", (err) => {
        log("ws error:", err?.message || err);
        clearTimers();
        try { ws.close(); } catch { /* noop */ }
    });
}

// runtime divisor control (optional)
export function setFeeDivisor(divisor) {
    const n = Number(divisor);
    if (!Number.isFinite(n) || n <= 0) return false;
    CURRENT_FEE_DIVISOR = n;
    return true;
}

export function getAllFeeEvents({ includeZero = false } = {}) {
    pruneOld();
    if (includeZero) {
        return RAW_TRADES.map((t) => ({
            ts: Number.isFinite(Number(t?.timestamp)) ? Number(t.timestamp) * 1000 : Date.now(),
            maker_fee: (numOrNull(t?.maker_fee) ?? 0) / CURRENT_FEE_DIVISOR,
            taker_fee: (numOrNull(t?.taker_fee) ?? 0) / CURRENT_FEE_DIVISOR,
            total: ((numOrNull(t?.maker_fee) ?? 0) + (numOrNull(t?.taker_fee) ?? 0)) / CURRENT_FEE_DIVISOR,
            market_id: numOrNull(t?.market_id) ?? numOrNull(t?.market_index) ?? -1,
            tx_hash: t?.tx_hash || "",
            trade_id: t?.trade_id,
        }));
    }
    return FEE_EVENTS;
}

export function get24hRevenue() {
    pruneOld();
    const cutoff = Date.now() - 24 * ONE_HOUR;
    let maker = 0, taker = 0;

    for (const e of FEE_EVENTS) {
        if (e.ts >= cutoff) {
            maker += e.maker_fee;
            taker += e.taker_fee;
        }
    }

    const total = maker + taker;
    return {
        window_ms: 24 * ONE_HOUR,
        updated_at: Date.now(),
        totals_24h: { maker, taker, total },
        approx_year_revenue: total * 365,
    };
}

export function getIndexerDebug() {
    pruneOld();
    return {
        ws_url: WS_URL,
        fee_divisor: CURRENT_FEE_DIVISOR,
        opened: STATS.opened,
        closed: STATS.closed,
        messages: STATS.messages,
        market_updates: STATS.market_updates,
        trade_updates: STATS.trade_updates,
        executed_updates: STATS.executed_updates,
        transaction_updates: STATS.trans_updates,
        subscribed_markets: Array.from(SUBSCRIBED_MARKETS).sort((a, b) => a - b),
        live_subscriptions: Array.from(LIVE_SUBSCRIPTIONS).sort(),
        last_types: STATS.last_types,
        last_samples: STATS.last_samples,
        last_msg_at: STATS.last_msg_at,
        events_buffered: FEE_EVENTS.length,
        raw_trades_buffered: RAW_TRADES.length,
        raw_txs_buffered: RAW_TXS.length,
    };
}

// (Optional) helper to clear buffers if you want an admin reset
export function __resetIndexer() {
    FEE_EVENTS.length = 0;
    RAW_TRADES.length = 0;
    RAW_TXS.length = 0;
    STATS.trade_updates = 0;
    STATS.executed_updates = 0;
    STATS.trans_updates = 0;
    STATS.last_samples = [];
}
