import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, BarChart3, Shield, Menu, X, Gamepad2 } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  const { isAuthenticated, profile, logOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/play', label: 'Play', icon: <Gamepad2 size={18} /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <BarChart3 size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">⚽</span>
          <span className="navbar-title">Route<span className="text-gold">To</span>Glory</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'navbar-links-open' : ''}`}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${isActive(link.to) ? 'navbar-link-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                className={`navbar-link ${isActive('/profile') ? 'navbar-link-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`navbar-link ${isActive('/admin') ? 'navbar-link-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user">
              <Link to="/profile" className="navbar-avatar">
                <div className="navbar-avatar-circle">
                  {profile?.display_name?.[0]?.toUpperCase() || 'P'}
                </div>
              </Link>
              <button className="navbar-link body-sm" onClick={logOut}>Sign out</button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="primary" size="sm">Sign In</Button>
            </Link>
          )}
          <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
