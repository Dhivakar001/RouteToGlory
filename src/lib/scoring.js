/* ─── Score Calculation ────────────────── */

export function calculateScore(hintsUsed, mode, timeRemaining) {
  let baseScore;

  switch (hintsUsed) {
    case 0: baseScore = 100; break;
    case 1: baseScore = 75; break;
    case 2: baseScore = 50; break;
    default: baseScore = 25; break;
  }

  // Hardcore mode bonus
  if (mode === 'hardcore') {
    baseScore = Math.round(baseScore * 1.5);
  }

  // Time Attack bonus
  if (mode === 'timeAttack' && timeRemaining > 0) {
    baseScore += Math.round(timeRemaining * 2);
  }

  return baseScore;
}

/* ─── Achievement Definitions ─────────── */

export const ACHIEVEMENTS = [
  {
    id: 'first_guess',
    name: 'First Touch',
    description: 'Make your first correct guess',
    icon: '⚽',
    requirement: { type: 'correctGuesses', value: 1 },
  },
  {
    id: 'streak_3',
    name: 'Hat Trick',
    description: 'Get a streak of 3',
    icon: '🎩',
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    description: 'Get a streak of 5',
    icon: '🔥',
    requirement: { type: 'streak', value: 5 },
  },
  {
    id: 'streak_10',
    name: 'Unstoppable',
    description: 'Get a streak of 10',
    icon: '💎',
    requirement: { type: 'streak', value: 10 },
  },
  {
    id: 'games_10',
    name: 'Getting Started',
    description: 'Play 10 games',
    icon: '🎮',
    requirement: { type: 'gamesPlayed', value: 10 },
  },
  {
    id: 'games_50',
    name: 'Dedicated Fan',
    description: 'Play 50 games',
    icon: '⭐',
    requirement: { type: 'gamesPlayed', value: 50 },
  },
  {
    id: 'games_100',
    name: 'Football Encyclopaedia',
    description: 'Play 100 games',
    icon: '📚',
    requirement: { type: 'gamesPlayed', value: 100 },
  },
  {
    id: 'score_500',
    name: 'Rising Star',
    description: 'Score 500 total points',
    icon: '🌟',
    requirement: { type: 'totalScore', value: 500 },
  },
  {
    id: 'score_2000',
    name: 'World Class',
    description: 'Score 2000 total points',
    icon: '🏅',
    requirement: { type: 'totalScore', value: 2000 },
  },
  {
    id: 'score_5000',
    name: 'Ballon d\'Or',
    description: 'Score 5000 total points',
    icon: '🏆',
    requirement: { type: 'totalScore', value: 5000 },
  },
  {
    id: 'perfect_10',
    name: 'Perfect 10',
    description: '10 correct guesses without hints',
    icon: '💯',
    requirement: { type: 'correctGuesses', value: 10 },
  },
];

/* ─── Achievement Checker ─────────────── */

export function checkAchievements({ streak, totalScore, gamesPlayed, correctGuesses, existingAchievements }) {
  const existingIds = existingAchievements.map(a => a.id);
  const newAchievements = [];

  for (const achievement of ACHIEVEMENTS) {
    if (existingIds.includes(achievement.id)) continue;

    const { type, value } = achievement.requirement;
    let met = false;

    switch (type) {
      case 'streak': met = streak >= value; break;
      case 'totalScore': met = totalScore >= value; break;
      case 'gamesPlayed': met = gamesPlayed >= value; break;
      case 'correctGuesses': met = correctGuesses >= value; break;
    }

    if (met) newAchievements.push(achievement);
  }

  return newAchievements;
}

/* ─── Rank Calculation ────────────────── */

export const RANKS = [
  { name: 'Rookie', minScore: 0, color: '#8E8E8E' },
  { name: 'Amateur', minScore: 200, color: '#2ECC71' },
  { name: 'Semi-Pro', minScore: 500, color: '#3498DB' },
  { name: 'Professional', minScore: 1000, color: '#9B59B6' },
  { name: 'World Class', minScore: 2500, color: '#E67E22' },
  { name: 'Legendary', minScore: 5000, color: '#C9A84C' },
  { name: 'GOAT', minScore: 10000, color: '#E74C3C' },
];

export function getRank(totalScore) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (totalScore >= r.minScore) rank = r;
  }
  return rank;
}

export function getNextRank(totalScore) {
  for (const r of RANKS) {
    if (totalScore < r.minScore) return r;
  }
  return null;
}

export function getRankProgress(totalScore) {
  const current = getRank(totalScore);
  const next = getNextRank(totalScore);
  if (!next) return 100;
  const range = next.minScore - current.minScore;
  const progress = totalScore - current.minScore;
  return Math.round((progress / range) * 100);
}
