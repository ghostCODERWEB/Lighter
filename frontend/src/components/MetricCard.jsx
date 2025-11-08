export default function MetricCard({ title, value, hint }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, minWidth: 220 }}>
      <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value ?? '—'}</div>
      {hint && <div style={{ fontSize: 12, color: '#999' }}>{hint}</div>}
    </div>
  );
}
