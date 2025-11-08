// src/pages/AccountCheck.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api.js";

// icons
import {
    Search,
    PlugZap,
    Loader2,
    Activity,
    BarChart3,
    TrendingUp,
    Layers,
    Wallet,
    Shield,
    ArrowLeftRight,
    CircleHelp,
    CircleDot,
    Link as LinkIcon,
    Trash2,
} from "lucide-react";

// charts
import {
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

// shared utils (barrel)
import {
    toNum,
    fmtOrDash,
    pct,
    sym,
    CompactNum,
    resolveAddressOrEns,
    mergeAccountAll,
} from "../utils/index.js";

// trading helpers
import {
    isOpenPosition,
    getSide,
    sidePillCls,
    marginCell,
    pnlPill,
    tradeRow,
} from "../utils/trading.js";

const WS_URL = "wss://mainnet.zklighter.elliot.ai/stream";
const STORAGE_KEY = "accountCheck.address";

export default function AccountCheck() {
    const [address, setAddress] = useState("");
    const [savedAddress, setSavedAddress] = useState("");
    const [accountId, setAccountId] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [lastMsgType, setLastMsgType] = useState(null);
    const [accountAll, setAccountAll] = useState(null);
    const [userStats, setUserStats] = useState(null);

    // history for charts (we record snapshots as they arrive)
    const [statHistory, setStatHistory] = useState([]); // [{t, pv, col, bp, mu}]
    const MAX_POINTS = 240;

    // WS refs/state
    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const heartbeatRef = useRef(null);
    const latestAccountIdRef = useRef(null);

    // reconnect controls (disabled for one-time load)
    const shouldReconnectRef = useRef(false);
    const backoffRef = useRef(1000);
    const maxBackoff = 30000;
    const sendQueueRef = useRef([]);

    const wsReady = () => wsRef.current && wsRef.current.readyState === WebSocket.OPEN;

    const cleanupTimers = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
            heartbeatRef.current = null;
        }
    };

    const disconnect = useCallback(() => {
        shouldReconnectRef.current = false;
        try {
            wsRef.current?.close();
        } catch { }
        wsRef.current = null;
        cleanupTimers();
        setStatus("idle");
    }, []);

    useEffect(() => () => disconnect(), [disconnect]);

    // backoff with jitter
    const nextDelay = () => {
        const base = backoffRef.current;
        const jitter = Math.floor(Math.random() * 1000);
        const d = Math.min(base + jitter, maxBackoff);
        backoffRef.current = Math.min(base * 2, maxBackoff);
        return d;
    };

    // safe send with queue
    const safeSend = (obj) => {
        const frame = JSON.stringify(obj);
        if (wsReady()) {
            try {
                wsRef.current.send(frame);
            } catch {
                sendQueueRef.current.push(frame);
            }
        } else {
            sendQueueRef.current.push(frame);
        }
    };

    const flushQueue = () => {
        if (!wsReady()) return;
        for (const frame of sendQueueRef.current.splice(0)) {
            try {
                wsRef.current.send(frame);
            } catch { }
        }
    };

    // heartbeat
    const startHeartbeat = useCallback(() => {
        if (heartbeatRef.current) return;
        heartbeatRef.current = setInterval(() => {
            if (wsReady()) safeSend({ type: "ping" });
        }, 15000);
    }, []);

    // ask server for a fresh snapshot (ONE TIME)
    const requestSnapshotsOnce = useCallback((id) => {
        if (!id) return;
        safeSend({ type: "snapshot", channel: `account_all/${id}` });
        safeSend({ type: "snapshot", channel: `user_stats/${id}` });
    }, []);

    // single HTTP fallback (ONE TIME)
    const httpFetchOnce = useCallback(async (id) => {
        try {
            const [aAllRes, uStatsRes] = await Promise.allSettled([
                api.get(`/account/snapshot/${id}`),
                api.get(`/account/stats/${id}`),
            ]);
            if (aAllRes.status === "fulfilled" && aAllRes.value?.data) {
                setAccountAll((prev) => mergeAccountAll(prev, aAllRes.value.data));
            }
            if (uStatsRes.status === "fulfilled" && uStatsRes.value?.data) {
                setUserStats((prev) => ({ ...(prev || {}), ...(uStatsRes.value.data || {}) }));
            }
        } catch { }
    }, []);

    // open WS and subscribe; one-time snapshot, no polling
    const connectWs = useCallback(
        (id) => {
            try {
                wsRef.current?.close();
            } catch { }
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                setStatus("connected");
                flushQueue();

                safeSend({ type: "subscribe", channel: `account_all/${id}` });
                safeSend({ type: "subscribe", channel: `user_stats/${id}` });

                requestSnapshotsOnce(id);
                startHeartbeat();
            };

            ws.onerror = () => {
                // handled in onclose
            };

            ws.onclose = () => {
                if (shouldReconnectRef.current) {
                    setStatus(navigator.onLine ? "connected" : "offline");
                    const delay = nextDelay();
                    reconnectTimerRef.current = setTimeout(() => connectWs(id), delay);
                } else {
                    setStatus("idle");
                }
            };

            ws.onmessage = (ev) => {
                try {
                    const msg = JSON.parse(ev.data);
                    setLastMsgType(msg?.type || msg?.channel || "message");
                    const type = String(msg?.type ?? "");
                    const channel = String(msg?.channel ?? "");
                    const payload = msg?.data ?? msg?.payload ?? msg;

                    const isAcct =
                        channel.startsWith("account_all:") ||
                        channel.startsWith("account_all/") ||
                        type.includes("account_all") ||
                        type === "account" ||
                        type === "update/account" ||
                        type === "snapshot/account_all";

                    const isStats =
                        channel.startsWith("user_stats:") ||
                        channel.startsWith("user_stats/") ||
                        type.includes("user_stats") ||
                        type === "update/user_stats" ||
                        type === "snapshot/user_stats";

                    if (isAcct) setAccountAll((prev) => mergeAccountAll(prev, payload));
                    if (isStats) setUserStats((prev) => ({ ...(prev || {}), ...(payload || {}) }));
                } catch { }
            };
        },
        [requestSnapshotsOnce, startHeartbeat]
    );

    const subscribe = useCallback(
        async (id) => {
            setError(null);
            setAccountAll(null);
            setUserStats(null);
            setLastMsgType(null);
            setStatHistory([]); // reset history when switching account

            latestAccountIdRef.current = id;
            shouldReconnectRef.current = false;

            connectWs(id);
            await httpFetchOnce(id);
        },
        [connectWs, httpFetchOnce]
    );

    const resolveAndSubscribeFromValue = useCallback(
        async (value) => {
            const input = (value || "").trim();
            setStatus("resolving");
            setError(null);
            setAccountAll(null);
            setUserStats(null);
            setStatHistory([]);
            try {
                const addr = await resolveAddressOrEns(input);
                try {
                    localStorage.setItem(STORAGE_KEY, addr);
                    setSavedAddress(addr);
                } catch { }
                const { data } = await api.get(`/account/resolve/${addr}`);
                const idx = data?.account_index;
                if (idx === undefined || idx === null)
                    throw new Error("No account index found for this address");
                const id = String(idx);
                setAccountId(id);
                await subscribe(id);
                setStatus("synced");
            } catch (e2) {
                setError(e2?.response?.data?.error || e2?.message || "Resolve failed");
                setStatus("error");
            }
        },
        [subscribe]
    );

    const resolveAndSubscribe = async (e) => {
        e.preventDefault();
        await resolveAndSubscribeFromValue(address);
    };

    // Load once on mount (if saved)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) || "";
            if (saved) {
                setSavedAddress(saved);
                setAddress(saved);
                setTimeout(() => resolveAndSubscribeFromValue(saved), 0);
            }
        } catch { }
    }, [resolveAndSubscribeFromValue]);

    // network listeners (only to show offline status; no auto polling)
    useEffect(() => {
        const handleOnline = () => setStatus("connected");
        const handleOffline = () => setStatus("offline");
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // clear saved address
    const handleClearSaved = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch { }
        setSavedAddress("");
        setAddress("");
        setAccountId(null);
        setAccountAll(null);
        setUserStats(null);
        setError(null);
        setStatHistory([]);
        disconnect();
    };

    /* ===== Derived data & chart series ===== */
    const stats = userStats?.stats ?? {};

    // record history when stats change (ignore zeros)
    useEffect(() => {
        const pv = toNum(stats?.portfolio_value);
        const col = toNum(stats?.collateral);
        const bp = toNum(stats?.buying_power);
        const mu = toNum(stats?.margin_usage);
        const hasAny =
            (Number.isFinite(pv) && pv !== 0) ||
            (Number.isFinite(col) && col !== 0) ||
            (Number.isFinite(bp) && bp !== 0) ||
            (Number.isFinite(mu) && mu !== 0);
        if (!hasAny) return;

        setStatHistory((prev) => {
            const next = [
                ...prev,
                {
                    t: Date.now(),
                    pv: Number.isFinite(pv) ? pv : null,
                    col: Number.isFinite(col) ? col : null,
                    bp: Number.isFinite(bp) ? bp : null,
                    mu: Number.isFinite(mu) ? mu * 100 : null, // percent
                },
            ].slice(-MAX_POINTS);
            return next;
        });
    }, [stats?.portfolio_value, stats?.collateral, stats?.buying_power, stats?.margin_usage]); // eslint-disable-line

    const positionsMap = accountAll?.positions || {};
    const allPositions = useMemo(() => {
        const arr = Object.entries(positionsMap).map(([marketIndex, pos]) => ({
            marketIndex,
            ...pos,
        }));
        return arr.sort((a, b) => {
            const ao = isOpenPosition(a) ? 1 : 0;
            const bo = isOpenPosition(b) ? 1 : 0;
            if (ao !== bo) return bo - ao;
            const ap = Math.abs(toNum(a.unrealized_pnl) || 0);
            const bp = Math.abs(toNum(b.unrealized_pnl) || 0);
            return bp - ap;
        });
    }, [positionsMap]);

    const openPositions = useMemo(() => allPositions.filter(isOpenPosition), [allPositions]);

    const exposure = useMemo(() => {
        const items = openPositions.map((p) => ({
            symbol: sym(p.symbol, p.marketIndex),
            side: getSide(p),
            value: Math.abs(toNum(p.position_value)) || 0,
            rawValue: toNum(p.position_value),
        }));
        const totalAbs = items.reduce((s, i) => s + i.value, 0);
        const longAbs = items
            .filter((i) => (toNum(i?.rawValue) || 0) > 0)
            .reduce((s, i) => s + Math.abs(i.rawValue || 0), 0);
        const shortAbs = items
            .filter((i) => (toNum(i?.rawValue) || 0) < 0)
            .reduce((s, i) => s + Math.abs(i.rawValue || 0), 0);
        const bySym = new Map();
        items.forEach((i) => {
            bySym.set(i.symbol, (bySym.get(i.symbol) || 0) + i.value);
        });
        const allocation = Array.from(bySym.entries())
            .map(([k, v]) => ({ symbol: k, value: v, pct: totalAbs > 0 ? v / totalAbs : 0 }))
            .filter((x) => x.value > 0)
            .sort((a, b) => b.value - a.value);

        return { totalAbs, longAbs, shortAbs, allocation };
    }, [openPositions]);

    const trades = useMemo(() => {
        const map = accountAll?.trades || {};
        const arr = [];
        Object.entries(map).forEach(([marketIndex, ts]) => {
            if (Array.isArray(ts)) {
                ts.forEach((t) => {
                    const size = toNum(t.size);
                    const price = toNum(t.price);
                    const usd = Number.isFinite(toNum(t.usd_amount))
                        ? toNum(t.usd_amount)
                        : Number.isFinite(toNum(t.usdAmount))
                            ? toNum(t.usdAmount)
                            : Number.isFinite(size) && Number.isFinite(price)
                                ? size * price
                                : NaN;
                    arr.push({ marketIndex, ...t, usd_amount: usd });
                });
            }
        });
        arr.sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
        return arr.slice(0, 500);
    }, [accountAll]);

    // trades volume by 5-min bucket (line/area)
    const volumeSeries = useMemo(() => {
        const byBucket = new Map();
        for (const t of trades) {
            const ts = Number(t.timestamp || 0) * 1000;
            if (!Number.isFinite(ts) || !t.usd_amount) continue;
            const bucket = Math.floor(ts / (5 * 60 * 1000)) * 5 * 60 * 1000;
            byBucket.set(bucket, (byBucket.get(bucket) || 0) + Math.abs(toNum(t.usd_amount) || 0));
        }
        const rows = Array.from(byBucket.entries())
            .map(([ts, v]) => ({ t: ts, v }))
            .filter((r) => r.v > 0)
            .sort((a, b) => a.t - b.t);
        return rows.slice(-200);
    }, [trades]);

    // funding history bars (sum absolute change by day)
    const fundingSeries = useMemo(() => {
        const fh = accountAll?.funding_histories || {};
        const agg = new Map();
        for (const list of Object.values(fh)) {
            (list || []).forEach((e) => {
                const ts = Number(e.timestamp || 0) * 1000;
                if (!Number.isFinite(ts)) return;
                const day = new Date(ts);
                day.setHours(0, 0, 0, 0);
                const key = day.getTime();
                const change = Math.abs(toNum(e.change) || 0);
                if (change > 0) agg.set(key, (agg.get(key) || 0) + change);
            });
        }
        return Array.from(agg.entries())
            .map(([t, v]) => ({ t, v }))
            .filter((r) => r.v > 0)
            .sort((a, b) => a.t - b.t)
            .slice(-60);
    }, [accountAll?.funding_histories]);

    const pools = Array.isArray(accountAll?.shares) ? accountAll.shares : [];
    const counts = {
        daily_trades_count: accountAll?.daily_trades_count,
        daily_volume: accountAll?.daily_volume,
        weekly_trades_count: accountAll?.weekly_trades_count,
        weekly_volume: accountAll?.weekly_volume,
        total_trades_count: accountAll?.total_trades_count,
        total_volume: accountAll?.total_volume,
    };

    const Chip = ({ icon: Icon, value, title }) => (
        <span
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-2 py-1 text-xs"
            title={title}
        >
            <Icon className="h-3.5 w-3.5" />
            <span className="font-mono break-all">{value}</span>
        </span>
    );

    const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#22d3ee"];

    /* =========================
       UI
       ========================= */

    return (
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 text-gray-900 dark:text-gray-100">
            {/* Toolbar / Search */}
            <div className="mb-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm">
                <form onSubmit={resolveAndSubscribe} className="flex w-full flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 sm:px-3">
                        <Search className="h-4 w-4 shrink-0" />
                        <input
                            className={`h-11 flex-1 bg-transparent text-sm outline-none min-w-0 ${error ? "text-rose-400" : ""}`}
                            placeholder="Paste address or ENS (vitalik.eth)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="h-11 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 sm:px-5 text-sm font-semibold text-white disabled:opacity-60"
                            type="submit"
                            disabled={status === "resolving"}
                            title="Resolve & load (one-time)"
                        >
                            {status === "resolving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
                            <span>Check</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleClearSaved}
                            disabled={!savedAddress}
                            className="h-11 inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 sm:px-4 text-sm font-semibold disabled:opacity-50"
                            title="Clear saved address"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Clear</span>
                        </button>
                    </div>
                </form>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Chip icon={Activity} value={status} title="Status" />
                    {accountId && <Chip icon={CircleDot} value={accountId} title="Account index" />}
                    {savedAddress && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-2 py-1 text-xs" title="Saved to this browser">
                            <LinkIcon className="h-3.5 w-3.5" />
                            <span className="font-mono break-all">{savedAddress}</span>
                        </span>
                    )}
                    {error && (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm">
                            <CircleHelp className="h-3.5 w-3.5" /> {error}
                        </span>
                    )}
                </div>
            </div>

            {/* Top KPIs */}
            <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        <Wallet className="h-3.5 w-3.5" />
                        <span className="sr-only">Total Account Value</span>
                    </div>
                    <div className="mt-1 text-2xl font-extrabold font-mono break-all"><CompactNum value={stats?.portfolio_value} /></div>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        <Shield className="h-3.5 w-3.5" />
                        <span className="sr-only">Collateral Value</span>
                    </div>
                    <div className="mt-1 text-2xl font-extrabold font-mono break-all"><CompactNum value={stats?.collateral} /></div>
                </div>
            </div>

            {/* CHARTS row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                {/* LEFT column */}
                <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                    {/* Pools (table) */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-base font-semibold">
                                <Layers className="h-4 w-4" />
                                <span className="sr-only">Public Pools</span>
                                <span className="text-xs text-gray-500">({(Array.isArray(accountAll?.shares) ? accountAll.shares : []).length})</span>
                            </div>
                        </div>
                        <div className="mt-3 overflow-x-auto -mx-3 sm:mx-0">
                            <div className="min-w-[560px] sm:min-w-0">
                                <table className="w-full text-[13px] sm:text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="text-left px-3 py-2">Pool Index</th>
                                            <th className="text-right px-3 py-2">Shares</th>
                                            <th className="text-right px-3 py-2">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {(Array.isArray(accountAll?.shares) ? accountAll.shares : []).length === 0 ? (
                                            <tr><td className="px-3 py-3 text-center text-gray-500" colSpan={3}>—</td></tr>
                                        ) : (
                                            accountAll.shares.map((s, i) => (
                                                <tr key={i}>
                                                    <td className="px-3 py-2">{s.public_pool_index ?? "—"}</td>
                                                    <td className="px-3 py-2 text-right"><CompactNum value={s.shares_amount} /></td>
                                                    <td className="px-3 py-2 text-right"><CompactNum value={s.entry_usdc} /></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio value & Collateral over time (line chart) */}
                    {statHistory.length > 1 && (statHistory.some(d => d.pv) || statHistory.some(d => d.col)) && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-base font-semibold mb-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>Equity Over Time</span>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={statHistory.map(d => ({ ...d, ts: new Date(d.t).toLocaleTimeString() }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ts" minTickGap={32} />
                                        <YAxis hide />
                                        <Tooltip />
                                        {statHistory.some(d => d.pv && d.pv !== 0) && <Line type="monotone" dataKey="pv" name="Portfolio" dot={false} stroke="#60a5fa" />}
                                        {statHistory.some(d => d.col && d.col !== 0) && <Line type="monotone" dataKey="col" name="Collateral" dot={false} stroke="#34d399" />}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Trade volume (area) */}
                    {volumeSeries.length > 1 && volumeSeries.reduce((s, r) => s + r.v, 0) > 0 && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-base font-semibold mb-2">
                                <BarChart3 className="h-4 w-4" />
                                <span>Trade Volume (5m)</span>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={volumeSeries.map(r => ({ ...r, ts: new Date(r.t).toLocaleTimeString() }))}>
                                        <defs>
                                            <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ts" minTickGap={32} />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="v" name="USD" stroke="#60a5fa" fill="url(#vol)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Open Positions table (primary info only) */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4">
                            <div className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                                <ArrowLeftRight className="h-4 w-4" />
                                <span className="text-xs text-gray-500">({openPositions.length || 0})</span>
                                <span className="sr-only">Open Positions</span>
                            </div>
                        </div>

                        {/* Desktop */}
                        <div className="mt-3 -mx-3 sm:mx-0 px-3 sm:px-4 pb-3 sm:pb-4 overflow-x-auto hidden md:block">
                            <table className="min-w-full text-[13px] sm:text-sm">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="px-2 py-2 text-left">Pair</th>
                                        <th className="px-2 py-2 text-left">Type</th>
                                        <th className="px-2 py-2 text-right">Size</th>
                                        <th className="px-2 py-2 text-right">Value</th>
                                        <th className="px-2 py-2 text-left">P&L</th>
                                        <th className="px-2 py-2 text-left">Margin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {openPositions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-3 text-center text-gray-500">—</td>
                                        </tr>
                                    ) : (
                                        openPositions.map((p, i) => {
                                            const side = getSide(p);
                                            const m = marginCell(p);
                                            const absPV = Math.abs(toNum(p.position_value));
                                            const pnlAbs = toNum(p.unrealized_pnl);
                                            const pnlPct = Number.isFinite(absPV) && absPV > 0 && Number.isFinite(pnlAbs)
                                                ? ((pnlAbs / absPV) * 100).toFixed(2) + "%"
                                                : "—";
                                            return (
                                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-2 py-2 break-words">{sym(p.symbol, p.marketIndex)}</td>
                                                    <td className="px-2 py-2"><span className={sidePillCls(side)}>{side}</span></td>
                                                    <td className="px-2 py-2 text-right"><CompactNum value={Math.abs(toNum(p.position))} /></td>
                                                    <td className="px-2 py-2 text-right"><CompactNum value={p.position_value} /></td>
                                                    <td className="px-2 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${pnlPill(p.unrealized_pnl)}`}>{fmtOrDash(p.unrealized_pnl)}</span>
                                                            <span className="text-xs text-gray-500">{pnlPct}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <div className="inline-flex items-center gap-2">
                                                            <span>{m.label}</span>
                                                            <span className={`px-1.5 py-0.5 text-[10px] rounded ${m.badgeCls}`}>{m.badge}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 md:hidden space-y-3">
                            {openPositions.length === 0 ? (
                                <div className="text-center text-gray-500">—</div>
                            ) : (
                                openPositions.map((p, i) => {
                                    const side = getSide(p);
                                    const m = marginCell(p);
                                    const absPV = Math.abs(toNum(p.position_value));
                                    const pnlAbs = toNum(p.unrealized_pnl);
                                    const pnlPct = Number.isFinite(absPV) && absPV > 0 && Number.isFinite(pnlAbs)
                                        ? ((pnlAbs / absPV) * 100).toFixed(2) + "%"
                                        : "—";
                                    return (
                                        <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="font-semibold break-words">{sym(p.symbol, p.marketIndex)}</div>
                                                <span className={sidePillCls(side)}>{side}</span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
                                                <div className="text-gray-500">Size</div>
                                                <div className="text-right"><CompactNum value={Math.abs(toNum(p.position))} /></div>
                                                <div className="text-gray-500">Value</div>
                                                <div className="text-right"><CompactNum value={p.position_value} /></div>
                                                <div className="text-gray-500">P&L</div>
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${pnlPill(p.unrealized_pnl)}`}>{fmtOrDash(p.unrealized_pnl)}</span>
                                                    <span className="text-xs text-gray-500">{pnlPct}</span>
                                                </div>
                                                <div className="text-gray-500">Margin</div>
                                                <div className="inline-flex items-center justify-end gap-2">
                                                    <span>{m.label}</span>
                                                    <span className={`px-1.5 py-0.5 text-[10px] rounded ${m.badgeCls}`}>{m.badge}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Recent Trades (compact) */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 px-3 sm:px-4 pt-3 sm:pt-4">
                            <BarChart3 className="h-4 w-4" />
                            <span className="text-xs text-gray-500">Latest {trades.length || 0}</span>
                            <span className="sr-only">Recent Trades</span>
                        </div>
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 overflow-x-auto -mx-3 sm:mx-0">
                            <div className="min-w-[720px] sm:min-w-0">
                                <table className="w-full text-[13px] sm:text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="text-left px-2 py-2">Pair</th>
                                            <th className="text-left px-2 py-2">Type</th>
                                            <th className="text-right px-2 py-2">Size</th>
                                            <th className="text-right px-2 py-2">Price</th>
                                            <th className="text-right px-2 py-2">USD</th>
                                            <th className="text-left px-2 py-2">Block</th>
                                            <th className="text-left px-2 py-2">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {trades.length === 0 ? (
                                            <tr><td colSpan={7} className="py-3 text-center text-gray-500">—</td></tr>
                                        ) : (
                                            trades.map((t, i) => (
                                                <tr key={i} className={`${tradeRow(t.type)} hover:opacity-90`}>
                                                    <td className="px-2 py-2">{sym(t.symbol, t.marketIndex)}</td>
                                                    <td className="px-2 py-2">{t.type ?? "—"}</td>
                                                    <td className="px-2 py-2 text-right"><CompactNum value={t.size} /></td>
                                                    <td className="px-2 py-2 text-right"><CompactNum value={t.price} /></td>
                                                    <td className="px-2 py-2 text-right"><CompactNum value={t.usd_amount} /></td>
                                                    <td className="px-2 py-2">{t.block_height ?? "—"}</td>
                                                    <td className="px-2 py-2">{t.timestamp ? new Date(t.timestamp * 1000).toLocaleString() : "—"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT column */}
                <aside className="lg:col-span-4 space-y-3 sm:space-y-4 lg:sticky lg:top-4 self-start">
                    {/* Exposure pie */}
                    {exposure.totalAbs > 0 && exposure.allocation.length > 0 && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="h-4 w-4" />
                                <span className="sr-only">Portfolio Analysis</span>
                                <span className="text-sm text-gray-500">Exposure</span>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={exposure.allocation.map((a) => ({ name: a.symbol, value: a.value }))}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                        >
                                            {exposure.allocation.map((_, idx) => (
                                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Assets</div>
                                    <div className="font-mono font-bold">{exposure.allocation.length}</div>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Positions</div>
                                    <div className="font-mono font-bold">{openPositions.length}</div>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Value</div>
                                    <div className="font-mono font-bold"><CompactNum value={exposure.totalAbs} /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Margin usage (line) */}
                    {statHistory.length > 1 && statHistory.some(d => d.mu && d.mu !== 0) && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm text-gray-500">Margin Usage %</span>
                            </div>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={statHistory.map(d => ({ ...d, ts: new Date(d.t).toLocaleTimeString() }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ts" minTickGap={32} />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="mu" name="%" dot={false} stroke="#fbbf24" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Funding (bars) */}
                    {fundingSeries.length > 0 && fundingSeries.reduce((s, r) => s + r.v, 0) > 0 && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="h-4 w-4" />
                                <span className="text-sm text-gray-500">Funding Paid (Daily)</span>
                            </div>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fundingSeries.map(r => ({ ...r, ds: new Date(r.t).toLocaleDateString() }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ds" minTickGap={24} />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Bar dataKey="v" name="USDC" fill="#34d399" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Activity (small cards) */}
                    {(toNum(counts.daily_trades_count) || toNum(counts.weekly_trades_count) || toNum(counts.total_trades_count)) && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4" />
                                <span className="sr-only">Activity</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {toNum(counts.daily_trades_count) !== 0 && (
                                    <StatCard label="Daily Trades" value={<CompactNum value={counts.daily_trades_count} />} />
                                )}
                                {toNum(counts.daily_volume) !== 0 && (
                                    <StatCard label="Daily Volume" value={<CompactNum value={counts.daily_volume} />} />
                                )}
                                {toNum(counts.weekly_trades_count) !== 0 && (
                                    <StatCard label="Weekly Trades" value={<CompactNum value={counts.weekly_trades_count} />} />
                                )}
                                {toNum(counts.weekly_volume) !== 0 && (
                                    <StatCard label="Weekly Volume" value={<CompactNum value={counts.weekly_volume} />} />
                                )}
                                {toNum(counts.total_trades_count) !== 0 && (
                                    <StatCard label="Total Trades" value={<CompactNum value={counts.total_trades_count} />} />
                                )}
                                {toNum(counts.total_volume) !== 0 && (
                                    <StatCard label="Total Volume" value={<CompactNum value={counts.total_volume} />} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Debug */}
                    <details className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
                        <summary className="cursor-pointer text-sm font-semibold">Debug: raw payloads</summary>
                        <pre className="mt-2 whitespace-pre-wrap text-xs">account_all: {JSON.stringify(accountAll, null, 2)?.slice(0, 3500)}</pre>
                        <pre className="mt-2 whitespace-pre-wrap text-xs">user_stats: {JSON.stringify(userStats, null, 2)?.slice(0, 3500)}</pre>
                    </details>
                </aside>
            </div>
        </div>
    );
}

/* ===== Small helper component for compact stat tiles ===== */
function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-3">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
            <div className="mt-0.5 text-lg font-extrabold font-mono">{value}</div>
        </div>
    );
}
