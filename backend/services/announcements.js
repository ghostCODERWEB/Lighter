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
