import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { calculateScore, checkAchievements } from '../lib/scoring';
import { PLAYERS_DATA } from '../lib/playerData';

const GameContext = createContext(null);

const GAME_MODES = {
  classic: { name: 'Classic', description: 'Guess from the career path', icon: '⚽' },
  trophy: { name: 'Trophy', description: 'Guess from trophies won', icon: '🏆' },
  nationality: { name: 'Nationality', description: 'Guess from nationality clues', icon: '🌍' },
  timeAttack: { name: 'Time Attack', description: '30 seconds per guess', icon: '⏱️' },
  hardcore: { name: 'Hardcore', description: 'Minimal clues, no hints', icon: '💀' },
  daily: { name: 'Daily', description: "Today's challenge", icon: '📅' },
};

const HINT_TYPES = ['nationality', 'age', 'position', 'trophy'];

const initialState = {
  mode: 'classic',
  status: 'idle', // idle | playing | guessing | revealed | gameOver
  currentPlayer: null,
  usedPlayerIds: [],
  guess: '',
  hintsRevealed: [],
  score: 0,
  totalScore: 0,
  streak: 0,
  bestStreak: 0,
  gamesPlayed: 0,
  correctGuesses: 0,
  isCorrect: null,
  timer: null,
  timeRemaining: 30,
  achievements: [],
  newAchievement: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    
    case 'START_GAME': {
      const player = action.payload;
      return {
        ...state,
        status: 'playing',
        currentPlayer: player,
        guess: '',
        hintsRevealed: [],
        isCorrect: null,
        timeRemaining: state.mode === 'timeAttack' ? 30 : null,
        usedPlayerIds: [...state.usedPlayerIds, player.id],
      };
    }

    case 'SET_GUESS':
      return { ...state, guess: action.payload };

    case 'REVEAL_HINT': {
      const hintType = action.payload;
      if (state.hintsRevealed.includes(hintType)) return state;
      if (state.mode === 'hardcore') return state;
      return { ...state, hintsRevealed: [...state.hintsRevealed, hintType] };
    }

    case 'SUBMIT_GUESS': {
      const isCorrect = action.payload;
      const points = isCorrect ? calculateScore(state.hintsRevealed.length, state.mode, state.timeRemaining) : 0;
      const newStreak = isCorrect ? state.streak + 1 : 0;
      const newBestStreak = Math.max(state.bestStreak, newStreak);
      const newCorrect = isCorrect ? state.correctGuesses + 1 : state.correctGuesses;
      const newGamesPlayed = state.gamesPlayed + 1;

      const newAchievements = checkAchievements({
        streak: newStreak,
        totalScore: state.totalScore + points,
        gamesPlayed: newGamesPlayed,
        correctGuesses: newCorrect,
        existingAchievements: state.achievements,
      });

      return {
        ...state,
        status: 'revealed',
        isCorrect,
        score: points,
        totalScore: state.totalScore + points,
        streak: newStreak,
        bestStreak: newBestStreak,
        gamesPlayed: newGamesPlayed,
        correctGuesses: newCorrect,
        achievements: [...state.achievements, ...newAchievements],
        newAchievement: newAchievements.length > 0 ? newAchievements[0] : null,
      };
    }

    case 'NEXT_PLAYER':
      return { ...state, status: 'idle', currentPlayer: null, guess: '', hintsRevealed: [], isCorrect: null, score: 0, newAchievement: null };

    case 'TICK_TIMER':
      if (state.timeRemaining <= 0) return { ...state, status: 'revealed', isCorrect: false };
      return { ...state, timeRemaining: state.timeRemaining - 1 };

    case 'CLEAR_ACHIEVEMENT':
      return { ...state, newAchievement: null };

    case 'RESET':
      return { ...initialState, bestStreak: state.bestStreak, totalScore: state.totalScore, achievements: state.achievements };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef(null);

  // Timer for Time Attack mode
  useEffect(() => {
    if (state.mode === 'timeAttack' && state.status === 'playing') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.mode, state.status]);

  // Stop timer when time runs out
  useEffect(() => {
    if (state.timeRemaining <= 0 && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [state.timeRemaining]);

  const getRandomPlayer = useCallback(() => {
    const available = PLAYERS_DATA.filter(p => !state.usedPlayerIds.includes(p.id));
    const pool = available.length > 0 ? available : PLAYERS_DATA;
    
    // Reset used players if all have been shown
    if (available.length === 0) {
      dispatch({ type: 'RESET' });
    }
    
    return pool[Math.floor(Math.random() * pool.length)];
  }, [state.usedPlayerIds]);

  const startGame = useCallback((specificPlayer = null) => {
    const player = specificPlayer || getRandomPlayer();
    dispatch({ type: 'START_GAME', payload: player });
  }, [getRandomPlayer]);

  const setMode = useCallback((mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const setGuess = useCallback((guess) => {
    dispatch({ type: 'SET_GUESS', payload: guess });
  }, []);

  const revealHint = useCallback((hintType) => {
    dispatch({ type: 'REVEAL_HINT', payload: hintType });
  }, []);

  const submitGuess = useCallback((guessName) => {
    if (!state.currentPlayer) return;
    const playerName = state.currentPlayer.name.toLowerCase().trim();
    const userGuess = guessName.toLowerCase().trim();
    
    // Fuzzy match — handle common variations
    const isCorrect = playerName === userGuess || 
      playerName.includes(userGuess) || 
      userGuess.includes(playerName) ||
      normalizePlayerName(playerName) === normalizePlayerName(userGuess);
    
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch({ type: 'SUBMIT_GUESS', payload: isCorrect });
  }, [state.currentPlayer]);

  const nextPlayer = useCallback(() => {
    dispatch({ type: 'NEXT_PLAYER' });
  }, []);

  const clearAchievement = useCallback(() => {
    dispatch({ type: 'CLEAR_ACHIEVEMENT' });
  }, []);

  return (
    <GameContext.Provider value={{
      ...state,
      GAME_MODES,
      HINT_TYPES,
      startGame,
      setMode,
      setGuess,
      revealHint,
      submitGuess,
      nextPlayer,
      clearAchievement,
      allPlayers: PLAYERS_DATA,
    }}>
      {children}
    </GameContext.Provider>
  );
}

function normalizePlayerName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
