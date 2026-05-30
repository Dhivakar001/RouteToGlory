export default function StreakTracker({ streak, bestStreak }) {
  return (
    <div className="streak-tracker">
      <div className="streak-current">
        <span className="streak-fire">{streak > 0 ? '🔥' : '💤'}</span>
        <div>
          <span className="streak-value">{streak}</span>
          <span className="streak-label">Streak</span>
        </div>
      </div>
      <div className="streak-best">
        <span className="streak-label">Best</span>
        <span className="streak-best-value">{bestStreak}</span>
      </div>
    </div>
  );
}
