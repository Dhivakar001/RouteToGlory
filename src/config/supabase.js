import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── Helper Functions ────────────────── */

export async function fetchPlayers({ limit = 50, offset = 0, difficulty } = {}) {
  let query = supabase
    .from('players')
    .select('*, career_history(*), trophies(*)')
    .eq('is_active', true)
    .order('name')
    .range(offset, offset + limit - 1);

  if (difficulty) query = query.eq('difficulty', difficulty);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchPlayerById(id) {
  const { data, error } = await supabase
    .from('players')
    .select('*, career_history(*), trophies(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchDailyChallenge() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*, player:players(*, career_history(*), trophies(*))')
    .eq('challenge_date', today)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchLeaderboard({ period = 'all', limit = 100 } = {}) {
  let query = supabase
    .from('leaderboards')
    .select('*, profile:profiles(*)')
    .order('total_score', { ascending: false })
    .limit(limit);

  if (period !== 'all') {
    query = query.eq('period_type', period);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function submitScore({ userId, playerId, gameMode, points, hintsUsed, timeTaken }) {
  const { data, error } = await supabase
    .from('scores')
    .insert({ user_id: userId, player_id: playerId, game_mode: gameMode, points, hints_used: hintsUsed, time_taken: timeTaken })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_achievements(*, achievement:achievements(*))')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchUserScores(userId, { limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('scores')
    .select('*, player:players(name, nationality)')
    .eq('user_id', userId)
    .order('guessed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function uploadPlayerImage(file, playerId) {
  const ext = file.name.split('.').pop();
  const path = `players/${playerId}.${ext}`;
  const { error } = await supabase.storage.from('player-images').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('player-images').getPublicUrl(path);
  return data.publicUrl;
}
