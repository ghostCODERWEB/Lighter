// test.js
import WebSocket from "ws";

const WS_URL = "wss://mainnet.zklighter.elliot.ai/stream";
const seen = new Set();

function log(...args) {
    console.log(new Date().toISOString(), "-", ...args);
}

function handle(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg?.type === "update/market_stats") {
        const mid = msg?.market_stats?.market_id;
        if (typeof mid === "number") {
            if (!seen.has(mid)) {
                seen.add(mid);
                log("NEW market_id:", mid);
                log("All market_ids:", [...seen].sort((a, b) => a - b).join(", "));
            }
        }
    }
}

function connect() {
    log("Connecting to Lighter WS…");
    const ws = new WebSocket(WS_URL);

    ws.on("open", () => {
        log("Connected. Subscribing to market_stats/all …");
        ws.send(JSON.stringify({
            type: "subscribe",
            channel: "market_stats/all"
        }));
    });

    ws.on("message", handle);

    ws.on("close", () => {
        log("Disconnected. Reconnecting in 2s…");
        setTimeout(connect, 2000);
    });

    ws.on("error", (err) => {
        log("WS error:", err.message || err);
    });
}

connect();
