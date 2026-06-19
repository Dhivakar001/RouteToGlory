import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeFirebaseError,
  checkRateLimit,
  recordRateLimitAttempt,
  clearRateLimit,
} from '../lib/security';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

const RATE_LIMIT_KEY = 'auth_login';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to where the user came from (if routed via ProtectedRoute), otherwise homepage
  const redirectTo = location.state?.from || '/';

  // If already authenticated, skip the auth page entirely
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const validateForm = () => {
    const errors = {};

    const emailResult = validateEmail(email);
    if (!emailResult.valid) errors.email = emailResult.error;

    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) errors.password = passwordResult.error;

    if (!isLogin) {
      const usernameResult = validateUsername(username);
      if (!usernameResult.valid) errors.username = usernameResult.error;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!validateForm()) return;

    // Rate limit check
    const rateCheck = checkRateLimit(RATE_LIMIT_KEY);
    if (!rateCheck.allowed) {
      const minutes = Math.ceil(rateCheck.retryAfterMs / 60000);
      setRateLimited(true);
      setError(`Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, username);
      }
      clearRateLimit(RATE_LIMIT_KEY);
      navigate(redirectTo);
    } catch (err) {
      recordRateLimitAttempt(RATE_LIMIT_KEY);
      setError(sanitizeFirebaseError(err));

      // Check if now rate limited
      const postCheck = checkRateLimit(RATE_LIMIT_KEY);
      if (!postCheck.allowed) setRateLimited(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate(redirectTo);
    } catch (err) {
      setError(sanitizeFirebaseError(err));
    }
  };

  const handleGuest = async () => {
    try {
      await signInAsGuest();
      navigate(redirectTo);
    } catch (err) {
      setError(sanitizeFirebaseError(err));
    }
  };

  // Password strength indicator for sign-up
  const passwordStrength = !isLogin && password.length > 0
    ? validatePassword(password).strength
    : null;

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>
              {isLogin ? 'Welcome back' : 'Join the game'}
            </h1>
            <p className="body text-secondary">
              {isLogin ? 'Sign in to continue your streak.' : 'Create an account to track your progress.'}
            </p>
          </div>

          <Card className="auth-card" padding="lg">
            <button className="auth-google-btn" onClick={handleGoogle}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/></svg>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {!isLogin && (
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  icon={<User size={18} />}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setFieldErrors(prev => ({ ...prev, username: undefined })); }}
                  error={fieldErrors.username}
                  maxLength={20}
                  autoComplete="username"
                  required
                />
              )}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                error={fieldErrors.email}
                maxLength={254}
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
                error={fieldErrors.password}
                maxLength={128}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />

              {/* Password strength indicator */}
              {passwordStrength && (
                <div className="auth-password-strength">
                  <div className={`auth-strength-bar auth-strength-${passwordStrength}`} />
                  <span className="body-sm text-secondary">
                    Password strength: {passwordStrength}
                  </span>
                </div>
              )}

              {error && <div className="auth-error">{error}</div>}

              <Button
                variant="primary"
                size="lg"
                loading={loading}
                disabled={rateLimited}
                style={{ width: '100%' }}
              >
                {rateLimited ? 'Too many attempts' : isLogin ? 'Sign In' : 'Create Account'}
                {!rateLimited && <ArrowRight size={16} />}
              </Button>
            </form>

            <div className="auth-toggle">
              <span className="body-sm text-secondary">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button className="auth-toggle-btn" onClick={() => { setIsLogin(!isLogin); setError(''); setFieldErrors({}); }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </Card>

          <button className="auth-guest-btn" onClick={handleGuest}>
            Continue as Guest <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
