import { useEffect, useMemo, useState } from "react";
import { Percent, Coins, SlidersHorizontal, CalendarDays, Calculator, DollarSign } from "lucide-react";

// --- Helpers
const fmtInt = (n) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.max(0, Math.floor(Number(n) || 0)));
const fmtUSD = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 1 }).format(Number(n) || 0);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const fmtDate = (d) => d instanceof Date && !isNaN(d) ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// Reference points
const JAN_1_2025 = new Date(Date.UTC(2025, 0, 1));
const FIRST_FRIDAY_2025 = new Date(Date.UTC(2025, 0, 3));
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const PER_FRIDAY_POINTS = 250_000;

export default function PointsCalculator() {
    const [myPoints, setMyPoints] = useState("");
    const [fdv, setFdv] = useState(3_000_000_000);
    const [airdropPct, setAirdropPct] = useState(25);
    const [totalPoints, setTotalPoints] = useState(0);

    const myPointsNum = useMemo(() => {
        const n = parseFloat(String(myPoints).replace(/,/g, ''));
        return Number.isFinite(n) ? Math.max(0, n) : 0;
    }, [myPoints]);

    const todayUTC = useMemo(() => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }, []);

    // Weeks since Jan 1 (kept for reference if you want it elsewhere)
    const weeksSinceJan1 = useMemo(() => {
        const diff = todayUTC - JAN_1_2025;
        return diff > 0 ? Math.floor(diff / WEEK_MS) : 0;
    }, [todayUTC]);

    // Friday distributions elapsed
    const fridaysElapsed = useMemo(() => {
        if (todayUTC < FIRST_FRIDAY_2025) return 0;
        const diff = todayUTC - FIRST_FRIDAY_2025;
        return Math.floor(diff / WEEK_MS) + 1;
    }, [todayUTC]);

    const distributedPointsSoFar = useMemo(() => fridaysElapsed * PER_FRIDAY_POINTS, [fridaysElapsed]);

    useEffect(() => {
        setTotalPoints((prev) => (prev === 0 ? distributedPointsSoFar : prev));
    }, [distributedPointsSoFar]);

    const snapshotIndex = useMemo(() => {
        const tp = Math.max(0, Number(totalPoints) || 0);
        return tp === 0 ? 0 : Math.ceil(tp / PER_FRIDAY_POINTS);
    }, [totalPoints]);

    const snapshotDate = useMemo(() => {
        if (snapshotIndex <= 0) return null;
        return new Date(FIRST_FRIDAY_2025.getTime() + (snapshotIndex - 1) * WEEK_MS);
    }, [snapshotIndex]);

    const myShare = useMemo(() => {
        const tp = Number(totalPoints) || 0;
        const mp = Math.max(0, myPointsNum);
        return tp > 0 ? mp / tp : 0;
    }, [myPointsNum, totalPoints]);

    const airdropPoolUSD = useMemo(() => (Number(fdv) || 0) * (Number(airdropPct) || 0) / 100, [fdv, airdropPct]);
    const myAirdropUSD = useMemo(() => myShare * airdropPoolUSD, [myShare, airdropPoolUSD]);

    const pricePerPoint = useMemo(() => {
        const tp = Number(totalPoints) || 0;
        return tp > 0 ? airdropPoolUSD / tp : 0;
    }, [airdropPoolUSD, totalPoints]);

    return (
        <section className="space-y-6">
            {/* Consolidated distributions card */}
            <div className="grid gap-3">
                <Card>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            <CalendarDays className="h-4 w-4" /> Distributions since Jan 1, 2025
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold font-mono">
                            {fmtInt(fridaysElapsed)}
                            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">Fridays • {fmtInt(distributedPointsSoFar)} pts</span>
                        </div>
                    </div>

                    <NextDistribution todayUTC={todayUTC} />

                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{fmtInt(PER_FRIDAY_POINTS)} pts distributed each Friday</div>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <div className="grid gap-3">
                        <NumberField label="My points" value={myPoints} onChange={setMyPoints} allowEmpty />

                        <SliderField
                            label="Total points"
                            icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
                            min={distributedPointsSoFar}
                            max={15_000_000}
                            step={250_000}
                            value={totalPoints}
                            onChange={(v) => setTotalPoints(clamp(v, distributedPointsSoFar, 15_000_000))}
                            valueRender={(v) => fmtInt(v)}
                        />
                        <div className="-mt-1 text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>Snapshot: <b>{fmtDate(snapshotDate)}</b> (Friday #{snapshotIndex})</span>
                        </div>

                        <SliderField
                            label="FDV (Fully Diluted Valuation)"
                            icon={<Coins className="h-3.5 w-3.5" />}
                            min={1_000_000_000}
                            max={10_000_000_000}
                            step={50_000_000}
                            value={fdv}
                            onChange={setFdv}
                            valueRender={(v) => fmtUSD(v)}
                        />

                        <SliderField
                            label="Airdrop allocation (%)"
                            icon={<Percent className="h-3.5 w-3.5" />}
                            min={10}
                            max={50}
                            step={1}
                            value={airdropPct}
                            onChange={setAirdropPct}
                            valueRender={(v) => `${v.toFixed(1)}%`}
                        />
                    </div>
                </Card>

                <Card>
                    <div className="grid gap-3">
                        <Row label="My points" value={fmtInt(myPointsNum)} />
                        <Row label="Total points" value={fmtInt(totalPoints)} />
                        <Row label="My share" value={`${(myShare * 100).toFixed(1)}%`} />
                        <Row label="Airdrop pool (USD)" value={fmtUSD(airdropPoolUSD)} />
                        <Row label={<span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />Price per point</span>} value={fmtUSD(pricePerPoint)} />
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <Row label={<span className="font-semibold">Estimated airdrop (USD)</span>} value={<span className="font-semibold">{fmtUSD(myAirdropUSD)}</span>} big />
                    </div>
                </Card>
            </div>

            {/* Optional hint row */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
                Weeks since Jan 1, 2025: <b>{fmtInt(weeksSinceJan1)}</b>
            </div>
        </section>
    );
}

