import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getRank, getNextRank, getRankProgress, ACHIEVEMENTS } from '../lib/scoring';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import '../styles/profile.css';

export default function Profile() {
  const { profile, isAuthenticated, isGuest } = useAuth();
  const { totalScore, streak, bestStreak, gamesPlayed, correctGuesses, achievements } = useGame();

  const rank = getRank(totalScore);
  const nextRank = getNextRank(totalScore);
  const progress = getRankProgress(totalScore);
  const accuracy = gamesPlayed > 0 ? Math.round((correctGuesses / gamesPlayed) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-empty">
            <h2>Sign in to view your profile</h2>
            <p className="text-secondary">Track your stats, achievements, and ranking.</p>
            <Link to="/auth"><Button variant="primary" size="lg">Sign In</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header Card */}
        <Card className="profile-header-card" padding="lg">
          <div className="profile-header">
            <Avatar name={profile?.display_name || 'Player'} size={72} />
            <div className="profile-header-info">
              <h1 className="profile-name">{profile?.display_name || 'Player'}</h1>
              <span className="body-sm text-secondary">@{profile?.username || 'anonymous'}</span>
              <div className="profile-rank-row">
                <Badge variant="gold" size="md" style={{ borderColor: rank.color, color: rank.color }}>
                  {rank.name}
                </Badge>
                {isGuest && <Badge variant="default" size="sm">Guest</Badge>}
              </div>
            </div>
            <div className="profile-header-score">
              <div className="profile-total-score">{totalScore.toLocaleString()}</div>
              <div className="body-sm text-secondary">Total Score</div>
            </div>
          </div>

          {/* Rank Progress */}
          {nextRank && (
            <div className="profile-rank-progress">
              <div className="profile-rank-labels">
                <span className="body-sm" style={{ color: rank.color }}>{rank.name}</span>
                <span className="body-sm" style={{ color: nextRank.color }}>{nextRank.name}</span>
              </div>
              <div className="profile-progress-bar">
                <div className="profile-progress-fill" style={{ width: `${progress}%`, background: rank.color }} />
              </div>
              <span className="caption text-secondary">{nextRank.minScore - totalScore} points to next rank</span>
            </div>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-4 profile-stats">
          <StatCard icon="🔥" value={streak} label="Current Streak" />
          <StatCard icon="⭐" value={bestStreak} label="Best Streak" />
          <StatCard icon="🎯" value={`${accuracy}%`} label="Accuracy" />
          <StatCard icon="🎮" value={gamesPlayed} label="Games Played" />
        </div>

        {/* Achievements */}
        <div className="profile-section">
          <h2 className="h3">Achievements</h2>
          <p className="body-sm text-secondary" style={{ marginBottom: 20 }}>
            {achievements.length}/{ACHIEVEMENTS.length} unlocked
          </p>
          <div className="achievements-grid">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = achievements.some(a => a.id === ach.id);
              return (
                <div key={ach.id} className={`achievement-card ${unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}>
                  <div className="achievement-icon">{ach.icon}</div>
                  <div className="achievement-info">
                    <span className="achievement-name">{ach.name}</span>
                    <span className="achievement-desc">{ach.description}</span>
                  </div>
                  {unlocked && <span className="achievement-check">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="profile-cta">
          <Link to="/play">
            <Button variant="gold" size="lg" icon={<Zap size={18} />}>Keep Playing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
