import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    TrendingUp,
    Info,
    ChevronDown,
    ChevronUp,
    Percent,
    Calculator,
    X,
    RefreshCcw,
    ArrowUpNarrowWide,
    ArrowDownNarrowWide,
} from "lucide-react";

/* ---------- math + formatting helpers ---------- */
const toNum = (v) => {
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n : NaN;
};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const pct = (v, digits = 4) =>
    Number.isFinite(v) ? (v * 100).toFixed(digits) + "%" : "—";
const fmt = {
    pct4: (v) => pct(v, 4),
    pct3: (v) => pct(v, 3),
    pct2: (v) => pct(v, 2),
    num2: (v) => (Number.isFinite(v) ? v.toFixed(2) : "—"),
};

/* ---------- annualization helpers ---------- */
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365;
const HOURS_PER_YEAR = HOURS_PER_DAY * DAYS_PER_YEAR; // 8760
const annualizeSimple = (hourly) => hourly * HOURS_PER_YEAR;

/* ---------- normalize to HOURLY funding ---------- */
const EXCHANGE_INTERVAL_HOURS = {
    LIGHTER: 8,
    COINBASE: 8,
    BINANCE: 8,
    BYBIT: 8,
    OKX: 8,
    BITGET: 8,
    DERIBIT: 8,
    BITMEX: 8,
    KRAKEN: 8,
    KUCOIN: 8,
    GATE: 8,
    HTX: 8,
};

const toHourly = (rec) => {
    const normalizeUnit = (x) => {
        if (!Number.isFinite(x)) return NaN;
        return Math.abs(x) >= 0.05 ? x / 100 : x;
    };

    const rawIn = toNum(rec?.rate);
    const raw = normalizeUnit(rawIn);
    if (!Number.isFinite(raw)) return NaN;

    const fromField = toNum(rec?.interval_hours);
    const key = String(rec?.exchange || "").toUpperCase();
    const fallback = EXCHANGE_INTERVAL_HOURS[key] ?? 8;
    const interval =
        Number.isFinite(fromField) && fromField > 0 ? fromField : fallback;

    return raw / interval; // decimal per hour
};

/* ---------- config ---------- */
const API_URL = "https://mainnet.zklighter.elliot.ai/api/v1/funding-rates";
const FETCH_OPTS = {
    method: "GET",
    headers: { accept: "application/json" },
};

/* ---------- tiny UI bits ---------- */
function ZeroAnchorBar({ min, max }) {
    if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) {
        return <div className="h-2 rounded bg-gray-200 dark:bg-gray-700" />;
    }
    const ratio = clamp(-min / (max - min));
    return (
        <div className="relative h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-500/60"
                style={{ left: `${ratio * 100}%` }}
                title="0% anchor"
            />
        </div>
    );
}

function RateChip({ exchange, rate }) {
    const positive = Number.isFinite(rate) && rate > 0;
    const negative = Number.isFinite(rate) && rate < 0;
    const base =
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-mono";
    const cls = negative
        ? `${base} border-rose-300/40 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-900/20 dark:text-rose-300`
        : positive
            ? `${base} border-emerald-300/40 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-900/20 dark:text-emerald-300`
            : `${base} border-gray-300/40 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-300`;
    return (
        <span
            className={cls}
            title={`${exchange} · ${fmt.pct4(rate)} per hour`}
        >
            <span className="uppercase tracking-wide">
                {String(exchange).toLowerCase()}
            </span>
            <span>· {fmt.pct4(rate)}/h</span>
        </span>
    );
}

/* ---------- strategy math (perp–perp delta-neutral) ---------- */
function describeLeg(rate) {
    if (!Number.isFinite(rate)) return "n/a";
    if (rate > 0) return "pay if long / receive if short";
    if (rate < 0) return "receive if long / pay if short";
    return "flat";
}

