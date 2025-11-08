#!/bin/sh
set -eu

FRONTEND_DIR="frontend"
PAGES_DIR="$FRONTEND_DIR/src/pages"

mkdir -p "$PAGES_DIR"

# 1) Create Account page
cat > "$PAGES_DIR/Account.jsx" <<'EOF'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const WS_URL = "wss://mainnet.zklighter.elliot.ai/stream";

function Section({ title, children }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ minWidth: 180, color: "#666" }}>{k}</div>
      <div style={{ fontWeight: 600, whiteSpace: "pre-wrap" }}>{String(v ?? "—")}</div>
    </div>
  );
}

export default function Account() {
  const [input, setInput] = useState("");
  const [accountId, setAccountId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // live state from ws
  const [accountAll, setAccountAll] = useState(null); // entire payload from account_all
  const [userStats, setUserStats] = useState(null);   // stats payload from user_stats

  const wsRef = useRef(null);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
  }, []);

  useEffect(() => () => disconnect(), [disconnect]);

  const connect = useCallback((id) => {
    setConnecting(true);
    setError(null);
    setAccountAll(null);
    setUserStats(null);

    disconnect();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // Subscribe to the two public channels (per docs you pasted)
      const subAll = { type: "subscribe", channel: `account_all/${id}` };
      const subStats = { type: "subscribe", channel: `user_stats/${id}` };
      ws.send(JSON.stringify(subAll));
      ws.send(JSON.stringify(subStats));
      setConnecting(false);
    };

    ws.onerror = (e) => {
      setError("WebSocket error");
      setConnecting(false);
    };

    ws.onclose = () => {
      // keep last known data; user can reconnect
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg?.type?.startsWith("update/") || msg?.type?.startsWith("subscribed/")) {
          // account_all payload has many top-level fields (counts, trades/positions maps, etc.)
          if (msg.channel?.startsWith("account_all:") || msg.type === "update/account_all" || msg.type === "update/account") {
            setAccountAll(msg);
          }
          // user_stats payload has .stats
          if (msg.channel?.startsWith("user_stats:") || msg.type === "update/user_stats") {
            setUserStats(msg);
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    };
  }, [disconnect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = (input || "").trim();
    if (!v) return;
    // Expecting numeric ACCOUNT_ID per docs. If you have an address->id mapping, we can add it later.
    if (!/^\d+$/.test(v)) {
      setError("Please enter a numeric ACCOUNT_ID (e.g. 10). If you need address-to-account mapping, we can add it.");
      return;
    }
    setAccountId(v);
    connect(v);
  };

  // Derived pretty views
  const stats = userStats?.stats ?? null;

  const positions = useMemo(() => {
    const map = accountAll?.positions || {};
    return Object.entries(map).map(([marketIndex, pos]) => ({ marketIndex, ...pos }));
  }, [accountAll]);

  const trades = useMemo(() => {
    const map = accountAll?.trades || {};
    // flatten {marketIndex: [trades]} -> []
    const arr = [];
    Object.entries(map).forEach(([marketIndex, ts]) => {
      if (Array.isArray(ts)) ts.forEach(t => arr.push({ marketIndex, ...t }));
    });
    // sort desc by timestamp if available
    arr.sort((a,b) => Number(b.timestamp||0) - Number(a.timestamp||0));
    return arr.slice(0, 200);
  }, [accountAll]);

  const fundingHistories = useMemo(() => {
    const map = accountAll?.funding_histories || {};
    const arr = [];
    Object.entries(map).forEach(([marketIndex, list]) => {
      if (Array.isArray(list)) list.forEach(f => arr.push({ marketIndex, ...f }));
    });
    arr.sort((a,b) => Number(b.timestamp||0) - Number(a.timestamp||0));
    return arr.slice(0, 200);
  }, [accountAll]);

  const shares = useMemo(() => {
    const s = accountAll?.shares || [];
    return Array.isArray(s) ? s : [];
  }, [accountAll]);

  const counts = useMemo(() => {
    if (!accountAll) return null;
    const pick = (k) => accountAll[k];
    return {
      daily_trades_count: pick("daily_trades_count"),
      daily_volume: pick("daily_volume"),
      weekly_trades_count: pick("weekly_trades_count"),
      weekly_volume: pick("weekly_volume"),
      monthly_trades_count: pick("monthly_trades_count"),
      monthly_volume: pick("monthly_volume"),
      total_trades_count: pick("total_trades_count"),
      total_volume: pick("total_volume"),
      account: accountAll.account,
    };
  }, [accountAll]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Enter ACCOUNT_ID (numeric)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: 8, width: 360 }}
        />
        <button type="submit" disabled={connecting} style={{ padding: "8px 12px" }}>
          {connecting ? "Connecting…" : "Subscribe"}
        </button>
        <button type="button" onClick={disconnect} style={{ padding: "8px 12px" }}>
          Disconnect
        </button>
      </form>

      {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

      {accountId && (
        <div style={{ color: "#666" }}>
          Subscribed to <code>account_all/{accountId}</code> and <code>user_stats/{accountId}</code> on {WS_URL}
        </div>
      )}

      {stats && (
        <Section title="Account Stats">
          {Object.entries(stats).map(([k, v]) => {
            if (v && typeof v === "object") {
              return (
                <div key={k} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{k}</div>
                  {Object.entries(v).map(([kk, vv]) => <KV key={`${k}.${kk}`} k={`• ${kk}`} v={vv} />)}
                </div>
              );
            }
            return <KV key={k} k={k} v={v} />;
          })}
        </Section>
      )}

      {counts && (
        <Section title="Trade & Volume Counters">
          {Object.entries(counts).map(([k, v]) => <KV key={k} k={k} v={v} />)}
        </Section>
      )}

      <Section title={`Positions (${positions.length})`}>
        {positions.length === 0 && <div>No positions</div>}
        {positions.map((p, i) => (
          <div key={i} style={{ padding: 8, borderBottom: "1px dashed #eee" }}>
            {Object.entries(p).map(([k, v]) => <KV key={k} k={k} v={v} />)}
          </div>
        ))}
      </Section>

      <Section title={`Trades (${trades.length})`}>
        {trades.length === 0 && <div>No trades</div>}
        {trades.map((t, i) => (
          <div key={i} style={{ padding: 8, borderBottom: "1px dashed #eee" }}>
            {Object.entries(t).map(([k, v]) => <KV key={k} k={k} v={v} />)}
          </div>
        ))}
      </Section>

      <Section title={`Funding Histories (${fundingHistories.length})`}>
        {fundingHistories.length === 0 && <div>No funding history</div>}
        {fundingHistories.map((f, i) => (
          <div key={i} style={{ padding: 8, borderBottom: "1px dashed #eee" }}>
            {Object.entries(f).map(([k, v]) => <KV key={k} k={k} v={v} />)}
          </div>
        ))}
      </Section>

      <Section title={`Shares (${shares.length})`}>
        {shares.length === 0 && <div>No shares</div>}
        {shares.map((s, i) => (
          <div key={i} style={{ padding: 8, borderBottom: "1px dashed #eee" }}>
            {Object.entries(s).map(([k, v]) => <KV key={k} k={k} v={v} />)}
          </div>
        ))}
      </Section>
    </div>
  );
}
EOF