function NextDistribution({ todayUTC }) {
    const DAY_MS = 24 * 60 * 60 * 1000;
    const dow = todayUTC.getUTCDay(); // 0=Sun, 5=Fri
    const daysSinceFriday = (dow - 5 + 7) % 7;
    const daysToNext = (7 - daysSinceFriday) % 7; // 0 if today is Friday
    const lastFriday = new Date(todayUTC.getTime() - daysSinceFriday * DAY_MS);
    const nextFriday = new Date(todayUTC.getTime() + daysToNext * DAY_MS);

    const progress = useMemo(() => {
        const since = (todayUTC - lastFriday) / DAY_MS; // 0..6
        return Math.max(0, Math.min(1, since / 7));
    }, [todayUTC, lastFriday]);

    return (
        <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600 dark:text-gray-300">
                    Next: <b>{fmtDate(nextFriday)}</b>
                    {daysToNext ? ` (in ${daysToNext}d)` : " (today)"}
                </div>
                <div className="text-gray-500">Week progress</div>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="h-full bg-blue-500/70" style={{ width: `${(progress * 100).toFixed(0)}%` }} />
            </div>
        </div>
    );
}

function Card({ children, className = "" }) {
    return (
        <div className={"rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white/70 dark:bg-gray-800/70 shadow-sm " + className}>
            {children}
        </div>
    );
}

function Row({ label, value, big = false }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400">{label}</div>
            <div className={"font-mono " + (big ? "text-xl" : "")}>{value}</div>
        </div>
    );
}

function NumberField({ label, value, onChange }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
            <input
                type="text"
                inputMode="decimal"
                value={value}
                placeholder="e.g. 42069"
                onChange={(e) => onChange(e.target.value)}
                className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-900/40 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
        </label>
    );
}

function SliderField({ label, icon, min, max, step, value, onChange, valueRender }) {
    return (
        <label className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {icon} <span>{label}</span>
                <span className="ml-auto font-mono text-gray-700 dark:text-gray-200">{valueRender ? valueRender(value) : value.toFixed(1)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="accent-blue-600"
            />
        </label>
    );
}