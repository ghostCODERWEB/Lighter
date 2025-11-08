#!/bin/sh
set -eu

APP_ROOT="onchain-multipage-app"
BACKEND_DIR="$APP_ROOT/backend"

mkdir -p "$BACKEND_DIR"/{routes,services,util}

# backend/package.json
cat > "$BACKEND_DIR/package.json" <<'EOF'
{
  "name": "onchain-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "@api/zklighter": "^1.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "morgan": "^1.10.0",
    "socket.io": "^4.7.5"
  }
}
EOF

# backend/.env.example
cat > "$BACKEND_DIR/.env.example" <<'EOF'
PORT=4000
CORS_ORIGIN=http://localhost:5173
# If the zklighter SDK needs a key, add it here (and in your shell):
# ZKLIGHTER_API_KEY=your_key
ANNOUNCEMENTS_POLL_MS=30000
EOF

# backend/util/logger.js
cat > "$BACKEND_DIR/util/logger.js" <<'EOF'
export const log = (...args) => console.log(new Date().toISOString(), "-", ...args);
export const err = (...args) => console.error(new Date().toISOString(), "-", ...args);
EOF

# backend/services/announcements.js
cat > "$BACKEND_DIR/services/announcements.js" <<'EOF'
import dotenv from "dotenv";
import zklighter from "@api/zklighter";
import { err, log } from "../util/logger.js";

dotenv.config();

/**
 * Fetch announcements via zklighter SDK and normalize shape:
 * { code, announcements: [{ title, content, created_at }] }
 */
export async function fetchAnnouncementsRaw() {
  try {
    const resp = await zklighter.announcement();
    // Some SDKs nest response under data, others return object directly
    const payload = resp?.data ?? resp;
    return payload;
  } catch (e) {
    err("fetchAnnouncementsRaw error", e);
    throw e;
  }
}

function toISO(sec) {
  // If SDK returns seconds, convert to ms. If already ms, detect and keep.
  const n = Number(sec);
  const ms = n > 1e12 ? n : n * 1000;
  return new Date(ms).toISOString();
}

export async function fetchAnnouncements({ limit } = {}) {
  const raw = await fetchAnnouncementsRaw();
  const items = Array.isArray(raw?.announcements) ? raw.announcements : [];

  const normalized = items
    .map(a => ({
      title: a.title ?? "",
      content: a.content ?? "",
      created_at: a.created_at,
      created_iso: toISO(a.created_at)
    }))
    .sort((a, b) => Number(b.created_at) - Number(a.created_at));

  return typeof limit === "number" ? normalized.slice(0, limit) : normalized;
}

/**
 * Simple in-memory tracker to detect newly-seen announcements.
 */
export class AnnouncementFeed {
  constructor() {
    this.seen = new Set();
  }
  key(a) {
    return `${a.title}|${a.created_at}`;
  }
  diff(newItems) {
    const fresh = [];
    for (const a of newItems) {
      const k = this.key(a);
      if (!this.seen.has(k)) {
        this.seen.add(k);
        fresh.push(a);
      }
    }
    return fresh;
  }
}
EOF

# backend/routes/announcements.js
cat > "$BACKEND_DIR/routes/announcements.js" <<'EOF'
import { Router } from "express";
import { fetchAnnouncements } from "../services/announcements.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const data = await fetchAnnouncements({ limit });
    res.json({ items: data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "announcements error" });
  }
});

export default router;
EOF

# backend/ws.js
cat > "$BACKEND_DIR/ws.js" <<'EOF'
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import { fetchAnnouncements, AnnouncementFeed } from "./services/announcements.js";
import { log, err } from "./util/logger.js";

dotenv.config();

export function attachWebsocket(httpServer, corsOrigin) {
  const io = new IOServer(httpServer, {
    cors: { origin: corsOrigin, methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    log("socket connected", socket.id);
  });

  const feed = new AnnouncementFeed();
  const pollMs = Number(process.env.ANNOUNCEMENTS_POLL_MS || 30000);

  async function poll() {
    try {
      const items = await fetchAnnouncements();
      const fresh = feed.diff(items);
      if (fresh.length > 0) {
        io.emit("announcement", fresh);
      }
    } catch (e) {
      err("announcement poll error", e);
    } finally {
      setTimeout(poll, pollMs);
    }
  }

  // kick off polling
  poll();

  return io;
}
EOF

# backend/index.js
cat > "$BACKEND_DIR/index.js" <<'EOF'
import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import announcementsRouter from "./routes/announcements.js";
import { attachWebsocket } from "./ws.js";
import { log } from "./util/logger.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/announcements", announcementsRouter);

const server = http.createServer(app);
attachWebsocket(server, process.env.CORS_ORIGIN || "*");

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => log("backend listening on port", PORT));
EOF

echo "Scaffolded backend announcements service in $BACKEND_DIR"
echo "Next steps:"
echo "  1) cp $BACKEND_DIR/.env.example $BACKEND_DIR/.env"
echo "  2) npm install in $BACKEND_DIR"
echo "  3) npm run dev in $BACKEND_DIR"
