#!/bin/sh
set -eu

FRONTEND_DIR="frontend"
PAGES_DIR="$FRONTEND_DIR/src/pages"
APP_FILE="$FRONTEND_DIR/src/App.jsx"

mkdir -p "$PAGES_DIR"

cat > "$PAGES_DIR/Account.jsx" <<'EOF'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";

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
  const [address, setAddress] = useState("");
  const [accountId, setAccountId] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const [accountAll, setAccountAll] = useState(null);
  const [userStats, setUserStats] = useState(null);

  const wsRef = useRef(null);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
  }, []);
  useEffect(() => () => disconnect(), [disconnect]);

  const subscribe = useCallback((id) => {
    setConnecting(true);
    setError(null);
    setAccountAll(null);
    setUserStats(null);
    disconnect();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", channel: `account_all/${id}` }));
      ws.send(JSON.stringify({ type: "subscribe", channel: `user_stats/${id}` }));
      setConnecting(false);
    };
    ws.onerror = () => setError("WebSocket error");
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg?.channel?.startsWith("account_all:") || msg?.type === "update/account_all" || msg?.type === "update/account") {
          setAccountAll(msg);
        }
        if (msg?.channel?.startsWith("user_stats:") || msg?.type === "update/user_stats") {
          setUserStats(msg);
        }
      } catch {}
    };
  }, [disconnect]);

  const resolveAndSubscribe = async (e) => {
    e.preventDefault();
    const addr = (address || "").trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setError("Enter a valid 0x wallet address");
      return;
    }
    setResolving(true);
    setError(null);
    try {
      const { data } = await api.get(`/account/resolve/${addr}`);
      if (!data?.account_index && data?.account_index !== 0) {
        throw new Error("No account index found for this address");
      }
      setAccountId(String(data.account_index));
      subscribe(String(data.account_index));
    } catch (e2) {
      setError(e2?.response?.data?.error || e2?.message || "Resolve failed");
    } finally {
      setResolving(false);
    }
  };

  const stats = userStats?.stats ?? null;

  const positions = useMemo(() => {
    const map = accountAll?.positions || {};
    return Object.entries(map).map(([marketIndex, pos]) => ({ marketIndex, ...pos }));
  }, [accountAll]);

  const trades = useMemo(() => {
    const map = accountAll?.trades || {};
    const arr = [];
    Object.entries(map).forEach(([marketIndex, ts]) => {
      if (Array.isArray(ts)) ts.forEach(t => arr.push({ marketIndex, ...t }));
    });
    arr.sort((a,b) => Number(b.timestamp||0) - Number(a.timestamp||0));
    return arr.slice(0, 200);
  }, [accountAll]);

  const shares = Array.isArray(accountAll?.shares) ? accountAll.shares : [];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={resolveAndSubscribe} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Enter L1 wallet address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: 8, minWidth: 360 }}
        />
        <button type="submit" disabled={resolving || connecting} style={{ padding: "8px 12px" }}>
          {resolving ? "Resolving…" : connecting ? "Connecting…" : "Load Account"}
        </button>
        <button type="button" onClick={disconnect} style={{ padding: "8px 12px" }}>
          Disconnect
        </button>
      </form>

      {accountId && (
        <div style={{ color: "#666" }}>
          Account index: <b>{accountId}</b> — Subscribed to <code>account_all/{accountId}</code> and <code>user_stats/{accountId}</code>
        </div>
      )}
      {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

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

# wire into App.jsx
if [ ! -f "$APP_FILE" ]; then
  echo "Cannot find $APP_FILE" >&2
  exit 1
fi

# import
if ! grep -q 'from "./pages/Account.jsx"' "$APP_FILE"; then
  sed -i '' 's#Settings from "./pages/Settings.jsx";#Settings from "./pages/Settings.jsx";\
import Account from "./pages/Account.jsx";#' "$APP_FILE" 2>/dev/null || \
  sed -i 's#Settings from "./pages/Settings.jsx";#Settings from "./pages/Settings.jsx";\
import Account from "./pages/Account.jsx";#' "$APP_FILE"
fi

# nav
if ! grep -q 'to="/account"' "$APP_FILE"; then
  sed -i '' 's#</nav>#  <NavLink to="/account" style={navStyle}>Account</NavLink>\
        </nav>#' "$APP_FILE" 2>/dev/null || \
  sed -i 's#</nav>#  <NavLink to="/account" style={navStyle}>Account</NavLink>\
        </nav>#' "$APP_FILE"
fi

# route
if ! grep -q 'path="/account"' "$APP_FILE"; then
  sed -i '' 's#</Routes>#  <Route path="/account" element={<Account />} />\
        </Routes>#' "$APP_FILE" 2>/dev/null || \
  sed -i 's#</Routes>#  <Route path="/account" element={<Account />} />\
        </Routes>#' "$APP_FILE"
fi

echo "✔ Frontend: Account page accepts address and resolves to account index."
