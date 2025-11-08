import { useState } from "react";
import { API_BASE } from "../api";

export default function Settings() {
  const [apiBase, setApiBase] = useState(API_BASE);
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <div>
        <div style={{ fontWeight: 700 }}>Backend URL</div>
        <input style={{ width: '100%', padding: 8 }} value={apiBase} onChange={(e) => setApiBase(e.target.value)} />
        <div style={{ color: '#666', fontSize: 12 }}>Set VITE_API_BASE in frontend .env to persist.</div>
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>About</div>
        <p>Demo app for on-chain metrics + real-time notifications via Socket.IO.</p>
      </div>
    </div>
  );
}