function ArbPanel({ symbol, best, worst, spread }) {
    const hourlyGross = spread;
    const dailyGross = hourlyGross * HOURS_PER_DAY;
    const apySimple = annualizeSimple(hourlyGross);

    return (
        <div className="mt-3 rounded-xl border border-emerald-300/40 bg-emerald-50/60 dark:border-emerald-400/30 dark:bg-emerald-900/10 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
                <Percent className="h-4 w-4" />
                Delta-neutral funding capture (LIGHTER ↔ other)
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        hourly (gross)
                    </div>
                    <div className="text-lg font-bold font-mono">
                        {fmt.pct4(hourlyGross)}
                    </div>
                    <div className="text-[12px] text-gray-500">
                        daily ≈ {fmt.pct4(dailyGross)}
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        annualized (simple)
                    </div>
                    <div className="text-sm">
                        APY ~{" "}
                        <span className="font-mono font-semibold">
                            {fmt.pct2(apySimple)}
                        </span>
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        legs
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold">short</span> on{" "}
                        <span className="font-mono">
                            {String(best?.exchange).toLowerCase()}
                        </span>{" "}
                        ({fmt.pct4(best?.rate)}/h)
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold">long</span> on{" "}
                        <span className="font-mono">
                            {String(worst?.exchange).toLowerCase()}
                        </span>{" "}
                        ({fmt.pct4(worst?.rate)}/h)
                    </div>
                </div>
            </div>

            <div className="mt-3 rounded-lg bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-2">
                <div className="flex items-start gap-2">
                    <Calculator className="h-4 w-4 mt-0.5" />
                    <div className="text-[13px] leading-relaxed">
                        <div className="font-semibold">execution</div>
                        <ul className="list-disc pl-5 mt-1 space-y-0.5">
                            <li>
                                <span className="font-mono">short {symbol}</span> perp on{" "}
                                <span className="font-semibold">
                                    {String(best?.exchange).toLowerCase()}
                                </span>{" "}
                                (rate {fmt.pct4(best?.rate)}/h → {describeLeg(best?.rate)}).
                            </li>
                            <li>
                                <span className="font-mono">long {symbol}</span> perp on{" "}
                                <span className="font-semibold">
                                    {String(worst?.exchange).toLowerCase()}
                                </span>{" "}
                                (rate {fmt.pct4(worst?.rate)}/h → {describeLeg(worst?.rate)}).
                            </li>
                        </ul>
                        <div className="text-[12px] text-gray-500 mt-2">
                            Net (gross) ≈ high − low = {fmt.pct4(hourlyGross)}/h.
                            Results ignore schedule misalignments and basis risk.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- main ---------- */
export default function FundingDifferences() {
    const [query, setQuery] = useState("");
    const [hideZeros, setHideZeros] = useState(true);
    const [initialLoading, setInitialLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [openCards, setOpenCards] = useState(() => new Set());
    const [activeGroup, setActiveGroup] = useState(null);

    const SORT_OPTS = [
        { key: "spread", label: "Spread (Δ/h)" },
        { key: "apy", label: "APY (simple)" },
        { key: "symbol", label: "Symbol" },
        { key: "max", label: "Max rate" },
        { key: "min", label: "Min rate" },
        { key: "count", label: "#Exchanges" },
    ];

    const [sortKey, setSortKey] = useState("spread");
    const [sortDir, setSortDir] = useState("desc");
    const EPS = 1e-12;

    const fetchFunding = useCallback(
        async (isFirst = false) => {
            try {
                if (isFirst) setInitialLoading(true);
                else setRefreshing(true);
                setError("");
                const res = await fetch(API_URL, FETCH_OPTS);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const list = Array.isArray(json?.funding_rates)
                    ? json.funding_rates
                    : [];
                setData(list);
            } catch (e) {
                setError(e?.message || "Failed to load funding rates");
            } finally {
                if (isFirst) setInitialLoading(false);
                else setRefreshing(false);
            }
        },
        []
    );

    // initial + background refresh
    useEffect(() => {
        let mounted = true;
        fetchFunding(true);
        const timer = window.setInterval(() => {
            if (!mounted) return;
            if (document?.visibilityState === "hidden") return;
            fetchFunding(false);
        }, 5 * 60_000);
        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [fetchFunding]);

    // debounce search
    const qRef = useRef(query);
    const [qDebounced, setQDebounced] = useState(query);
    useEffect(() => {
        qRef.current = query;
        const id = setTimeout(() => setQDebounced(qRef.current), 180);
        return () => clearTimeout(id);
    }, [query]);

    // build groups
    const grouped = useMemo(() => {
        const q = qDebounced.trim().toLowerCase();

        const normalized = data
            .map((r) => ({
                ...r,
                _rawRate: toNum(r.rate),
                rate: toHourly(r),
            }))
            .filter((r) =>
                !q
                    ? true
                    : String(r.symbol || "").toLowerCase().includes(q)
            );

        const bySymbol = new Map();
        for (const r of normalized) {
            if (!r.symbol) continue;
            const key = String(r.symbol);
            const arr = bySymbol.get(key) || [];
            arr.push(r);
            bySymbol.set(key, arr);
        }

        const out = [];

        for (const [symbol, items] of bySymbol.entries()) {
            const lighter = items.find(
                (i) => String(i.exchange || "").toUpperCase() === "LIGHTER"
            );
            if (!lighter) continue;

            const rL = toNum(lighter.rate);
            if (!Number.isFinite(rL)) continue;

            if (hideZeros && Math.abs(rL) <= EPS) continue;

            let bestPair = null;

            for (const it of items) {
                if (String(it.exchange || "").toUpperCase() === "LIGHTER") continue;

                const rO = toNum(it.rate);
                if (!Number.isFinite(rO)) continue;

                const highIsLighter = rL >= rO;
                const high = highIsLighter
                    ? { exchange: "LIGHTER", rate: rL }
                    : { exchange: it.exchange, rate: rO };
                const low = highIsLighter
                    ? { exchange: it.exchange, rate: rO }
                    : { exchange: "LIGHTER", rate: rL };

                const spread = high.rate - low.rate;
                if (!Number.isFinite(spread) || spread < -EPS) continue;

                if (!bestPair || spread > bestPair.spread + EPS) {
                    bestPair = {
                        best: high,
                        worst: low,
                        spread,
                        otherExch: it.exchange,
                    };
                }
            }

            if (!bestPair) {
                if (hideZeros) continue;
                bestPair = {
                    best: { exchange: lighter.exchange, rate: rL },
                    worst: { exchange: lighter.exchange, rate: rL },
                    spread: 0,
                    otherExch: null,
                };
            }

            const min = Math.min(bestPair.best.rate, bestPair.worst.rate);
            const max = Math.max(bestPair.best.rate, bestPair.worst.rate);

            const finiteRates = items
                .map((i) => toNum(i.rate))
                .filter(Number.isFinite);

            const regime =
                finiteRates.length && finiteRates.every((x) => x < 0)
                    ? "all-negative"
                    : finiteRates.length && finiteRates.every((x) => x > 0)
                        ? "all-positive"
                        : "mixed";

            const chipItems = items
                .filter((i) => Number.isFinite(toNum(i.rate)))
                .sort((a, b) => {
                    const aIsL =
                        String(a.exchange || "").toUpperCase() === "LIGHTER";
                    const bIsL =
                        String(b.exchange || "").toUpperCase() === "LIGHTER";
                    if (aIsL !== bIsL) return aIsL ? -1 : 1;
                    return (
                        Math.abs(toNum(b.rate)) - Math.abs(toNum(a.rate))
                    );
                })
                .map((i) => ({
                    exchange: i.exchange,
                    rate: i.rate,
                    market_id: i.market_id,
                }));

            out.push({
                symbol,
                min,
                max,
                spread: bestPair.spread,
                best: bestPair.best,
                worst: bestPair.worst,
                count: chipItems.length,
                regime,
                items: chipItems,
            });
        }

        const dir = sortDir === "asc" ? 1 : -1;
        const byKey = (a, b) => {
            switch (sortKey) {
                case "spread":
                    return dir * (a.spread - b.spread);
                case "apy":
                    return (
                        dir *
                        (annualizeSimple(a.spread) -
                            annualizeSimple(b.spread))
                    );
                case "symbol":
                    return dir * a.symbol.localeCompare(b.symbol);
                case "max":
                    return dir * (a.max - b.max);
                case "min":
                    return dir * (a.min - b.min);
                case "count":
                    return dir * (a.count - b.count);
                default:
                    return dir * (a.spread - b.spread);
            }
        };

        out.sort(byKey);
        return out;
    }, [data, qDebounced, hideZeros, sortKey, sortDir]);

    // global summary
    const summary = useMemo(() => {
        const total = grouped.length;
        let exch = 0,
            allPos = 0,
            allNeg = 0,
            mixed = 0;
        let totalSpread = 0;
        for (const g of grouped) {
            exch += g.count;
            totalSpread += g.spread;
            if (g.regime === "all-negative") allNeg++;
            else if (g.regime === "all-positive") allPos++;
            else mixed++;
        }
        return {
            total,
            avgSpread: total ? totalSpread / total : NaN,
            exchanges: exch,
            allPos,
            allNeg,
            mixed,
        };
    }, [grouped]);

    const totalSymbols = grouped.length;

    const toggleCard = (symbol) => {
        setOpenCards((prev) => {
            const next = new Set(prev);
            if (next.has(symbol)) next.delete(symbol);
            else next.add(symbol);
            return next;
        });
    };

    const toggleSortDir = () =>
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));

    return (
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 text-gray-900 dark:text-gray-100">
            {/* Header + filters */}
            <motion.div
                className="mb-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="flex flex-wrap items-center gap-2 text-base font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    Lighter Perp Funding Arbitrage
                    <span className="text-xs text-gray-500 ml-1">
                        ({totalSymbols})
                    </span>
                    {refreshing && (
                        <span
                            className="ml-2 inline-flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-300"
                            aria-live="polite"
                        >
                            <span className="h-3 w-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                            updating
                        </span>
                    )}
                    <button
                        className="ml-auto inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-1 text-[12px] hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => fetchFunding(false)}
                        title="Refresh data"
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Refresh
                    </button>
                </div>

                <div className="mt-1 text-[11px] text-gray-500">
                    Normalized to <span className="font-semibold">per-hour</span>.
                    Only pairs <span className="font-semibold">lighter</span> ↔ other
                    exchanges are considered.
                </div>

                <div className="mt-3 grid grid-cols-1 lg:grid-cols-4 gap-2 lg:items-center">
                    <div className="lg:col-span-2 flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 sm:px-3">
                        <Search className="h-4 w-4 shrink-0" />
                        <input
                            className="h-11 flex-1 bg-transparent text-sm outline-none min-w-0"
                            placeholder="Find coin by ticker (e.g. BTC, ETH, TAO)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={hideZeros}
                            onChange={(e) => setHideZeros(e.target.checked)}
                        />
                        hide 0% rates
                    </label>

                    <div className="flex items-center gap-2">
                        <select
                            className="h-11 flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 text-sm"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            title="Sort by"
                        >
                            {SORT_OPTS.map((o) => (
                                <option key={o.key} value={o.key}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <button
                            className="inline-flex items-center gap-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 h-11 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={toggleSortDir}
                            title="Toggle sort direction"
                        >
                            {sortDir === "asc" ? (
                                <ArrowUpNarrowWide className="h-4 w-4" />
                            ) : (
                                <ArrowDownNarrowWide className="h-4 w-4" />
                            )}
                            {sortDir}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* quick summary */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[12px] text-gray-500">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                        symbols{" "}
                        <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                            {summary.total}
                        </span>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                        exchanges{" "}
                        <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                            {summary.exchanges}
                        </span>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                        avg spread{" "}
                        <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                            {fmt.pct3(summary.avgSpread)}
                        </span>
                        /h
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                        all-neg{" "}
                        <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                            {summary.allNeg}
                        </span>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                        all-pos{" "}
                        <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">
                            {summary.allPos}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            {initialLoading && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-500">
                    Loading…
                </div>
            )}

            {!initialLoading && totalSymbols === 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-500">
                    No symbols match.
                </div>
            )}

            {!initialLoading && totalSymbols > 0 && (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.03 } },
                    }}
                >
                    {grouped.map((g) => {
                        const opened = openCards.has(g.symbol);
                        const previewCount = 8;
                        const showToggle = g.items.length > previewCount;
                        const visible = opened
                            ? g.items
                            : g.items.slice(0, previewCount);

                        const apySimple = annualizeSimple(g.spread);

                        return (
                            <motion.div
                                key={g.symbol}
                                variants={{
                                    hidden: { opacity: 0, y: 8 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                whileHover={{ y: -2 }}
                                className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-3 sm:p-4 flex flex-col gap-2"
                            >
                                {/* Card header */}
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-lg sm:text-xl font-bold leading-tight break-words tracking-tight">
                                            {g.symbol}
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            {/* SHORT */}
                                            <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-2.5 sm:p-3">
                                                <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500">
                                                    short on
                                                </div>
                                                <div className="font-mono text-[11px] sm:text-sm font-semibold truncate">
                                                    {String(g.best?.exchange).toLowerCase()}
                                                </div>
                                                <div className="text-[10px] sm:text-[12px] text-gray-500">
                                                    {fmt.pct4(g.best?.rate)}/h
                                                </div>
                                            </div>

                                            {/* LONG */}
                                            <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-2.5 sm:p-3">
                                                <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500">
                                                    long on
                                                </div>
                                                <div className="font-mono text-[11px] sm:text-sm font-semibold truncate">
                                                    {String(g.worst?.exchange).toLowerCase()}
                                                </div>
                                                <div className="text-[10px] sm:text-[12px] text-gray-500">
                                                    {fmt.pct4(g.worst?.rate)}/h
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2 space-y-0.5 text-[10px] sm:text-[12px] text-gray-600 dark:text-gray-400">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span>
                                                    spread{" "}
                                                    <span className="font-mono">
                                                        {fmt.pct4(g.spread)}
                                                    </span>
                                                    /h
                                                </span>
                                                <span className="opacity-60">•</span>
                                                <span>
                                                    exchanges{" "}
                                                    <span className="font-mono">
                                                        {g.count}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="text-[9px] sm:text-[11px] opacity-80">
                                                best {fmt.pct4(g.max)}/h ·{" "}
                                                {String(g.best?.exchange).toLowerCase()} | worst{" "}
                                                {fmt.pct4(g.min)}/h ·{" "}
                                                {String(g.worst?.exchange).toLowerCase()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => setActiveGroup(g)}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-2 text-[11px] sm:text-[12px] font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition"
                                        title="Open arbitrage details"
                                    >
                                        <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        details
                                        <span className="ml-0.5 font-mono">
                                            {fmt.pct2(apySimple)}
                                        </span>
                                    </button>
                                </div>

                                {/* Tiny bar */}
                                <div className="mt-1">
                                    <ZeroAnchorBar min={g.min} max={g.max} />
                                    <div className="mt-1 grid grid-cols-3 text-[9px] sm:text-[11px] text-gray-500">
                                        <div>min {fmt.pct4(g.min)}/h</div>
                                        <div className="text-center">0%/h</div>
                                        <div className="text-right">
                                            max {fmt.pct4(g.max)}/h
                                        </div>
                                    </div>
                                </div>

                                {/* Chips */}
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {visible.map((it) => (
                                        <RateChip
                                            key={
                                                String(it.exchange) + String(it.market_id)
                                            }
                                            exchange={it.exchange}
                                            rate={it.rate}
                                        />
                                    ))}
                                </div>

                                {/* Toggle */}
                                {showToggle && (
                                    <button
                                        className="mt-2 inline-flex items-center gap-1 self-start text-[10px] sm:text-xs rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => toggleCard(g.symbol)}
                                    >
                                        {opened ? (
                                            <>
                                                <ChevronUp className="h-3 w-3" />
                                                show less
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-3 w-3" />
                                                show all ({g.items.length})
                                            </>
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {activeGroup && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveGroup(null)}
                    >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div
                            className="relative w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
                            initial={{ y: 24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 24, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        arbitrage opportunity
                                    </div>
                                    <div className="text-2xl font-bold tracking-tight">
                                        {activeGroup.symbol}
                                    </div>
                                </div>
                                <button
                                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => setActiveGroup(null)}
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="px-4 sm:px-5 pb-5">
                                <ArbPanel
                                    symbol={activeGroup.symbol}
                                    best={activeGroup.best}
                                    worst={activeGroup.worst}
                                    spread={activeGroup.spread}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Risk/UX footer */}
            <div className="mt-4 text-[11px] text-gray-500">
                Estimates ignore funding schedule misalignments (1h vs 8h accrual),
                index/basis drift between venues, collateral yield, borrow constraints
                and operational risks. Do your own research.
            </div>
        </div>
    );
}
