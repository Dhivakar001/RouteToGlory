export default function Skeleton({ width, height = '20px', radius = 'var(--radius-sm)', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height, borderRadius: radius }}
    />
  );
}
