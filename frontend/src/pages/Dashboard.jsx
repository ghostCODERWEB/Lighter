import { useEffect, useState } from "react";
import { api } from "../api";
import MetricCard from "../components/MetricCard.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/metrics/overview")
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: 'crimson' }}>{error}</div>;

  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      <MetricCard title="Network" value={`${data.network.name} (#${data.network.chainId})`} />
      <MetricCard title="Uniswap V2 Pairs" value={data.dex.uniswapV2Pairs} />
      <MetricCard title="USDC Total Supply" value={Number(data.tokens.USDC.totalSupply) / 1e6} hint="Raw on-chain" />
      <MetricCard title="Last Updated" value={new Date(data.lastUpdated).toLocaleString()} />
    </div>
  );
}