# 2) Wire into App.jsx (import, nav link, route)
APP_FILE="$FRONTEND_DIR/src/App.jsx"
if [ ! -f "$APP_FILE" ]; then
  echo "Cannot find $APP_FILE. Make sure you are in the core folder with frontend/ present." >&2
  exit 1
fi

# Add import if missing
if ! grep -q 'from "./pages/Account.jsx"' "$APP_FILE"; then
  # Try macOS sed first, then GNU sed
  sed -i '' '1,/^$/ s#\(Settings from "./pages/Settings.jsx";\)#\1\
import Account from "./pages/Account.jsx";#' "$APP_FILE" 2>/dev/null || \
  sed -i '1,/^$/ s#\(Settings from "./pages/Settings.jsx";\)#\1\
import Account from "./pages/Account.jsx";#' "$APP_FILE"
fi

# Add nav link if missing
if ! grep -q 'to="/account"' "$APP_FILE"; then
  sed -i '' 's#</nav>#  <NavLink to="/account" style={navStyle}>Account</NavLink>\
        </nav>#' "$APP_FILE" 2>/dev/null || \
  sed -i 's#</nav>#  <NavLink to="/account" style={navStyle}>Account</NavLink>\
        </nav>#' "$APP_FILE"
fi

# Add route if missing
if ! grep -q 'path="/account"' "$APP_FILE"; then
  sed -i '' 's#</Routes>#  <Route path="/account" element={<Account />} />\
        </Routes>#' "$APP_FILE" 2>/dev/null || \
  sed -i 's#</Routes>#  <Route path="/account" element={<Account />} />\
        </Routes>#' "$APP_FILE"
fi

echo "Account page added. Start frontend and open /account."
