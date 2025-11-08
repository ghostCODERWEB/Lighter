import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";
import { BellRing, RefreshCw, Wifi, AlertCircle, Clock, ChevronDown, ChevronUp, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

// --- utils
function fromNow(ts) {
  const d = new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000; // seconds
  if (!isFinite(diff)) return "—";
  if (diff < 60) return `${Math.max(0, Math.floor(diff))}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleString();
}

function cn(...cls) {
  return cls.filter(Boolean).join(" ");
}

// --- row
function Row({ a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition hover:shadow-md overflow-hidden">
      {/* Stack on mobile, split on >=sm */}
      <div className="flex w-full flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
        {/* Title + content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/80" />
            <div className="font-semibold text-gray-900 dark:text-gray-100 break-words">
              {a.title}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 break-words">
            <div className={cn("whitespace-pre-wrap", !open && "line-clamp-3")}>{a.content}</div>
            {a.content?.length > 140 && (
              <button
                onClick={() => setOpen((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {open ? (<><ChevronUp className="h-3.5 w-3.5" /> Show less</>) : (<><ChevronDown className="h-3.5 w-3.5" /> Show more</>)}
              </button>
            )}
          </div>
        </div>
        {/* Time (moves below on mobile) */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 sm:self-start self-end">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{fromNow(a.created_iso)}</span>
        </div>
      </div>
    </div>
  );
}

// --- pagination helpers (1 … prev, current, next … N)
function buildPageRange(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const within = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < within.length; i++) {
    out.push(within[i]);
    if (i < within.length - 1 && within[i + 1] - within[i] > 1) {
      out.push("…");
    }
  }
  return out;
}

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [livePulse, setLivePulse] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pulseTimeout = useRef(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageRange = buildPageRange(page, totalPages);
  const visible = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page]);

  const fetchInitial = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get("/announcements", { params: { limit: 50 } });
      setItems(Array.isArray(data.items) ? data.items : []);
      setPage(1);
    } catch (e) {
      setErr(e?.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  // load initial
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/announcements", { params: { limit: 50 } });
        if (!alive) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setPage(1);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load announcements");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
    };
  }, []);

  // live updates (server emits arrays of fresh announcements)
  useEffect(() => {
    const onFresh = (freshArr) => {
      if (!Array.isArray(freshArr) || freshArr.length === 0) return;
      setItems((prev) => {
        const map = new Map();
        [...freshArr, ...prev].forEach((a) => {
          map.set(`${a.title}|${a.created_at}`, a);
        });
        return Array.from(map.values())
          .sort((a, b) => Number(b.created_at) - Number(a.created_at))
          .slice(0, 200);
      });
      setLivePulse(true);
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      pulseTimeout.current = setTimeout(() => setLivePulse(false), 1200);
    };
    socket.on("announcement", onFresh);
    return () => socket.off("announcement", onFresh);
  }, []);

  const body = useMemo(() => {
    if (loading) {
      // Full-height loading shell with shimmering rows
      return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 min-h-[60vh]">
          <div className="h-4 w-40 sm:w-56 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 overflow-hidden">
                <div className="h-4 w-3/5 sm:w-2/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-3 w-9/12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (err) {
      return (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-700 bg-rose-50/60 dark:bg-rose-900/20 p-4 text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div className="flex-1 text-sm">
            <div className="font-semibold">{err}</div>
            <button onClick={fetchInitial} className="mt-2 inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-700">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        </div>
      );
    }
    if (!items.length) {
      return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-sm text-gray-600 dark:text-gray-300 min-h-[40vh] flex items-center justify-center">
          No announcements yet.
        </div>
      );
    }
    return (
      <div className="grid gap-3">
        {visible.map((a) => (
          <Row key={`${a.title}|${a.created_at}`} a={a} />
        ))}
      </div>
    );
  }, [loading, err, items, visible]);

  return (
    <section className="w-full overflow-x-hidden max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 text-gray-900 dark:text-gray-100">
      {/* Toolbar (no <h> tags) */}
      <div className="mb-4 flex items-center justify-between gap-2 sm:gap-3">
        <div className="inline-flex items-center gap-2 min-w-0">
          <BellRing className="h-5 w-5 shrink-0" />
          <div className="text-base sm:text-lg font-semibold truncate">Latest Announcements</div>
          <span className={cn(
            "ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs shrink-0",
            livePulse ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
          )}>
            <Wifi className={cn("h-3.5 w-3.5", livePulse && "animate-pulse")} /> live
          </span>
        </div>
        <button onClick={fetchInitial} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {body}

      {/* Pagination */}
      {!loading && !err && items.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, items.length)} of {items.length}
          </div>
          {/* On tiny screens, allow horizontal scroll for the controls */}
          <div className="inline-flex items-center gap-1 overflow-x-auto max-w-full">
            <IconButton ariaLabel="First" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </IconButton>
            <IconButton ariaLabel="Prev" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </IconButton>

            {pageRange.map((p, i) => (
              typeof p === "number" ? (
                <button
                  key={i}
                  onClick={() => setPage(p)}
                  className={cn(
                    "h-8 min-w-8 px-2 rounded-lg border text-sm",
                    p === page
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  )}
                >
                  {p}
                </button>
              ) : (
                <span key={i} className="px-2 text-gray-400">…</span>
              )
            ))}

            <IconButton ariaLabel="Next" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </IconButton>
            <IconButton ariaLabel="Last" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      )}
    </section>
  );
}

function IconButton({ children, onClick, disabled, ariaLabel }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border",
        disabled
          ? "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
      )}
    >
      {children}
    </button>
  );
}