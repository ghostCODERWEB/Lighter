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
