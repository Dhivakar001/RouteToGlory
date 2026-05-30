import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Brain, TrendingUp, Users, Globe, Trophy, Target, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ClubBadge from '../components/shared/ClubBadge';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/ui/Badge';
import '../styles/landing.css';

const HERO_CAREER = [
  { club: 'Sporting CP', years: '2002–2003' },
  { club: 'Manchester United', years: '2003–2009' },
  { club: 'Real Madrid', years: '2009–2018' },
  { club: 'Juventus', years: '2018–2021' },
  { club: 'Al Nassr', years: '2023–' },
];
const HERO_ANSWER = 'Cristiano Ronaldo';

const TRENDING = [
  { name: 'Kylian Mbappé', nationality: 'France', difficulty: 'easy', clubs: ['Monaco', 'PSG', 'Real Madrid'] },
  { name: 'Jude Bellingham', nationality: 'England', difficulty: 'easy', clubs: ['Birmingham', 'BVB', 'Real Madrid'] },
  { name: 'Luka Modrić', nationality: 'Croatia', difficulty: 'medium', clubs: ['Dinamo Zagreb', 'Spurs', 'Real Madrid'] },
  { name: 'Zlatan Ibrahimović', nationality: 'Sweden', difficulty: 'hard', clubs: ['Ajax', 'Juventus', 'Inter', 'Barcelona', 'PSG'] },
];

const TESTIMONIALS = [
  { text: "This is the Wordle of football. Absolutely addictive.", author: "Football Twitter", handle: "@futbol_daily" },
  { text: "Finally a trivia game that tests real football knowledge, not just stats.", author: "The Football Hub", handle: "@thefthub" },
  { text: "My streak is 23 and I'm not stopping. This game is pure quality.", author: "Marco R.", handle: "@marco_r92" },
];

