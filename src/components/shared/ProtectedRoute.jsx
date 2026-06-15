import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard component for protected pages.
 * 
 * Usage:
 *   <Route element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 *   <Route element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  // Still resolving auth state — show nothing (prevents flash)
  if (loading) {
    return (
      <div className="protected-loading">
        <div className="protected-spinner" />
      </div>
    );
  }

  // Not authenticated — redirect to auth page with return URL
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Requires admin but user is not admin — redirect to home
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
