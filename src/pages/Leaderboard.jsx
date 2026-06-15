import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import TrendIndicator from '../components/shared/TrendIndicator';
import Avatar from '../components/ui/Avatar';
import '../styles/leaderboard.css';

const PERIODS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'alltime', label: 'All Time' },
];

const MOCK_DATA = [
  { rank: 1, name: 'CR7Fanatic', score: 4200, streak: 28, games: 89, trend: 3 },
  { rank: 2, name: 'GoalMachine', score: 3850, streak: 21, games: 76, trend: 1 },
  { rank: 3, name: 'TikiTaka99', score: 3600, streak: 18, games: 82, trend: -1 },
  { rank: 4, name: 'PitchMaster', score: 3100, streak: 15, games: 65, trend: 2 },
  { rank: 5, name: 'LeoTheGoat', score: 2900, streak: 12, games: 71, trend: 0 },
  { rank: 6, name: 'MidfielderMaestro', score: 2750, streak: 11, games: 68, trend: -2 },
  { rank: 7, name: 'VivaFutbol', score: 2600, streak: 9, games: 55, trend: 4 },
  { rank: 8, name: 'DefendersDen', score: 2400, streak: 8, games: 52, trend: 1 },
  { rank: 9, name: 'StrikerElite', score: 2200, streak: 7, games: 48, trend: -1 },
  { rank: 10, name: 'KeeperKing', score: 2000, streak: 6, games: 44, trend: 0 },
];

export default function Leaderboard() {
  const [period, setPeriod] = useState('weekly');

  const top3 = MOCK_DATA.slice(0, 3);
  const rest = MOCK_DATA.slice(3);

  return (
    <div className="lb-page">
      <div className="container">
        <div className="lb-header">
          <h1>Leaderboard</h1>
          <p className="body text-secondary">See how you rank against the best football minds.</p>
        </div>

        <Tabs tabs={PERIODS} activeTab={period} onChange={setPeriod} className="lb-tabs" />

        {/* Top 3 Podium */}
        <div className="podium">
          {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry) => (
            <div key={entry.rank} className={`podium-card podium-${entry.rank}`}>
              <div className={`podium-rank-badge podium-rank-${entry.rank}`}>{entry.rank}</div>
              <Avatar name={entry.name} size={entry.rank === 1 ? 64 : 52} />
              <div className="podium-name">{entry.name}</div>
              <div className="podium-score">{entry.score.toLocaleString()}</div>
              <div className="podium-meta">
                <span>🔥 {entry.streak}</span>
                <span>{entry.games} games</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <Card padding="none" className="lb-table-card">
          <table className="lb-full-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Best Streak</th>
                <th>Games</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry) => (
                <tr key={entry.rank}>
                  <td><span className="lb-rank-num">{entry.rank}</span></td>
                  <td>
                    <div className="lb-player-cell">
                      <Avatar name={entry.name} size={32} />
                      <span className="lb-player-name">{entry.name}</span>
                    </div>
                  </td>
                  <td className="mono">{entry.score.toLocaleString()}</td>
                  <td>🔥 {entry.streak}</td>
                  <td>{entry.games}</td>
                  <td><TrendIndicator value={entry.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
