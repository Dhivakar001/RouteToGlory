import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { sanitizeInput } from '../lib/security';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Helper to fetch or create profile in Firestore
  const fetchOrCreateProfile = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    
    try {
      const docRef = doc(db, 'profiles', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        // Create new profile
        const rawUsername = additionalData.username || firebaseUser.displayName?.replace(/\s+/g, '').toLowerCase() || firebaseUser.email?.split('@')[0] || `guest_${firebaseUser.uid.substring(0, 5)}`;
        const newProfile = {
          id: firebaseUser.uid,
          username: sanitizeInput(rawUsername, 20),
          display_name: sanitizeInput(firebaseUser.displayName || 'Player', 50),
          avatar_url: firebaseUser.photoURL || null,
          role: 'player',
          rank: 'Rookie',
          total_score: 0,
          gameData: {
            streak: 0,
            bestStreak: 0,
            gamesPlayed: 0,
            correctGuesses: 0,
            achievements: [],
            usedPlayerIds: [],
          },
          created_at: new Date()
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Error fetching/creating profile:', err);
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreateProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In Error:', error.message);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  };

  const signUpWithEmail = async (email, password, username) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await fetchOrCreateProfile(user, { username });
    return user;
  };

  const signInAsGuest = async () => {
    const { user } = await signInAnonymously(auth);
    return user;
  };

  const logOut = useCallback(async () => {
    // Clear guest progress on explicit logout
    localStorage.removeItem('rtg_guest_save');
    // Clear session activity tracking
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    await signOut(auth);
  }, []);

  // ─── Session Activity Tracking ───────────
  useEffect(() => {
    if (!user) return;

    const resetActivity = () => { lastActivityRef.current = Date.now(); };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetActivity, { passive: true }));

    sessionTimerRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > SESSION_TIMEOUT_MS) {
        logOut();
      }
    }, 60 * 1000); // check every minute

    return () => {
      events.forEach(e => window.removeEventListener(e, resetActivity));
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [user, logOut]);

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');
    const docRef = doc(db, 'profiles', user.uid);

    // Sanitize editable fields
    const sanitizedUpdates = {};
    if (updates.display_name !== undefined) {
      sanitizedUpdates.display_name = sanitizeInput(updates.display_name, 50);
    }
    if (updates.username !== undefined) {
      sanitizedUpdates.username = sanitizeInput(updates.username, 20);
    }

    // Prevent role escalation from client
    delete sanitizedUpdates.role;
    delete sanitizedUpdates.id;

    sanitizedUpdates.updated_at = new Date();

    await updateDoc(docRef, sanitizedUpdates);
    setProfile(prev => ({ ...prev, ...sanitizedUpdates }));
    return sanitizedUpdates;
  };
  const lastWriteRef = useRef(0);
  const WRITE_THROTTLE_MS = 3000; // Max 1 Firestore write per 3 seconds

  const updateGameData = async (gameUpdates) => {
    if (!user || !profile) return;

    // Throttle writes to prevent Firestore abuse
    const now = Date.now();
    if (now - lastWriteRef.current < WRITE_THROTTLE_MS) return;
    lastWriteRef.current = now;

    const docRef = doc(db, 'profiles', user.uid);

    const { totalScore, ...restGameData } = gameUpdates;
    const updatedGameData = { ...(profile.gameData || {}), ...restGameData };

    // Validate numeric fields to prevent corrupted state writes
    const numericFields = ['streak', 'bestStreak', 'gamesPlayed', 'correctGuesses'];
    for (const field of numericFields) {
      if (updatedGameData[field] !== undefined && (typeof updatedGameData[field] !== 'number' || updatedGameData[field] < 0)) {
        console.warn(`Invalid gameData field "${field}":`, updatedGameData[field]);
        return;
      }
    }
    
    const updates = {
      gameData: updatedGameData,
      updated_at: new Date()
    };
    
    if (totalScore !== undefined && typeof totalScore === 'number' && totalScore >= 0) {
      updates.total_score = totalScore;
    }

    setProfile(prev => ({ 
      ...prev, 
      gameData: updatedGameData, 
      ...(totalScore !== undefined && { total_score: totalScore }) 
    }));

    try {
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error("Failed to sync game data to Firestore:", err);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isGuest: user?.isAnonymous || false,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    logOut,
    updateProfile,
    updateGameData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
