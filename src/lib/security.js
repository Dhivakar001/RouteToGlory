/* ─── Security Utilities ────────────────── */

/**
 * Sanitize user input — strips HTML tags, trims whitespace, enforces max length.
 * Prevents XSS via reflected input in the DOM.
 */
export function sanitizeInput(str, maxLength = 200) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')       // Strip HTML tags
    .replace(/[<>"'&]/g, '')       // Remove dangerous characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate email format using a robust regex pattern.
 * Returns { valid: boolean, error?: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }
  // RFC 5322 simplified pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
}

/**
 * Validate password strength.
 * Returns { valid: boolean, error?: string, strength: 'weak' | 'fair' | 'strong' }
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required', strength: 'weak' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password is too long', strength: 'weak' };
  }

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score < 2) {
    return { valid: false, error: 'Password needs uppercase, lowercase, and numbers', strength: 'weak' };
  }
  if (score < 3) {
    return { valid: true, strength: 'fair' };
  }
  return { valid: true, strength: 'strong' };
}

/**
 * Validate username format.
 * Returns { valid: boolean, error?: string }
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  // Prevent impersonation with reserved names
  const reserved = ['admin', 'administrator', 'moderator', 'mod', 'system', 'root', 'support'];
  if (reserved.includes(trimmed.toLowerCase())) {
    return { valid: false, error: 'This username is reserved' };
  }
  return { valid: true };
}

/* ─── Firebase Error Sanitization ─────────── */

/**
 * Map Firebase auth error codes to user-friendly messages.
 * Prevents leaking internal details (email enumeration, backend info, etc.)
 */
const FIREBASE_ERROR_MAP = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/weak-password': 'Please choose a stronger password.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Sign-in popup was blocked by your browser.',
  'auth/requires-recent-login': 'Please sign in again to continue.',
};

export function sanitizeFirebaseError(error) {
  if (!error) return 'An unexpected error occurred.';
  const code = error?.code || '';
  return FIREBASE_ERROR_MAP[code] || 'Something went wrong. Please try again.';
}

/* ─── Client-Side Rate Limiting ───────────── */

/**
 * Simple client-side rate limiter using sessionStorage.
 * Not a replacement for server-side rate limiting, but prevents
 * casual brute-force attempts from the browser.
 *
 * Returns { allowed: boolean, remainingAttempts: number, retryAfterMs: number }
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const storageKey = `rl_${key}`;
  const now = Date.now();

  let data;
  try {
    data = JSON.parse(sessionStorage.getItem(storageKey));
  } catch {
    data = null;
  }

  if (!data || now - data.windowStart > windowMs) {
    // Start a new window
    data = { attempts: 0, windowStart: now };
  }

  if (data.attempts >= maxAttempts) {
    const retryAfterMs = windowMs - (now - data.windowStart);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
    };
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - data.attempts,
    retryAfterMs: 0,
  };
}

/**
 * Record a rate limit attempt (call after a failed action).
 */
export function recordRateLimitAttempt(key, windowMs = 15 * 60 * 1000) {
  const storageKey = `rl_${key}`;
  const now = Date.now();

  let data;
  try {
    data = JSON.parse(sessionStorage.getItem(storageKey));
  } catch {
    data = null;
  }

  if (!data || now - data.windowStart > windowMs) {
    data = { attempts: 1, windowStart: now };
  } else {
    data.attempts++;
  }

  sessionStorage.setItem(storageKey, JSON.stringify(data));
}

/**
 * Clear rate limit (call after successful action).
 */
export function clearRateLimit(key) {
  sessionStorage.removeItem(`rl_${key}`);
}

/* ─── File Validation ─────────────────────── */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Validate an uploaded file for type and size.
 * Returns { valid: boolean, error?: string }
 */
export function validateFileUpload(file) {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File must be smaller than 2MB' };
  }
  return { valid: true };
}

/**
 * Sanitize a filename to prevent path traversal and special character injection.
 */
export function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')  // Replace special chars with underscore
    .replace(/\.{2,}/g, '.')             // Prevent directory traversal
    .slice(0, 100);                       // Limit length
}
