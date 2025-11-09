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

/* ---------- shared theme ---------- */

const baseFont =
  "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif";

// match PointsCalculator card style (but slightly darker)
const cardBase =
  "rounded-2xl border border-gray-200 bg-white/80 shadow-sm dark:border-gray-800 dark:bg-gray-900/85";
const cardSoft =
  "rounded-2xl border border-gray-200 bg-white/85 shadow-sm dark:border-gray-800 dark:bg-gray-900/90";
const cardTight =
  "rounded-xl border border-gray-200 bg-white/80 shadow-sm dark:border-gray-800 dark:bg-gray-900/90";

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
    // treat >= 0.05 as percent, else decimal
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

/* ---------- API ---------- */

const API_URL =
  "https://mainnet.zklighter.elliot.ai/api/v1/funding-rates";
const FETCH_OPTS = {
  method: "GET",
  headers: { accept: "application/json" },
};

/* ---------- tiny UI bits ---------- */

function ZeroAnchorBar({ min, max }) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) {
    return (
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800" />
    );
  }
  const ratio = clamp(-min / (max - min));
  return (
    <div className="relative h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-gray-500 dark:bg-gray-300"
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
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-2xl border text-[9px] font-mono leading-none";

  const cls = negative
    ? `${base} border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-200`
    : positive
      ? `${base} border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-200`
      : `${base} border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-200`;

  return (
    <span className={cls} title={`${exchange} · ${fmt.pct4(rate)}/h`}>
      <span className="uppercase tracking-wide">
        {String(exchange).toLowerCase()}
      </span>
      <span>{fmt.pct4(rate)}/h</span>
    </span>
  );
}

// keep rows stable
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

