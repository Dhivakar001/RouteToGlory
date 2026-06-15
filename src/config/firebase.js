import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { validateFileUpload, sanitizeFileName } from '../lib/security';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "12345",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:12345:web:abcde",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "mock_measurement_id"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

/* ─── Helper Functions (Firestore) ────────────────── */

export async function fetchPlayers({ limitCount = 50, difficulty } = {}) {
  let q = query(collection(db, 'players'), where('is_active', '==', true), limit(limitCount));
  if (difficulty) {
    q = query(q, where('difficulty', '==', difficulty));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchPlayerById(id) {
  const docRef = doc(db, 'players', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Player not found');
  return { id: docSnap.id, ...docSnap.data() };
}

export async function fetchDailyChallenge() {
  const today = new Date().toISOString().split('T')[0];
  const q = query(collection(db, 'daily_challenges'), where('challenge_date', '==', today), where('is_active', '==', true), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error('No daily challenge found');
  const challenge = snapshot.docs[0].data();
  // Fetch associated player
  const player = await fetchPlayerById(challenge.player_id);
  return { id: snapshot.docs[0].id, ...challenge, player };
}

export async function fetchLeaderboard({ period = 'all', limitCount = 100 } = {}) {
  let q = query(collection(db, 'leaderboards'), orderBy('total_score', 'desc'), limit(limitCount));
  if (period !== 'all') {
    q = query(q, where('period_type', '==', period));
  }
  const snapshot = await getDocs(q);
  // In a real app, you would join profiles here.
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function submitScore({ userId, playerId, gameMode, points, hintsUsed, timeTaken }) {
  const scoreRef = await addDoc(collection(db, 'scores'), {
    user_id: userId,
    player_id: playerId,
    game_mode: gameMode,
    points,
    hints_used: hintsUsed,
    time_taken: timeTaken,
    guessed_at: new Date()
  });
  return { id: scoreRef.id };
}

export async function fetchUserProfile(userId) {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Profile not found');
  return { id: docSnap.id, ...docSnap.data() };
}

export async function updateUserProfile(userId, updates) {
  const docRef = doc(db, 'profiles', userId);
  await updateDoc(docRef, updates);
  return { id: userId, ...updates };
}

export async function fetchUserScores(userId, { limitCount = 50 } = {}) {
  const q = query(collection(db, 'scores'), where('user_id', '==', userId), orderBy('guessed_at', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function uploadPlayerImage(file, playerId) {
  // Validate file type and size before uploading
  const validation = validateFileUpload(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const ext = sanitizeFileName(file.name).split('.').pop();
  const safeName = sanitizeFileName(`${playerId}.${ext}`);
  const path = `players/${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
