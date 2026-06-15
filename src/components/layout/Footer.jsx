import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>⚽</span>
              <span className="navbar-title">Route<span className="text-gold">To</span>Glory</span>
            </div>
            <p className="body-sm text-secondary">
              Test your football knowledge. Guess players from their career paths, trophies, and achievements.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Game</h4>
            <Link to="/play" className="footer-link">Play Now</Link>
            <Link to="/play?mode=daily" className="footer-link">Daily Challenge</Link>
            <Link to="/leaderboard" className="footer-link">Leaderboard</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <Link to="/profile" className="footer-link">Profile</Link>
            <Link to="/auth" className="footer-link">Sign In</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">More</h4>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="body-sm text-tertiary">© {new Date().getFullYear()} RouteToGlory. All rights reserved.</span>
          <span className="body-sm text-tertiary">Built for football lovers.</span>
        </div>
      </div>
    </footer>
  );
}
