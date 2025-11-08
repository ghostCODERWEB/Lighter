import { useEffect, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/notifications/history").then((r) => setItems(r.data.items || []));
  }, []);

  useEffect(() => {
    const onNote = (n) => setItems((prev) => [n, ...prev].slice(0, 200));
    socket.on("notification", onNote);
    return () => socket.off("notification", onNote);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.length === 0 && <div>No notifications yet. Triggers will appear here.</div>}
      {items.map((n) => (
        <div key={n.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, color: '#666' }}>{new Date(n.time).toLocaleString()}</div>
          <div style={{ fontWeight: 700 }}>{n.title}</div>
          <div>{n.body}</div>
        </div>
      ))}
    </div>
  );
}
