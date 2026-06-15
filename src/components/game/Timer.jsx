

export default function Timer({ timeRemaining }) {
  const percentage = (timeRemaining / 30) * 100;
  const isLow = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  return (
    <div className={`timer ${isLow ? 'timer-low' : ''} ${isCritical ? 'timer-critical' : ''}`}>
      <div className="timer-bar">
        <div className="timer-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="timer-text">{timeRemaining}s</span>
    </div>
  );
}
