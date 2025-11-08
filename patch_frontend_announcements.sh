#!/bin/sh
set -eu

FRONTEND_DIR="frontend"
PAGES_DIR="$FRONTEND_DIR/src/pages"
COMP_DIR="$FRONTEND_DIR/src/components"

mkdir -p "$PAGES_DIR" "$COMP_DIR"

# 1) Create Announcements page
cat > "$PAGES_DIR/Announcements.jsx" <<'EOF'
import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";

function fromNow(ts) {
  // ts is ISO string
  const d = new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000; // seconds
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleString();
}

function Row({ a }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{a.title}</div>
        <div style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap' }}>{fromNow(a.created_iso)}</div>
      </div>
      <div style={{ marginTop: 6 }}>{a.content}</div>
    </div>
  );
}

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  // load initial
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/announcements", { params: { limit: 50 }});
        if (!alive) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // live updates (server emits arrays of fresh announcements)
  useEffect(() => {
    const onFresh = (freshArr) => {
      if (!Array.isArray(freshArr) || freshArr.length === 0) return;
      setItems(prev => {
        const map = new Map();
        [...freshArr, ...prev].forEach(a => { map.set(`${a.title}|${a.created_at}`, a); });
        // sort desc by created_at
        return Array.from(map.values()).sort((a,b) => Number(b.created_at) - Number(a.created_at)).slice(0, 200);
      });
    };
    socket.on("announcement", onFresh);
    return () => socket.off("announcement", onFresh);
  }, []);

  const body = useMemo(() => {
    if (loading) return <div>Loading…</div>;
    if (err) return <div style={{ color: 'crimson' }}>{err}</div>;
    if (!items.length) return <div>No announcements yet.</div>;
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map(a => <Row key={`${a.title}|${a.created_at}`} a={a} />)}
      </div>
    );
  }, [loading, err, items]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ fontWeight: 800, fontSize: 18 }}>Latest Announcements</div>
      {body}
    </div>
  );
}
EOF

# 2) Wire route + nav: modify App.jsx (idempotent replace/add)
APP_FILE="$FRONTEND_DIR/src/App.jsx"
if [ -f "$APP_FILE" ]; then
  # Ensure import exists
  if ! grep -q "Announcements from \"./pages/Announcements.jsx\"" "$APP_FILE" 2>/dev/null; then
    sed -i '' 's#Settings from "./pages/Settings.jsx";#Settings from "./pages/Settings.jsx";\
import Announcements from "./pages/Announcements.jsx";#' "$APP_FILE" 2>/dev/null || \
    sed -i 's#Settings from "./pages/Settings.jsx";#Settings from "./pages/Settings.jsx";\
import Announcements from "./pages/Announcements.jsx";#' "$APP_FILE"
  fi

  # Add NavLink if missing
  if ! grep -q 'to="/announcements"' "$APP_FILE"; then
    sed -i '' 's#</nav>#  <NavLink to="/announcements" style={navStyle}>Announcements</NavLink>\n        </nav>#' "$APP_FILE" 2>/dev/null || \
    sed -i 's#</nav>#  <NavLink to="/announcements" style={navStyle}>Announcements</NavLink>\n        </nav>#' "$APP_FILE"
  fi

  # Add Route if missing
  if ! grep -q '<Route path="/announcements"' "$APP_FILE"; then
    sed -i '' 's#</Routes>#  <Route path="/announcements" element={<Announcements />} />\n        </Routes>#' "$APP_FILE" 2>/dev/null || \
    sed -i 's#</Routes>#  <Route path="/announcements" element={<Announcements />} />\n        </Routes>#' "$APP_FILE"
  fi
else
  echo "Could not find $APP_FILE. Make sure your frontend scaffold exists." >&2
  exit 1
fi

echo "Frontend announcements page added and wired. Start frontend to see it."