/* ---------- strategy helpers ---------- */

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
    <div className={`${cardBase} mt-3 p-3 sm:p-4 text-xs sm:text-sm`}>
      <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-300">
        <Percent className="h-4 w-4" />
        Delta-neutral funding capture (LIGHTER ↔ other)
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className={`${cardTight} p-2`}>
          <div className="text-[9px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            hourly (gross)
          </div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-300">
            {fmt.pct4(hourlyGross)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            daily ≈ {fmt.pct4(dailyGross)}
          </div>
        </div>
        <div className={`${cardTight} p-2`}>
          <div className="text-[9px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            annualized (simple)
          </div>
          <div className="text-[11px]">
            APY ~{" "}
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-300">
              {fmt.pct2(apySimple)}
            </span>
          </div>
        </div>
        <div className={`${cardTight} p-2 space-y-0.5`}>
          <div className="text-[9px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            legs
          </div>
          <div className="text-[10px]">
            <span className="font-semibold text-red-600 dark:text-red-300">
              short
            </span>{" "}
            on{" "}
            <span className="font-mono">
              {String(best?.exchange).toLowerCase()}
            </span>{" "}
            ({fmt.pct4(best?.rate)}/h)
          </div>
          <div className="text-[10px]">
            <span className="font-semibold text-emerald-600 dark:text-emerald-300">
              long
            </span>{" "}
            on{" "}
            <span className="font-mono">
              {String(worst?.exchange).toLowerCase()}
            </span>{" "}
            ({fmt.pct4(worst?.rate)}/h)
          </div>
        </div>
      </div>

      <div className={`${cardTight} mt-2 p-2.5`}>
        <div className="flex items-start gap-2">
          <Calculator className="h-4 w-4 mt-0.5 text-gray-400 dark:text-gray-500" />
          <div className="text-[10px] leading-relaxed text-gray-800 dark:text-gray-100">
            <div className="font-semibold">
              Execution (ignoring fees / basis risk)
            </div>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              <li>
                Short {symbol} perp on{" "}
                <span className="font-mono">
                  {String(best?.exchange).toLowerCase()}
                </span>{" "}
                ({fmt.pct4(best?.rate)}/h, {describeLeg(best?.rate)}).
              </li>
              <li>
                Long {symbol} perp on{" "}
                <span className="font-mono">
                  {String(worst?.exchange).toLowerCase()}
                </span>{" "}
                ({fmt.pct4(worst?.rate)}/h, {describeLeg(worst?.rate)}).
              </li>
            </ul>
            <div className="text-[9px] text-gray-500 dark:text-gray-400 mt-2">
              Net (gross) ≈ high − low = {fmt.pct4(hourlyGross)}/h.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- spread badge ---------- */

const spreadBadge = (v) => {
  if (!Number.isFinite(v)) {
    return (
      <span className="px-2 py-1 rounded-xl text-[9px] text-gray-500">
        —
      </span>
    );
  }
  const base =
    "px-2 py-1 rounded-2xl text-[9px] font-semibold font-mono inline-flex justify-center min-w-[64px]";
  if (v > 0) {
    return (
      <span className={`${base} bg-emerald-500 text-white`}>
        {fmt.pct2(v)}
      </span>
    );
  }
  if (v < 0) {
    return (
      <span className={`${base} bg-red-500 text-white`}>
        {fmt.pct2(v)}
      </span>
    );
  }
  return (
    <span className={`${base} bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}>
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
  const [viewMode, setViewMode] = useState("list");

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

  const fetchFunding = useCallback(async (isFirst = false) => {
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
  }, []);

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
    const id = window.setTimeout(
      () => setQDebounced(qRef.current),
      160
    );
    return () => window.clearTimeout(id);
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
        (i) =>
          String(i.exchange || "").toUpperCase() === "LIGHTER"
      );
      if (!lighter) continue;

      const rL = toNum(lighter.rate);
      if (!Number.isFinite(rL)) continue;

      if (hideZeros && Math.abs(rL) <= EPS) continue;

      let bestPair = null;

      for (const it of items) {
        if (
          String(it.exchange || "").toUpperCase() === "LIGHTER"
        )
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
        finiteRates.length &&
          finiteRates.every((x) => x < 0)
          ? "all-negative"
          : finiteRates.length &&
            finiteRates.every((x) => x > 0)
            ? "all-positive"
            : "mixed";

      const chipItems = items
        .filter((i) => Number.isFinite(toNum(i.rate)))
        .sort((a, b) => {
          const aIsL =
            String(a.exchange || "").toUpperCase() ===
            "LIGHTER";
          const bIsL =
            String(b.exchange || "").toUpperCase() ===
            "LIGHTER";
          if (aIsL !== bIsL) return aIsL ? -1 : 1;
          return (
            Math.abs(toNum(b.rate)) -
            Math.abs(toNum(a.rate))
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
    <div
      className="w-full text-gray-900 dark:text-gray-50"
      style={{ fontFamily: baseFont }}
    >
      {/* Header */}
      <motion.div
        className={`${cardSoft} mb-3 sm:mb-4`}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-semibold tracking-tight p-2">
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>Lighter perp funding</span>
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            ({totalSymbols})
          </span>
          {refreshing && (
            <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-emerald-500">
              <span className="h-2.5 w-2.5 rounded-full border-[2px] border-emerald-500 border-t-transparent animate-spin" />
              updating
            </span>
          )}
          <button
            className="ml-auto inline-flex items-center gap-1 rounded-2xl border border-gray-300 bg-white/80 px-2.5 py-1.5 text-[10px] text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-100 dark:hover:bg-gray-800"
            onClick={() => fetchFunding(false)}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        <div className="mt-1 text-[10px] text-gray-600 dark:text-gray-400 px-2">
          Rates normalized to{" "}
          <span className="font-semibold">per-hour</span>, comparing{" "}
          <span className="font-semibold">LIGHTER</span> vs other
          exchanges.
        </div>

        {/* Controls */}
        <div className="mt-2.5 grid grid-cols-1 lg:grid-cols-[minmax(0,2.7fr)_auto_auto] gap-2 lg:items-center px-2">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-white/80 px-2.5 dark:border-gray-700 dark:bg-gray-900">
            <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <input
              className="h-8 sm:h-9 flex-1 bg-transparent text-[11px] sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none min-w-0 dark:text-gray-100"
              placeholder="Search symbol (BTC, ETH, TAO...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Hide zeros */}
          <label className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-gray-400 bg-white/70 dark:border-gray-600 dark:bg-gray-900"
              checked={hideZeros}
              onChange={(e) => setHideZeros(e.target.checked)}
            />
            hide 0% markets
          </label>

          {/* Sort + View */}
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <select
                className="h-8 sm:h-9 rounded-2xl border border-gray-300 bg-white/85 px-2 text-[10px] sm:text-[11px] text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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
                className="inline-flex items-center gap-1 rounded-2xl border border-gray-300 bg-white/85 px-2 h-8 sm:h-9 text-[10px] sm:text-[11px] text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
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
            <div className="relative inline-flex items-center rounded-2xl border border-gray-300 bg-white/85 p-0.5 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => setViewMode("list")}
                className="relative px-3 py-1.5 text-[9px] sm:text-[10px] rounded-2xl"
              >
                {viewMode === "list" && (
                  <motion.div
                    layoutId="viewModePill"
                    className="absolute inset-0 rounded-2xl bg-emerald-400"
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                  />
                )}
                <span
                  className={
                    "relative z-10 " +
                    (viewMode === "list"
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 dark:text-gray-400")
                  }
                >
                  List
                </span>
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className="relative px-3 py-1.5 text-[9px] sm:text-[10px] rounded-2xl"
              >
                {viewMode === "cards" && (
                  <motion.div
                    layoutId="viewModePill"
                    className="absolute inset-0 rounded-2xl bg-emerald-400"
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                  />
                )}
                <span
                  className={
                    "relative z-10 " +
                    (viewMode === "cards"
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 dark:text-gray-400")
                  }
                >
                  Cards
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary + error */}
        {error && (
          <div className="mt-2 text-[10px] text-red-500 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            {error}
          </div>
        )}

        <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200 px-2 pb-2">
          <div className={`${cardTight} px-2 py-1.5 flex justify-between`}>
            <span>symbols</span>
            <span className="font-mono">{summary.total}</span>
          </div>
          <div className={`${cardTight} px-2 py-1.5 flex justify-between`}>
            <span>exchanges</span>
            <span className="font-mono">{summary.exchanges}</span>
          </div>
          <div className={`${cardTight} px-2 py-1.5 flex justify-between`}>
            <span>avg spread /h</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-300">
              {fmt.pct3(summary.avgSpread)}
            </span>
          </div>
          <div className={`${cardTight} px-2 py-1.5 flex justify-between`}>
            <span>all-neg</span>
            <span className="font-mono">{summary.allNeg}</span>
          </div>
          <div className={`${cardTight} px-2 py-1.5 flex justify-between`}>
            <span>all-pos</span>
            <span className="font-mono">{summary.allPos}</span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {initialLoading && (
        <div className={`${cardBase} p-3 text-center text-sm text-gray-600 dark:text-gray-200`}>
          Loading…
        </div>
      )}

      {!initialLoading && totalSymbols === 0 && (
        <div className={`${cardBase} p-3 text-center text-sm text-gray-600 dark:text-gray-200`}>
          No symbols match current filters.
        </div>
      )}

      {!initialLoading && totalSymbols > 0 && (
        <>
          {viewMode === "list" ? (
            /* ---------- LIST VIEW ---------- */
            <motion.div
              className={`${cardBase} overflow-hidden`}
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.01 } },
              }}
            >
              {/* Header row (desktop) */}
              <div className="hidden md:grid grid-cols-[2.7fr,2.5fr,1.1fr,1.1fr] gap-2 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900">
                <div>Ticker / exchanges</div>
                <div>(short / long)</div>
                <div>Spread APR</div>
                <div>Spread /h</div>
              </div>

              {/* Rows */}
              {grouped.map((g) => {
                const apySimple = annualizeSimple(g.spread);
                return (
                  <motion.div
                    key={g.symbol}
                    variants={{
                      hidden: { opacity: 0, y: 2 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="group border-t border-gray-100 dark:border-gray-800 last:border-b hover:bg-gray-50/80 dark:hover:bg-gray-900/80 transition-colors"
                  >
                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[2.7fr,2.5fr,1.1fr,1.1fr] gap-2 px-3 py-2.5 text-[10px] items-center">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setActiveGroup(g)}
                          className="text-[11px] font-semibold text-gray-900 hover:text-emerald-600 text-left dark:text-gray-50 dark:hover:text-emerald-300"
                        >
                          {g.symbol}
                        </button>
                        <FixedRateChipRow items={g.items} max={4} />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* short */}
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-2xl bg-red-500 text-white text-[9px]">
                            <span className="uppercase tracking-wide">
                              short
                            </span>
                            <span className="font-mono">
                              {String(g.best?.exchange).toLowerCase()}
                            </span>
                            <span className="font-mono">
                              {fmt.pct4(g.best?.rate)}/h
                            </span>
                          </div>
                          {/* long */}
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-2xl bg-emerald-500 text-slate-900 text-[9px]">
                            <span className="uppercase tracking-wide">
                              long
                            </span>
                            <span className="font-mono">
                              {String(g.worst?.exchange).toLowerCase()}
                            </span>
                            <span className="font-mono">
                              {fmt.pct4(g.worst?.rate)}/h
                            </span>
                          </div>
                        </div>
                        <div className="text-[8px] text-gray-500 dark:text-gray-400">
                          venues:{" "}
                          <span className="font-mono">{g.count}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {spreadBadge(apySimple)}
                      </div>

                      <div className="flex items-center">
                        {spreadBadge(g.spread)}
                      </div>
                    </div>

                    {/* Mobile stacked layout */}
                    <div className="md:hidden px-2.5 py-2 flex flex-col gap-1.5 text-[9px]">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => setActiveGroup(g)}
                          className="text-[10px] font-semibold text-gray-900 hover:text-emerald-600 dark:text-gray-50 dark:hover:text-emerald-300"
                        >
                          {g.symbol}
                        </button>
                        {spreadBadge(apySimple)}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-2xl bg-red-500 text-white text-[8px]">
                          <span className="uppercase">short</span>
                          <span className="font-mono">
                            {String(g.best?.exchange).toLowerCase()}
                          </span>
                          <span className="font-mono">
                            {fmt.pct4(g.best?.rate)}/h
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-2xl bg-emerald-500 text-slate-900 text-[8px]">
                          <span className="uppercase">long</span>
                          <span className="font-mono">
                            {String(g.worst?.exchange).toLowerCase()}
                          </span>
                          <span className="font-mono">
                            {fmt.pct4(g.worst?.rate)}/h
                          </span>
                        </div>
                      </div>

                      <FixedRateChipRow items={g.items} max={3} />

                      <div className="flex justify-between text-[8px] text-gray-500 dark:text-gray-400">
                        <span>Δ/h {fmt.pct4(g.spread)}</span>
                        <span>best {fmt.pct4(g.max)}/h</span>
                        <span>worst {fmt.pct4(g.min)}/h</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* ---------- CARDS VIEW ---------- */
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5"
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
                const showToggle = g.items.length > previewCount;
                const visible = opened
                  ? g.items
                  : g.items.slice(0, previewCount);
                const apySimple = annualizeSimple(g.spread);

                return (
                  <motion.div
                    key={g.symbol}
                    variants={{
                      hidden: { opacity: 0, y: 2 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -1 }}
                    className={`${cardBase} p-3 sm:p-3.5 flex flex-col gap-2`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-base sm:text-lg font-semibold leading-tight">
                          {g.symbol}
                        </div>
                        <div className="mt-0.5 text-[9px] text-gray-600 dark:text-gray-400">
                          spread{" "}
                          <span className="font-mono text-emerald-600 dark:text-emerald-300">
                            {fmt.pct4(g.spread)}
                          </span>
                          /h · venues{" "}
                          <span className="font-mono">{g.count}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveGroup(g)}
                        className="inline-flex items-center gap-1 rounded-2xl bg-emerald-400 text-gray-900 px-2.5 py-1 text-[9px] font-semibold hover:bg-emerald-300"
                      >
                        <Percent className="h-3 w-3" />
                        details
                        <span className="font-mono">
                          {fmt.pct2(apySimple)}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* short */}
                      <div className="rounded-2xl bg-red-500 text-white px-2.5 py-1.5">
                        <div className="text-[8px] uppercase tracking-wide">
                          short on
                        </div>
                        <div className="font-mono text-[10px] mt-0.5">
                          {String(g.best?.exchange).toLowerCase()}
                        </div>
                        <div className="text-[9px] mt-0.5">
                          {fmt.pct4(g.best?.rate)}/h
                        </div>
                      </div>
                      {/* long */}
                      <div className="rounded-2xl bg-emerald-500 text-gray-900 px-2.5 py-1.5">
                        <div className="text-[8px] uppercase tracking-wide">
                          long on
                        </div>
                        <div className="font-mono text-[10px] mt-0.5">
                          {String(g.worst?.exchange).toLowerCase()}
                        </div>
                        <div className="text-[9px] mt-0.5">
                          {fmt.pct4(g.worst?.rate)}/h
                        </div>
                      </div>
                    </div>

                    <div>
                      <ZeroAnchorBar min={g.min} max={g.max} />
                      <div className="mt-1 grid grid-cols-3 text-[8px] text-gray-500 dark:text-gray-400">
                        <div>min {fmt.pct4(g.min)}/h</div>
                        <div className="text-center">0%/h</div>
                        <div className="text-right">
                          max {fmt.pct4(g.max)}/h
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
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

                    {showToggle && (
                      <button
                        className="mt-1 inline-flex items-center gap-1 self-start text-[8px] rounded-2xl border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
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
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {activeGroup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGroup(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              className={`${cardBase} relative w-full max-w-2xl`}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
                <div>
                  <div className="text-[8px] uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                    arbitrage opportunity
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                    {activeGroup.symbol}
                  </div>
                </div>
                <button
                  className="rounded-xl p-1.5 hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300"
                  onClick={() => setActiveGroup(null)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
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

      <div className="mt-2 text-[8px] sm:text-[9px] text-gray-500 dark:text-gray-400">
        All values are indicative only and exclude fees, schedule
        misalignments, leg risk, and operational constraints.
      </div>
    </div>
  );
}