export default function Landing() {
  const [heroStep, setHeroStep] = useState(-1);
  const [heroRevealed, setHeroRevealed] = useState(false);

  useEffect(() => {
    const intervals = HERO_CAREER.map((_, i) =>
      setTimeout(() => setHeroStep(i), 600 + i * 700)
    );
    const revealTimeout = setTimeout(() => setHeroRevealed(true), 600 + HERO_CAREER.length * 700 + 500);
    return () => { intervals.forEach(clearTimeout); clearTimeout(revealTimeout); };
  }, []);

  return (
    <div className="landing">
      {/* ─── Hero ─────────────────────── */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <Badge variant="gold" size="md">Season 1 Live</Badge>
            <h1 className="display hero-title">
              Guess the player.<br />
              <span className="text-gold">Know the game.</span>
            </h1>
            <p className="body-lg text-secondary hero-subtitle">
              From career paths to trophies — test your football knowledge against fans worldwide.
            </p>
            <div className="hero-actions">
              <Link to="/play">
                <Button variant="gold" size="lg" icon={<Zap size={18} />}>Start Playing</Button>
              </Link>
              <Link to="/play?mode=daily">
                <Button variant="secondary" size="lg">Daily Challenge <ChevronRight size={16} /></Button>
              </Link>
            </div>
            <div className="hero-stats-row">
              <div className="hero-stat"><strong>12,847</strong><span>Players Guessed</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><strong>2,341</strong><span>Active Players</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><strong>50+</strong><span>Footballers</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label overline">Career Path</div>
              <div className="hero-timeline">
                {HERO_CAREER.map((step, i) => (
                  <motion.div
                    key={i}
                    className="hero-timeline-step"
                    initial={{ opacity: 0, y: 16 }}
                    animate={heroStep >= i ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <ClubBadge club={step.club} size={40} />
                    <div className="hero-timeline-info">
                      <span className="hero-timeline-club">{step.club}</span>
                      <span className="hero-timeline-years">{step.years}</span>
                    </div>
                  </motion.div>
                ))}
                {heroStep >= 0 && HERO_CAREER.slice(0, heroStep + 1).map((_, i) => (
                  i < heroStep ? (
                    <motion.div
                      key={`arrow-${i}`}
                      className="hero-timeline-arrow"
                      style={{ top: `${56 + i * 68}px` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ delay: 0.2 }}
                    />
                  ) : null
                ))}
              </div>
              <AnimatePresence>
                {heroRevealed && (
                  <motion.div
                    className="hero-reveal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="hero-reveal-label">The answer is</div>
                    <div className="hero-reveal-name">{HERO_ANSWER}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Daily Challenge ──────────── */}
      <section className="section" id="daily">
        <div className="container">
          <Card className="daily-card" padding="lg">
            <div className="daily-card-inner">
              <div className="daily-card-content">
                <Badge variant="green" size="md">📅 Daily Challenge</Badge>
                <h2>Today's Mystery Player</h2>
                <p className="body text-secondary">A new player every day. Can you guess today's challenge before your friends?</p>
                <Link to="/play?mode=daily">
                  <Button variant="primary" size="md" icon={<ArrowRight size={16} />}>Play Today's Challenge</Button>
                </Link>
              </div>
              <div className="daily-card-timer">
                <div className="daily-timer-label overline">Next challenge in</div>
                <DailyCountdown />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── How It Works ─────────────── */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="overline">How It Works</span>
            <h2>Three steps to glory</h2>
          </div>
          <div className="grid grid-3 hiw-grid">
            {[
              { num: '01', icon: <Target size={24} />, title: 'See the Career', desc: 'We show you the clubs a player has played for — their route through football.' },
              { num: '02', icon: <Brain size={24} />, title: 'Make Your Guess', desc: 'Type your answer. Use hints if you need them, but each hint costs points.' },
              { num: '03', icon: <TrendingUp size={24} />, title: 'Climb the Ranks', desc: 'Build streaks, unlock achievements, and compete on the global leaderboard.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="hiw-step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="hiw-num">{step.num}</div>
                <div className="hiw-icon">{step.icon}</div>
                <h3 className="hiw-title">{step.title}</h3>
                <p className="body-sm text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trending ─────────────────── */}
      <section className="section" id="trending">
        <div className="container">
          <div className="section-header">
            <span className="overline">Trending Now</span>
            <h2>Most guessed this week</h2>
          </div>
          <div className="trending-scroll">
            {TRENDING.map((player, i) => (
              <div key={i} className="trending-card">
                <div className="trending-clubs">
                  {player.clubs.slice(0, 3).map((c, j) => <ClubBadge key={j} club={c} size={36} />)}
                </div>
                <div className="trending-info">
                  <span className="trending-name">{player.name}</span>
                  <span className="trending-nat body-sm text-secondary">{player.nationality}</span>
                </div>
                <Badge variant={player.difficulty === 'easy' ? 'success' : player.difficulty === 'medium' ? 'warning' : 'danger'} size="sm">
                  {player.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────── */}
      <section className="section" id="stats">
        <div className="container">
          <div className="section-header text-center">
            <span className="overline">Global Stats</span>
            <h2>The numbers speak</h2>
          </div>
          <div className="grid grid-4">
            <StatCard icon="⚽" value="12,847" label="Total Guesses" />
            <StatCard icon="👤" value="50+" label="Players in Database" />
            <StatCard icon="🔥" value="847" label="Active Streaks" />
            <StatCard icon="🌍" value="92" label="Countries Playing" />
          </div>
        </div>
      </section>

      {/* ─── Leaderboard Preview ──────── */}
      <section className="section" id="leaderboard">
        <div className="container">
          <div className="section-header">
            <span className="overline">Leaderboard</span>
            <h2>Top players this week</h2>
          </div>
          <Card padding="none">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, name: 'CR7Fanatic', score: 4200, streak: 28 },
                  { rank: 2, name: 'GoalMachine', score: 3850, streak: 21 },
                  { rank: 3, name: 'TikiTaka99', score: 3600, streak: 18 },
                  { rank: 4, name: 'PitchMaster', score: 3100, streak: 15 },
                  { rank: 5, name: 'LeoTheGoat', score: 2900, streak: 12 },
                ].map((entry) => (
                  <tr key={entry.rank}>
                    <td><span className={`lb-rank lb-rank-${entry.rank}`}>{entry.rank}</span></td>
                    <td className="lb-name">{entry.name}</td>
                    <td className="lb-score">{entry.score.toLocaleString()}</td>
                    <td><span className="lb-streak">🔥 {entry.streak}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Link to="/leaderboard">
              <Button variant="secondary" size="md">View Full Leaderboard <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────── */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-header text-center">
            <span className="overline">Community</span>
            <h2>What players are saying</h2>
          </div>
          <div className="grid grid-3">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} padding="md" className="testimonial-card">
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <strong>{t.author}</strong>
                  <span className="text-secondary body-sm">{t.handle}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────── */}
      <section className="section cta-section">
        <div className="container text-center">
          <h2>Ready to test your knowledge?</h2>
          <p className="body-lg text-secondary" style={{ maxWidth: 480, margin: '0 auto var(--space-8)' }}>
            Join thousands of football fans. Guess players, build streaks, and climb the leaderboard.
          </p>
          <Link to="/play">
            <Button variant="gold" size="lg" icon={<Zap size={18} />}>Start Playing Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function DailyCountdown() {
  const [time, setTime] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    return {
      hours: String(Math.floor(diff / 3600000)).padStart(2, '0'),
      minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
      seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
    };
  }

  return (
    <div className="daily-countdown">
      <div className="daily-countdown-unit"><span>{time.hours}</span><small>hrs</small></div>
      <span className="daily-countdown-sep">:</span>
      <div className="daily-countdown-unit"><span>{time.minutes}</span><small>min</small></div>
      <span className="daily-countdown-sep">:</span>
      <div className="daily-countdown-unit"><span>{time.seconds}</span><small>sec</small></div>
    </div>
  );
}
