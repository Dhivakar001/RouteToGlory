import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
      } else {
        // Create profile on first sign-in
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: `player_${userId.slice(0, 8)}`,
            display_name: 'New Player',
            total_score: 0,
            rank: 'rookie',
          })
          .select()
          .single();
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      // Fallback profile for demo/guest mode
      setProfile({
        id: userId,
        username: `player_${userId.slice(0, 8)}`,
        display_name: 'Guest Player',
        total_score: 0,
        rank: 'rookie',
        avatar_url: null,
      });
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) throw error;
    return data;
  };

  const signInAsGuest = async () => {
    // Guest mode — create a local-only session
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const guestUser = { id: guestId, email: null, isGuest: true };
    setUser(guestUser);
    setProfile({
      id: guestId,
      username: `guest_${guestId.slice(6, 14)}`,
      display_name: 'Guest',
      total_score: 0,
      rank: 'rookie',
      avatar_url: null,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      isGuest: user?.isGuest || false,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInAsGuest,
      signOut,
      setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
