export default function StatCard({ label, value, icon, trend, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {trend !== undefined && (
        <div className={`stat-card-trend ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : ''}`}>
          {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
