import { useState } from "react";
import { api } from "../api";
import MetricCard from "../components/MetricCard.jsx";

export default function Pools() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  const lookup = async () => {
    setErr(null); setResult(null);
    try {
      const { data } = await api.get(`/metrics/erc20/${address}`);
      setResult(data);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <input
          style={{ padding: 8, width: 420 }}
          placeholder="ERC20 contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button style={{ marginLeft: 8 }} onClick={lookup}>Fetch</button>
      </div>

      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      {result && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <MetricCard title="Symbol" value={result.symbol} />
          <MetricCard title="Decimals" value={result.decimals} />
          <MetricCard title="Total Supply" value={result.totalSupply} />
        </div>
      )}
    </div>
  );
}
