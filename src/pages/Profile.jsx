import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getRank, getNextRank, getRankProgress, ACHIEVEMENTS } from '../lib/scoring';
import { validateUsername, sanitizeFirebaseError } from '../lib/security';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';
import { Zap, Edit2, Check, X, User, Type } from 'lucide-react';
import '../styles/profile.css';

export default function Profile() {
  const { profile, isAuthenticated, isGuest, updateProfile, user } = useAuth();
  const { totalScore, streak, bestStreak, gamesPlayed, correctGuesses, achievements } = useGame();

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const rank = getRank(totalScore);
  const nextRank = getNextRank(totalScore);
  const progress = getRankProgress(totalScore);
  const accuracy = gamesPlayed > 0 ? Math.round((correctGuesses / gamesPlayed) * 100) : 0;

  const startEditing = () => {
    setEditDisplayName(profile?.display_name || '');
    setEditUsername(profile?.username || '');
    setEditErrors({});
    setSaveError('');
    setSaveSuccess(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditErrors({});
    setSaveError('');
  };

  const handleSave = async () => {
    const errors = {};

    // Validate display name
    const trimmedName = editDisplayName.trim();
    if (!trimmedName) {
      errors.display_name = 'Display name is required';
    } else if (trimmedName.length > 50) {
      errors.display_name = 'Display name must be 50 characters or less';
    }

    // Validate username
    const usernameResult = validateUsername(editUsername);
    if (!usernameResult.valid) {
      errors.username = usernameResult.error;
    }

    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError('');
    try {
      await updateProfile({
        display_name: trimmedName,
        username: editUsername.trim(),
      });
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(sanitizeFirebaseError(err));
    } finally {
      setSaving(false);
    }
  };

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
        {/* Success Toast */}
        {saveSuccess && (
          <div className="profile-toast">
            <Check size={16} />
            Profile updated successfully
          </div>
        )}

        {/* Header Card */}
        <Card className="profile-header-card" padding="lg">
          <div className="profile-header">
            <Avatar name={profile?.display_name || 'Player'} size={72} />
            <div className="profile-header-info">
              {editing ? (
                <div className="profile-edit-form">
                  <Input
                    label="Display Name"
                    icon={<Type size={16} />}
                    value={editDisplayName}
                    onChange={(e) => { setEditDisplayName(e.target.value); setEditErrors(prev => ({ ...prev, display_name: undefined })); }}
                    error={editErrors.display_name}
                    maxLength={50}
                    placeholder="Your display name"
                  />
                  <Input
                    label="Username"
                    icon={<User size={16} />}
                    value={editUsername}
                    onChange={(e) => { setEditUsername(e.target.value); setEditErrors(prev => ({ ...prev, username: undefined })); }}
                    error={editErrors.username}
                    maxLength={20}
                    placeholder="your_username"
                  />
                  {saveError && <div className="profile-edit-error">{saveError}</div>}
                  <div className="profile-edit-actions">
                    <Button variant="primary" size="sm" onClick={handleSave} loading={saving} icon={<Check size={14} />}>
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEditing} icon={<X size={14} />}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="profile-name">{profile?.display_name || 'Player'}</h1>
                  <span className="body-sm text-secondary">@{profile?.username || 'anonymous'}</span>
                  <div className="profile-rank-row">
                    <Badge variant="gold" size="md" style={{ borderColor: rank.color, color: rank.color }}>
                      {rank.name}
                    </Badge>
                    {isGuest && <Badge variant="default" size="sm">Guest</Badge>}
                  </div>
                </>
              )}
            </div>
            <div className="profile-header-right">
              <div className="profile-header-score">
                <div className="profile-total-score">{totalScore.toLocaleString()}</div>
                <div className="body-sm text-secondary">Total Score</div>
              </div>
              {!editing && !isGuest && (
                <button className="profile-edit-btn" onClick={startEditing} title="Edit Profile">
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Account Info (non-edit view) */}
          {!editing && (
            <div className="profile-account-info">
              <div className="profile-info-item">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{user?.email || 'Guest account'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Member since</span>
                <span className="profile-info-value">
                  {profile?.created_at?.toDate
                    ? profile.created_at.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : profile?.created_at instanceof Date
                      ? profile.created_at.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : 'Unknown'}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Account type</span>
                <span className="profile-info-value">{isGuest ? 'Guest' : 'Registered'}</span>
              </div>
            </div>
          )}

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
