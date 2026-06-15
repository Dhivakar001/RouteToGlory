import { createContext, useContext, useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { calculateScore, checkAchievements } from '../lib/scoring';
import { fetchPlayers } from '../config/firebase';
import { useAuth } from './AuthContext';

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

    case 'HYDRATE_STATE':
      return {
        ...state,
        streak: action.payload.streak ?? state.streak,
        bestStreak: action.payload.bestStreak ?? state.bestStreak,
        gamesPlayed: action.payload.gamesPlayed ?? state.gamesPlayed,
        correctGuesses: action.payload.correctGuesses ?? state.correctGuesses,
        achievements: action.payload.achievements ?? state.achievements,
        usedPlayerIds: action.payload.usedPlayerIds ?? state.usedPlayerIds,
        totalScore: action.payload.totalScore ?? state.totalScore,
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    const localSave = localStorage.getItem('rtg_guest_save');
    if (localSave) {
      try {
        const parsed = JSON.parse(localSave);
        return { ...initialState, ...parsed };
      } catch (e) {
        return initialState;
      }
    }
    return initialState;
  });
  
  const [allPlayers, setAllPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const timerRef = useRef(null);
  
  const { profile, updateGameData } = useAuth();
  const hydratedUserId = useRef(null);
  const prevGameState = useRef({ gamesPlayed: state.gamesPlayed, usedPlayerIds: state.usedPlayerIds });

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await fetchPlayers({ limitCount: 100 });
        setAllPlayers(data);
      } catch (err) {
        console.error("Failed to load players from Firestore:", err);
      } finally {
        setLoadingPlayers(false);
      }
    }
    loadPlayers();
  }, []);

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

  // Hydrate state from profile when user logs in
  useEffect(() => {
    if (profile && profile.id !== hydratedUserId.current) {
      if (profile.gameData) {
        dispatch({ 
          type: 'HYDRATE_STATE', 
          payload: { ...profile.gameData, totalScore: profile.total_score } 
        });
      }
      hydratedUserId.current = profile.id;
    } else if (!profile && hydratedUserId.current) {
      // User logged out
      dispatch({ type: 'RESET' });
      hydratedUserId.current = null;
    }
  }, [profile]);

  // Sync state to Firestore or localStorage when significant changes occur
  useEffect(() => {
    if (
      state.gamesPlayed !== prevGameState.current.gamesPlayed || 
      state.usedPlayerIds.length !== prevGameState.current.usedPlayerIds.length
    ) {
      const syncData = {
        streak: state.streak,
        bestStreak: state.bestStreak,
        gamesPlayed: state.gamesPlayed,
        correctGuesses: state.correctGuesses,
        achievements: state.achievements,
        usedPlayerIds: state.usedPlayerIds,
        totalScore: state.totalScore
      };

      if (profile && profile.id === hydratedUserId.current) {
        updateGameData(syncData);
      } else if (!profile) {
        localStorage.setItem('rtg_guest_save', JSON.stringify(syncData));
      }
      
      prevGameState.current = { gamesPlayed: state.gamesPlayed, usedPlayerIds: state.usedPlayerIds };
    }
  }, [
    state.gamesPlayed, 
    state.usedPlayerIds, 
    state.streak, 
    state.bestStreak, 
    state.correctGuesses, 
    state.achievements, 
    state.totalScore, 
    profile, 
    updateGameData
  ]);

  const getRandomPlayer = useCallback(() => {
    if (allPlayers.length === 0) return null;
    const available = allPlayers.filter(p => !state.usedPlayerIds.includes(p.id));
    const pool = available.length > 0 ? available : allPlayers;
    
    // Reset used players if all have been shown
    if (available.length === 0) {
      dispatch({ type: 'RESET' });
    }
    
    return pool[Math.floor(Math.random() * pool.length)];
  }, [state.usedPlayerIds, allPlayers]);

  const startGame = useCallback((specificPlayer = null) => {
    const player = specificPlayer || getRandomPlayer();
    if (player) {
      dispatch({ type: 'START_GAME', payload: player });
    }
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
      allPlayers,
      loadingPlayers,
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
