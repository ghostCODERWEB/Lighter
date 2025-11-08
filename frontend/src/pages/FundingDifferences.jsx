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
const HOURS_PER_YEAR = HOURS_PER_DAY * DAYS_PER_YEAR;
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
        return <div className="h-1.5 rounded bg-slate-500/40" />;
    }
    const ratio = clamp(-min / (max - min));
    return (
        <div className="relative h-1.5 rounded bg-slate-500/30 overflow-hidden">
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-700"
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
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-mono leading-none";
    const cls = negative
        ? `${base} border-rose-400/60 bg-rose-900/10 text-rose-200`
        : positive
            ? `${base} border-emerald-400/60 bg-emerald-900/5 text-emerald-200`
            : `${base} border-slate-400/40 bg-slate-700/40 text-slate-100`;
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

/* compact 4-slot exchange block used in LIST view */
function ExchangeSlots({ items, max = 4 }) {
    const slots = items.slice(0, max);
    while (slots.length < max) slots.push(null);

    return (
        <div className="grid grid-cols-4 gap-1.25 mt-1">
            {slots.map((it, idx) =>
                it ? (
                    <div
                        key={idx}
                        className="flex flex-col px-1.5 py-1 rounded-md bg-slate-700/70 border border-slate-500/40"
                    >
                        <span className="font-mono text-[9px] text-slate-100 mt-0.5 leading-tight">
                            {String(it.exchange).toLowerCase()}
                        </span>
                        <span className="font-mono text-[8px] text-emerald-300 mt-0.5 leading-tight">
                            {fmt.pct4(it.rate)}/h
                        </span>
                    </div>
                ) : (
                    <div
                        key={idx}
                        className="rounded-md bg-slate-700/30 border border-slate-500/20"
                    />
                )
            )}
        </div>
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
        <div className="mt-3 rounded-2xl border border-emerald-400/40 bg-slate-800/95 p-3 text-sm text-slate-50">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
                <Percent className="h-4 w-4" />
                Delta-neutral funding capture (LIGHTER ↔ other)
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-500/60 bg-slate-800/90 p-2">
                    <div className="text-[10px] uppercase tracking-wide text-slate-300">
                        hourly (gross)
                    </div>
                    <div className="text-lg font-bold font-mono">
                        {fmt.pct4(hourlyGross)}
                    </div>
                    <div className="text-[11px] text-slate-300">
                        daily ≈ {fmt.pct4(dailyGross)}
                    </div>
                </div>
                <div className="rounded-xl border border-slate-500/60 bg-slate-800/90 p-2">
                    <div className="text-[10px] uppercase tracking-wide text-slate-300">
                        annualized (simple)
                    </div>
                    <div className="text-sm">
                        APY ~{" "}
                        <span className="font-mono font-semibold text-emerald-300">
                            {fmt.pct2(apySimple)}
                        </span>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-500/60 bg-slate-800/90 p-2">
                    <div className="text-[10px] uppercase tracking-wide text-slate-300">
                        legs
                    </div>
                    <div className="text-[11px]">
                        <span className="font-semibold">short</span> on{" "}
                        <span className="font-mono">
                            {String(best?.exchange).toLowerCase()}
                        </span>{" "}
                        ({fmt.pct4(best?.rate)}/h)
                    </div>
                    <div className="text-[11px]">
                        <span className="font-semibold">long</span> on{" "}
                        <span className="font-mono">
                            {String(worst?.exchange).toLowerCase()}
                        </span>{" "}
                        ({fmt.pct4(worst?.rate)}/h)
                    </div>
                </div>
            </div>

            <div className="mt-3 rounded-xl border border-slate-500/50 bg-slate-800/95 p-2">
                <div className="flex items-start gap-2">
                    <Calculator className="h-4 w-4 mt-0.5 text-slate-300" />
                    <div className="text-[12px] leading-relaxed text-slate-100">
                        <div className="font-semibold">
                            execution
                        </div>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5">
                            <li>
                                short {symbol} perp on{" "}
                                <span className="font-mono">
                                    {String(best?.exchange).toLowerCase()}
                                </span>{" "}
                                ({fmt.pct4(best?.rate)}/h,{" "}
                                {describeLeg(best?.rate)}).
                            </li>
                            <li>
                                long {symbol} perp on{" "}
                                <span className="font-mono">
                                    {String(worst?.exchange).toLowerCase()}
                                </span>{" "}
                                ({fmt.pct4(worst?.rate)}/h,{" "}
                                {describeLeg(worst?.rate)}).
                            </li>
                        </ul>
                        <div className="text-[10px] text-slate-300 mt-2">
                            Net (gross) ≈ high − low = {fmt.pct4(hourlyGross)}/h.
                            Funding schedule, index drift and basis risk are ignored.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- helpers ---------- */
const spreadBadge = (v, labelClass = "") => {
    if (!Number.isFinite(v)) {
        return (
            <span className={`px-2 py-1 rounded-md text-[10px] ${labelClass}`}>
                —
            </span>
        );
    }
    const positive = v > 0;
    const negative = v < 0;
    const base =
        "px-2 py-1 rounded-md text-[10px] font-semibold font-mono inline-flex justify-center min-w-[64px]";
    if (positive)
        return (
            <span
                className={`${base} bg-emerald-700/50 text-emerald-100 border border-emerald-400/70 ${labelClass}`}
            >
                {fmt.pct2(v)}
            </span>
        );
    if (negative)
        return (
            <span
                className={`${base} bg-rose-700/50 text-rose-100 border border-rose-400/70 ${labelClass}`}
            >
                {fmt.pct2(v)}
            </span>
        );
    return (
        <span
            className={`${base} bg-slate-700/60 text-slate-50 border border-slate-400/70 ${labelClass}`}
        >
            {fmt.pct2(v)}
        </span>
    );
};

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
    const [viewMode, setViewMode] = useState("list"); // default: list

    const SORT_OPTS = [
        { key: "spread", label: "Spread (Δ/h)" },
        { key: "apy", label: "Spread APY" },
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
                if (String(it.exchange || "").toUpperCase() === "LIGHTER")
                    continue;

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

    function FixedRateChipRow({ items, max = 4 }) {
        const visible = items.slice(0, max);
        const missing = Math.max(0, max - visible.length);

        return (
            <div className="flex flex-wrap gap-1 min-h-[22px]">
                {visible.map((it) => (
                    <RateChip
                        key={String(it.exchange) + String(it.market_id)}
                        exchange={it.exchange}
                        rate={it.rate}
                    />
                ))}

                {/* invisible placeholders to reserve space up to 4 chips */}
                {Array.from({ length: missing }).map((_, i) => (
                    <div
                        key={`ph-${i}`}
                        className="opacity-0 pointer-events-none"
                    >
                        <RateChip exchange="placeholder" rate={0} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 text-slate-50"
        >
            {/* Header */}
            <motion.div
                className="mb-4 rounded-2xl border border-slate-400/20 bg-slate-800/90 p-3 sm:p-4 shadow-[0_16px_32px_rgba(15,23,42,0.35)]"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
            >
                <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-semibold tracking-tight">
                    <span className="inline-flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span>Lighter perp funding</span>
                    </span>
                    <span className="text-[10px] text-slate-300">
                        ({totalSymbols})
                    </span>
                    {refreshing && (
                        <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-emerald-300">
                            <span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" />
                            updating
                        </span>
                    )}
                    <button
                        className="ml-auto inline-flex items-center gap-1 rounded-xl border border-slate-500/70 bg-slate-800/90 px-2.5 py-1.5 text-[10px] text-slate-50 hover:bg-slate-700"
                        onClick={() => fetchFunding(false)}
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Refresh
                    </button>
                </div>

                <div className="mt-1 text-[10px] text-slate-300">
                    Rates normalized to <span className="font-semibold">per-hour</span>, comparing{" "}
                    <span className="font-semibold">LIGHTER</span> vs other exchanges.
                </div>

                {/* Controls */}
                <div className="mt-3 grid grid-cols-1 lg:grid-cols-[minmax(0,2.6fr)_auto_auto] gap-2 lg:items-center">
                    {/* Search */}
                    <div className="flex items-center gap-2 rounded-xl border border-slate-500/40 bg-slate-800 px-2 sm:px-3">
                        <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <input
                            className="h-9 sm:h-10 flex-1 bg-transparent text-[11px] sm:text-sm text-slate-50 placeholder:text-slate-400 outline-none min-w-0"
                            placeholder="Search symbol (BTC, ETH, TAO...)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Hide zeros */}
                    <label className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-200">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-slate-400 bg-slate-800"
                            checked={hideZeros}
                            onChange={(e) => setHideZeros(e.target.checked)}
                        />
                        hide 0% markets
                    </label>

                    {/* Sort + View */}
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <div className="flex items-center gap-1.5">
                            <select
                                className="h-8 sm:h-9 rounded-xl border border-slate-500/50 bg-slate-800/90 px-2 text-[9px] sm:text-[11px] text-slate-50"
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
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-500/50 bg-slate-800/90 px-2 h-8 sm:h-9 text-[9px] sm:text-[11px] text-slate-50 hover:bg-slate-700"
                                onClick={toggleSortDir}
                                title="Toggle sort direction"
                            >
                                {sortDir === "asc" ? (
                                    <ArrowUpNarrowWide className="h-3 w-3" />
                                ) : (
                                    <ArrowDownNarrowWide className="h-3 w-3" />
                                )}
                                {sortDir}
                            </button>
                        </div>

                        {/* View toggle */}
                        <div className="inline-flex items-center rounded-xl border border-slate-500/50 bg-slate-800/90 p-0.5">
                            <button
                                onClick={() => setViewMode("list")}
                                className={
                                    "px-2.5 py-1.5 text-[9px] sm:text-[10px] rounded-lg " +
                                    (viewMode === "list"
                                        ? "bg-emerald-400 text-slate-900 font-semibold"
                                        : "text-slate-300 hover:bg-slate-700")
                                }
                            >
                                List
                            </button>
                            <button
                                onClick={() => setViewMode("cards")}
                                className={
                                    "px-2.5 py-1.5 text-[9px] sm:text-[10px] rounded-lg " +
                                    (viewMode === "cards"
                                        ? "bg-emerald-400 text-slate-900 font-semibold"
                                        : "text-slate-300 hover:bg-slate-700")
                                }
                            >
                                Cards
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary + error */}
                {error && (
                    <div className="mt-2 text-[11px] text-rose-300 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        {error}
                    </div>
                )}

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[9px] sm:text-[10px] text-slate-200">
                    <div className="rounded-lg border border-slate-500/40 bg-slate-800 p-2 flex justify-between">
                        <span>symbols</span>
                        <span className="font-mono text-slate-50">
                            {summary.total}
                        </span>
                    </div>
                    <div className="rounded-lg border border-slate-500/40 bg-slate-800 p-2 flex justify-between">
                        <span>exchanges</span>
                        <span className="font-mono text-slate-50">
                            {summary.exchanges}
                        </span>
                    </div>
                    <div className="rounded-lg border border-slate-500/40 bg-slate-800 p-2 flex justify-between">
                        <span>avg spread /h</span>
                        <span className="font-mono text-emerald-300">
                            {fmt.pct3(summary.avgSpread)}
                        </span>
                    </div>
                    <div className="rounded-lg border border-slate-500/40 bg-slate-800 p-2 flex justify-between">
                        <span>all-neg</span>
                        <span className="font-mono text-slate-50">
                            {summary.allNeg}
                        </span>
                    </div>
                    <div className="rounded-lg border border-slate-500/40 bg-slate-800 p-2 flex justify-between">
                        <span>all-pos</span>
                        <span className="font-mono text-slate-50">
                            {summary.allPos}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            {initialLoading && (
                <div className="rounded-2xl border border-slate-500/40 bg-slate-800/90 p-6 text-center text-slate-200">
                    Loading…
                </div>
            )}

            {!initialLoading && totalSymbols === 0 && (
                <div className="rounded-2xl border border-slate-500/40 bg-slate-800/90 p-6 text-center text-slate-200">
                    No symbols match current filters.
                </div>
            )}

            {!initialLoading && totalSymbols > 0 && (
                <>
                    {viewMode === "list" ? (
                        /* ---------- LIST VIEW ---------- */
                        <motion.div
                            className="rounded-2xl border border-slate-500/40 bg-slate-800/95 overflow-hidden"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.01 } },
                            }}
                        >
                            {/* Header row */}
                            <div className="hidden md:grid grid-cols-[2.9fr,2.1fr,1.2fr,1.1fr] gap-2 px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-300 bg-slate-800 border-b border-slate-500/30">
                                <div>Ticker / exchanges (4)</div>
                                <div>(short / long)</div>
                                <div>Spread APR</div>
                                <div>Spread /h</div>
                                {/* <div>Range</div> */}
                            </div>

                            {/* Rows */}
                            {grouped.map((g) => {
                                const apySimple = annualizeSimple(g.spread);
                                return (
                                    <motion.div
                                        key={g.symbol}
                                        variants={{
                                            hidden: { opacity: 0, y: 4 },
                                            show: { opacity: 1, y: 0 },
                                        }}
                                        className="group border-t border-slate-600/30 last:border-b last:rounded-b-2xl hover:bg-slate-700/60 transition-colors"
                                    >
                                        {/* Desktop layout */}
                                        <div className="hidden md:grid grid-cols-[2.9fr,2.1fr,1.2fr,1.1fr] gap-2 px-4 py-2.5 text-[10px] items-center">
                                            {/* Symbol + inline exchanges (reserve up to 4) */}
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => setActiveGroup(g)}
                                                    className="my-2 text-[11px] font-semibold text-slate-50 hover:text-emerald-300 leading-none text-left"
                                                >
                                                    {g.symbol}
                                                </button>
                                                <FixedRateChipRow items={g.items} max={4} />
                                            </div>

                                            {/* Pair info */}
                                            <div className="flex flex-col gap-0.5 text-slate-100">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="text-[9px] text-slate-300">
                                                        short
                                                    </span>
                                                    <span className="font-mono text-[10px]">
                                                        {String(
                                                            g.best?.exchange
                                                        ).toLowerCase()}
                                                    </span>
                                                    <span className="text-[9px] text-slate-300">
                                                        {fmt.pct4(
                                                            g.best?.rate
                                                        )}
                                                        /h
                                                    </span>
                                                    <span className="text-slate-400">
                                                        /
                                                    </span>
                                                    <span className="text-[9px] text-slate-300">
                                                        long
                                                    </span>
                                                    <span className="font-mono text-[10px]">
                                                        {String(
                                                            g.worst?.exchange
                                                        ).toLowerCase()}
                                                    </span>
                                                    <span className="text-[9px] text-slate-300">
                                                        {fmt.pct4(
                                                            g.worst?.rate
                                                        )}
                                                        /h
                                                    </span>
                                                </div>
                                                <div className="text-[8px] text-slate-300">
                                                    venues:{" "}
                                                    <span className="font-mono">
                                                        {g.count}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* F Spread APR */}
                                            <div className="flex items-center">
                                                {spreadBadge(apySimple)}
                                            </div>

                                            {/* F Spread /h */}
                                            <div className="flex items-center">
                                                {spreadBadge(g.spread)}
                                            </div>

                                            {/* Range + bar */}
                                            {/* <div className="flex flex-col gap-1">
                                                <ZeroAnchorBar
                                                    min={g.min}
                                                    max={g.max}
                                                />
                                                <div className="flex justify-between text-[8px] text-slate-300">
                                                    <span>
                                                        {fmt.pct4(g.min)}/h
                                                    </span>
                                                    <span>0</span>
                                                    <span>
                                                        {fmt.pct4(g.max)}/h
                                                    </span>
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* Mobile stacked layout */}
                                        <div className="md:hidden px-3 py-2.5 text-[10px] flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setActiveGroup(g)
                                                    }
                                                    className="text-[11px] font-semibold text-slate-50 hover:text-emerald-300"
                                                >
                                                    {g.symbol}
                                                </button>
                                                {spreadBadge(apySimple)}
                                            </div>
                                            {/* Symbol + inline exchanges (reserve up to 4) */}
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => setActiveGroup(g)}
                                                    className="text-[11px] font-semibold text-slate-50 hover:text-emerald-300 leading-none text-left"
                                                >
                                                    {g.symbol}
                                                </button>
                                                <FixedRateChipRow items={g.items} max={4} />
                                            </div>

                                            <div className="flex justify-between text-[9px] text-slate-300">
                                                <span>
                                                    Δ/h {fmt.pct4(g.spread)}
                                                </span>
                                                <span>
                                                    best {fmt.pct4(g.max)}/h
                                                </span>
                                                <span>
                                                    worst {fmt.pct4(g.min)}/h
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        /* ---------- CARDS VIEW ---------- */
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.02 } },
                            }}
                        >
                            {grouped.map((g) => {
                                const opened = openCards.has(g.symbol);
                                const previewCount = 8;
                                const showToggle =
                                    g.items.length > previewCount;
                                const visible = opened
                                    ? g.items
                                    : g.items.slice(0, previewCount);

                                const apySimple = annualizeSimple(g.spread);

                                return (
                                    <motion.div
                                        key={g.symbol}
                                        variants={{
                                            hidden: { opacity: 0, y: 6 },
                                            show: { opacity: 1, y: 0 },
                                        }}
                                        whileHover={{ y: -2 }}
                                        className="group rounded-2xl border border-slate-500/40 bg-slate-800/95 shadow-lg p-3 sm:p-4 flex flex-col gap-2"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-lg sm:text-xl font-semibold leading-tight tracking-tight text-slate-50">
                                                    {g.symbol}
                                                </div>
                                                <div className="mt-1 text-[10px] text-slate-300">
                                                    spread{" "}
                                                    <span className="font-mono text-emerald-300">
                                                        {fmt.pct4(g.spread)}
                                                    </span>
                                                    /h · venues{" "}
                                                    <span className="font-mono">
                                                        {g.count}
                                                    </span>
                                                </div>

                                                <div className="my-3 grid grid-cols-2 gap-2">
                                                    <div className="rounded-2xl border border-slate-500/40 bg-slate-800 px-3 py-2">
                                                        <div className="text-[8px] uppercase tracking-wide text-slate-300">
                                                            short on
                                                        </div>
                                                        <div className="font-mono text-[11px] text-slate-50 mt-0.5">
                                                            {String(
                                                                g.best
                                                                    ?.exchange
                                                            ).toLowerCase()}
                                                        </div>
                                                        <div className="text-[9px] text-slate-300 mt-0.5">
                                                            {fmt.pct4(
                                                                g.best?.rate
                                                            )}
                                                            /h
                                                        </div>
                                                    </div>
                                                    <div className="rounded-2xl border border-slate-500/40 bg-slate-800 px-3 py-2">
                                                        <div className="text-[8px] uppercase tracking-wide text-slate-300">
                                                            long on
                                                        </div>
                                                        <div className="font-mono text-[11px] text-slate-50 mt-0.5">
                                                            {String(
                                                                g.worst
                                                                    ?.exchange
                                                            ).toLowerCase()}
                                                        </div>
                                                        <div className="text-[9px] text-slate-300 mt-0.5">
                                                            {fmt.pct4(
                                                                g.worst?.rate
                                                            )}
                                                            /h
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setActiveGroup(g)
                                                }
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400 text-slate-900 px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold shadow hover:bg-emerald-300"
                                            >
                                                <Percent className="h-3.5 w-3.5" />
                                                details
                                                <span className="font-mono">
                                                    {fmt.pct2(apySimple)}
                                                </span>
                                            </button>
                                        </div>

                                        <div>
                                            <ZeroAnchorBar
                                                min={g.min}
                                                max={g.max}
                                            />
                                            <div className="mt-1 grid grid-cols-3 text-[8px] sm:text-[9px] text-slate-300">
                                                <div>
                                                    min {fmt.pct4(g.min)}/h
                                                </div>
                                                <div className="text-center">
                                                    0%/h
                                                </div>
                                                <div className="text-right">
                                                    max {fmt.pct4(g.max)}/h
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {visible.map((it) => (
                                                <RateChip
                                                    key={
                                                        String(
                                                            it.exchange
                                                        ) + String(it.market_id)
                                                    }
                                                    exchange={it.exchange}
                                                    rate={it.rate}
                                                />
                                            ))}
                                        </div>

                                        {showToggle && (
                                            <button
                                                className="mt-2 inline-flex items-center gap-1 self-start text-[9px] sm:text-[10px] rounded-md border border-slate-500/40 px-2 py-1 text-slate-200 hover:bg-slate-800"
                                                onClick={() =>
                                                    toggleCard(g.symbol)
                                                }
                                            >
                                                {opened ? (
                                                    <>
                                                        <ChevronUp className="h-3 w-3" />
                                                        show less
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="h-3 w-3" />
                                                        show all (
                                                        {g.items.length})
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </>
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
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
                        <motion.div
                            className="relative w-full max-w-2xl rounded-2xl border border-slate-500/40 bg-slate-800 shadow-2xl"
                            initial={{ y: 24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 24, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4">
                                <div>
                                    <div className="text-[9px] uppercase tracking-[0.16em] text-slate-300">
                                        arbitrage opportunity
                                    </div>
                                    <div className="text-2xl font-semibold tracking-tight text-slate-50">
                                        {activeGroup.symbol}
                                    </div>
                                </div>
                                <button
                                    className="rounded-lg p-2 hover:bg-slate-700 text-slate-200"
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

            <div className="mt-3 text-[9px] text-slate-300">
                All values are indicative only and exclude fees, schedule
                misalignments, leg risk, and operational constraints.
            </div>
        </div>
    );
}
