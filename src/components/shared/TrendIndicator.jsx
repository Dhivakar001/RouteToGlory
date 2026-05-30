export default function TrendIndicator({ value }) {
  if (value > 0) return <span className="trend trend-up">▲ {value}</span>;
  if (value < 0) return <span className="trend trend-down">▼ {Math.abs(value)}</span>;
  return <span className="trend trend-neutral">● 0</span>;
}
