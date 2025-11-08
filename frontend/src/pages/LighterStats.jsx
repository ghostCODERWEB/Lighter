// src/pages/LighterStats.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, BarChart, Bar, Legend
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const POLL_MS = 1; // 10 seconds

function classNames(...arr) { return arr.filter(Boolean).join(" "); }
function pretty(num, digits = 2) {
    if (!Number.isFinite(num)) return "—";
    const abs = Math.abs(num);
    if (abs >= 1_000_000_000) return (num / 1_000_000_000).toFixed(digits) + "B";
    if (abs >= 1_000_000) return (num / 1_000_000).toFixed(digits) + "M";
    if (abs >= 1_000) return (num / 1_000).toFixed(digits) + "K";
    return num.toFixed(digits);
}
function ymd(tsMs) {
    const d = new Date(tsMs);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function timeAgo(ms) {
    if (!ms) return "—";
    const diff = Date.now() - ms;
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

export default function LighterStats() {
    const [summary, setSummary] = useState({
        totals_24h: { maker: 0, taker: 0, total: 0 },
        approx_year_revenue: 0,
        updated_at: 0,
    });
    const [events, setEvents] = useState([]); // [{ts, maker_fee, taker_fee, total, market_id, tx_hash, trade_id}]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Poll every 10s
    useEffect(() => {
        let timer;
        let abort = new AbortController();

        const fetchAll = async () => {
            try {
                setError("");
                const [sRes, eRes] = await Promise.all([
                    fetch(`${API_BASE}/api/fees/onchain/summary`, { signal: abort.signal }),
                    fetch(`${API_BASE}/api/fees/onchain/txs`, { signal: abort.signal }),
                ]);
                if (!sRes.ok || !eRes.ok) throw new Error(`HTTP ${sRes.status}/${eRes.status}`);
                const sJson = await sRes.json();
                const eJson = await eRes.json();
                setSummary(sJson);
                setEvents(Array.isArray(eJson) ? eJson : []);
                setLoading(false);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Request failed");
                    setLoading(false);
                }
            }
        };

        fetchAll();
        timer = setInterval(fetchAll, POLL_MS);
        return () => { clearInterval(timer); abort.abort(); };
    }, []);

    // Daily series (backend already scaled to USDC)
    const revenueByDay = useMemo(() => {
        const map = new Map();
        for (const e of events) {
            const day = ymd(e.ts);
            map.set(day, (map.get(day) || 0) + (Number(e.total) || 0));
        }
        return Array.from(map.entries())
            .map(([day, revenue]) => ({ day, revenue }))
            .sort((a, b) => a.day.localeCompare(b.day));
    }, [events]);

    // Per-market
    const perMarket = useMemo(() => {
        const map = new Map();
        for (const e of events) {
            const m = String(e.market_id ?? -1);
            const cur = map.get(m) || { market: m, maker: 0, taker: 0, total: 0 };
            cur.maker += Number(e.maker_fee) || 0;
            cur.taker += Number(e.taker_fee) || 0;
            cur.total += Number(e.total) || 0;
            map.set(m, cur);
        }
        return Array.from(map.values()).sort((a, b) => Number(a.market) - Number(b.market));
    }, [events]);

    const recentWithFees = useMemo(
        () => events.filter(e => (e.maker_fee || e.taker_fee)).sort((a, b) => b.ts - a.ts).slice(0, 100),
        [events]
    );

    const totals24h = summary.totals_24h || { maker: 0, taker: 0, total: 0 };
    const projection1Y = summary.approx_year_revenue || 0;
    const lastUpdatedAbs = summary.updated_at ? new Date(summary.updated_at).toLocaleString() : "—";
    const lastUpdatedRel = timeAgo(summary.updated_at);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Lighter Fees & Revenue (All Markets)
                    </h1>
                    <span
                        className={classNames(
                            "px-3 py-1 rounded-full text-sm",
                            loading && "bg-amber-600/20 text-amber-300 ring-1 ring-amber-600/40",
                            !loading && !error && "bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-600/40",
                            !!error && "bg-rose-700/30 text-rose-200 ring-1 ring-rose-700/50"
                        )}
                    >
                        {loading ? "loading..." : error ? "error" : "live"}
                    </span>
                </header>

                {/* Meta */}
                <div className="text-xs text-slate-400">
                    Updated: <span className="text-slate-200">{lastUpdatedAbs}</span>
                    {" "}(<span className="text-slate-300">{lastUpdatedRel}</span>) · Poll: {POLL_MS / 1000}s
                    {error ? <span className="text-rose-300 ml-2">({error})</span> : null}
                </div>

                {/* KPIs */}
                <section className="grid md:grid-cols-4 gap-4">
                    <KPI title="24h Total Revenue" value={`$${pretty(totals24h.total, 2)}`} />
                    <KPI title="24h Maker Fees" value={`$${pretty(totals24h.maker, 2)}`} />
                    <KPI title="24h Taker Fees" value={`$${pretty(totals24h.taker, 2)}`} />
                    <KPI title="Projected 1Y" value={`$${pretty(projection1Y, 2)}`} />
                </section>

                {/* Revenue Over Time */}
                <section className="bg-slate-900/60 rounded-2xl p-4 ring-1 ring-slate-800">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Revenue by Day (UTC)</h2>
                    </div>
                    <div className="h-64 w-full min-w-0">
                        {revenueByDay.length === 0 ? (
                            <EmptyChartNote label="No revenue points yet (24–48h window). Waiting for fee-bearing trades…" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%" debounce={200}>
                                <LineChart data={revenueByDay} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
                                    <XAxis dataKey="day" tick={{ fontSize: 12 }} angle={-10} height={40} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" name="Revenue" dot={false} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </section>

                {/* Per-Market Breakdown */}
                <section className="bg-slate-900/60 rounded-2xl p-4 ring-1 ring-slate-800">
                    <h2 className="text-lg font-semibold mb-3">Revenue by Market</h2>
                    <div className="h-64 w-full min-w-0">
                        {perMarket.length === 0 ? (
                            <EmptyChartNote label="No markets with fees yet." />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%" debounce={200}>
                                <BarChart data={perMarket} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
                                    <XAxis dataKey="market" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" name="Total" />
                                    <Bar dataKey="maker" name="Maker" />
                                    <Bar dataKey="taker" name="Taker" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </section>

                {/* Recent fee-bearing transactions */}
                <section className="bg-slate-900/60 rounded-2xl p-4 ring-1 ring-slate-800">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Recent Fee-Bearing Transactions</h2>
                        <div className="text-xs text-slate-400">Showing last {recentWithFees.length}</div>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-slate-300">
                                <tr className="text-left">
                                    <th className="py-2 pr-4">Time (UTC)</th>
                                    <th className="py-2 pr-4">Market</th>
                                    <th className="py-2 pr-4">Maker Fee</th>
                                    <th className="py-2 pr-4">Taker Fee</th>
                                    <th className="py-2 pr-4">Total Fee</th>
                                    <th className="py-2 pr-4">Tx Hash</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {recentWithFees.map((e, i) => {
                                    const ts = new Date(e.ts).toISOString().replace(".000Z", "Z");
                                    return (
                                        <tr key={`${e.tx_hash}-${i}`} className="hover:bg-slate-800/30">
                                            <td className="py-2 pr-4 whitespace-nowrap">{ts}</td>
                                            <td className="py-2 pr-4">{e.market_id}</td>
                                            <td className="py-2 pr-4">${(e.maker_fee || 0).toFixed(6)}</td>
                                            <td className="py-2 pr-4">${(e.taker_fee || 0).toFixed(6)}</td>
                                            <td className="py-2 pr-4 font-medium">${(e.total || 0).toFixed(6)}</td>
                                            <td className="py-2 pr-4 truncate max-w-[220px]">{e.tx_hash}</td>
                                        </tr>
                                    );
                                })}
                                {recentWithFees.length === 0 && (
                                    <tr><td colSpan={6} className="py-4 text-center text-slate-500">No fee-bearing transactions yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Help / Notes */}
                <section className="text-sm text-slate-400">
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Reads from <code>/api/fees/onchain/summary</code> and <code>/api/fees/onchain/txs</code>.</li>
                        <li>Fees are already scaled in the backend (no divisor here).</li>
                        <li>Projection = 24h total × 365 (simple estimate).</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

function KPI({ title, value }) {
    return (
        <div className="bg-slate-900/60 rounded-2xl p-4 ring-1 ring-slate-800">
            <div className="text-slate-400 text-xs uppercase tracking-wide">{title}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function EmptyChartNote({ label }) {
    return (
        <div className="h-full w-full grid place-items-center text-slate-400 text-sm">
            {label}
        </div>
    );
}
