import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CareerTimeline from '../components/game/CareerTimeline';
import GuessInput from '../components/game/GuessInput';
import HintSystem from '../components/game/HintSystem';
import Timer from '../components/game/Timer';
import ScoreCounter from '../components/game/ScoreCounter';
import StreakTracker from '../components/game/StreakTracker';
import AchievementToast from '../components/game/AchievementToast';
import '../styles/game.css';

const MODE_TABS = [
  { id: 'classic', label: 'Classic', icon: '⚽' },
  { id: 'trophy', label: 'Trophy', icon: '🏆' },
  { id: 'nationality', label: 'Nationality', icon: '🌍' },
  { id: 'timeAttack', label: 'Time Attack', icon: '⏱️' },
  { id: 'hardcore', label: 'Hardcore', icon: '💀' },
  { id: 'daily', label: 'Daily', icon: '📅' },
];

export default function Game() {
  const [searchParams] = useSearchParams();
  const game = useGame();
  const {
    mode, status, currentPlayer, hintsRevealed, score, totalScore,
    streak, bestStreak, gamesPlayed, correctGuesses, isCorrect, timeRemaining,
    newAchievement, GAME_MODES, loadingPlayers,
    startGame, setMode, submitGuess, revealHint, nextPlayer, clearAchievement,
  } = game;

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode && GAME_MODES[urlMode]) setMode(urlMode);
  }, [searchParams, GAME_MODES, setMode]);

  const handleStartGame = () => startGame();

  const handleGuess = (guessName) => {
    submitGuess(guessName);
  };

  const renderClues = () => {
    if (!currentPlayer) return null;

    if (mode === 'trophy') {
      return (
        <div className="game-clues">
          <div className="game-clue-label overline">Trophies Won</div>
          <div className="trophy-list">
            {currentPlayer.trophies.map((t, i) => (
              <motion.div
                key={i}
                className="trophy-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="trophy-icon">🏆</span>
                <span>{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (mode === 'nationality') {
      return (
        <div className="game-clues">
          <div className="game-clue-label overline">Player Clues</div>
          <div className="nat-clues">
            <div className="nat-clue-item">
              <span className="nat-clue-label">Nationality</span>
              <span className="nat-clue-value">{currentPlayer.nationality}</span>
            </div>
            <div className="nat-clue-item">
              <span className="nat-clue-label">Position</span>
              <span className="nat-clue-value">{currentPlayer.position}</span>
            </div>
            <div className="nat-clue-item">
              <span className="nat-clue-label">Clubs Played For</span>
              <span className="nat-clue-value">{currentPlayer.career.length}</span>
            </div>
          </div>
        </div>
      );
    }

    // Classic, timeAttack, hardcore, daily — show career timeline
    return <CareerTimeline career={currentPlayer.career} mode={mode} />;
  };

  return (
    <div className="game-page">
      <div className="container">
        {/* Mode Selector */}
        <div className="game-mode-bar">
          <Tabs
            tabs={MODE_TABS}
            activeTab={mode}
            onChange={(m) => { setMode(m); if (status !== 'idle') nextPlayer(); }}
          />
        </div>

        {/* Pre-game */}
        {status === 'idle' && (
          <motion.div
            className="game-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="game-start-inner">
              <div className="game-start-icon">{GAME_MODES[mode]?.icon}</div>
              <h2>{GAME_MODES[mode]?.name} Mode</h2>
              <p className="body text-secondary">{GAME_MODES[mode]?.description}</p>
              <div className="game-start-stats">
                <ScoreCounter score={0} totalScore={totalScore} />
                <StreakTracker streak={streak} bestStreak={bestStreak} />
              </div>
              <Button variant="gold" size="lg" onClick={handleStartGame} disabled={loadingPlayers} loading={loadingPlayers}>
                {gamesPlayed > 0 ? 'Next Player' : 'Start Game'}
              </Button>
              {gamesPlayed > 0 && (
                <p className="body-sm text-secondary" style={{ marginTop: 12 }}>
                  {correctGuesses}/{gamesPlayed} correct ({gamesPlayed > 0 ? Math.round((correctGuesses/gamesPlayed)*100) : 0}%)
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Active Game */}
        {(status === 'playing' || status === 'revealed') && currentPlayer && (
          <div className="game-active">
            {/* Stats Bar */}
            <div className="game-stats-bar">
              <ScoreCounter score={score} totalScore={totalScore} />
              <StreakTracker streak={streak} bestStreak={bestStreak} />
              <div className="game-round-info">
                <Badge variant="default">Round {gamesPlayed + (status === 'playing' ? 1 : 0)}</Badge>
              </div>
            </div>

            {/* Timer for Time Attack */}
            {mode === 'timeAttack' && status === 'playing' && (
              <Timer timeRemaining={timeRemaining} isActive={true} />
            )}

            <div className="game-layout">
              {/* Left: Clues */}
              <Card className="game-clues-card" padding="lg">
                <div className="game-clue-label overline" style={{ marginBottom: 16 }}>
                  {mode === 'trophy' ? 'Trophy Cabinet' : mode === 'nationality' ? 'Player Profile' : 'Career Path'}
                </div>
                {renderClues()}
              </Card>

              {/* Right: Interaction */}
              <div className="game-interaction">
                {status === 'playing' ? (
                  <>
                    <GuessInput onSubmit={handleGuess} disabled={status !== 'playing'} />
                    {mode !== 'hardcore' && (
                      <HintSystem
                        player={currentPlayer}
                        hintsRevealed={hintsRevealed}
                        onRevealHint={revealHint}
                        disabled={status !== 'playing'}
                      />
                    )}
                  </>
                ) : (
                  <motion.div
                    className={`game-result ${isCorrect ? 'game-result-correct' : 'game-result-wrong'}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="game-result-icon">{isCorrect ? '✅' : '❌'}</div>
                    <div className="game-result-label">
                      {isCorrect ? 'Correct!' : 'Not quite...'}
                    </div>
                    <div className="game-result-player">
                      <span className="game-result-name">{currentPlayer.name}</span>
                      <span className="game-result-meta">
                        {currentPlayer.nationality} · {currentPlayer.position}
                      </span>
                    </div>
                    {isCorrect && (
                      <div className="game-result-score">
                        <span className="game-result-points">+{score} points</span>
                        {hintsRevealed.length === 0 && <Badge variant="gold">Perfect!</Badge>}
                      </div>
                    )}
                    <Button variant="primary" size="lg" onClick={nextPlayer} style={{ marginTop: 20 }}>
                      Next Player
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AchievementToast achievement={newAchievement} onClose={clearAchievement} />
    </div>
  );
}
