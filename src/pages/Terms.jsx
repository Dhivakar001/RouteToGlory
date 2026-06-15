import { motion } from 'framer-motion';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import '../styles/info-pages.css';

export default function Terms() {
  const lastUpdated = 'June 15, 2026';

  return (
    <div className="info-page">
      <div className="container">
        <motion.div className="info-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="green" size="md">Legal</Badge>
          <h1>Terms &amp; Conditions</h1>
          <p className="body text-secondary info-hero-sub">
            Please read these terms carefully before using RouteToGlory.
            By accessing or using the platform, you agree to be bound by these terms.
          </p>
          <span className="body-sm text-tertiary">Last updated: {lastUpdated}</span>
        </motion.div>

        <div className="legal-content">
          <Card padding="lg" className="legal-card">
            <section className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using RouteToGlory (&quot;the Service&quot;), you accept and agree to be bound by these Terms &amp; Conditions. If you do not agree, you should not use the Service.</p>
              <p>These terms apply to all visitors, users, and others who access or use the Service, including guest users and registered account holders.</p>
            </section>

            <section className="legal-section">
              <h2>2. Description of Service</h2>
              <p>RouteToGlory is a free-to-play football trivia platform where users guess football players based on career paths, trophies, nationalities, and other clues. The Service includes:</p>
              <ul>
                <li>Multiple game modes (Classic, Trophy, Nationality, Time Attack, Hardcore, Daily Challenge)</li>
                <li>Player profiles and progress tracking</li>
                <li>Global leaderboards and achievement systems</li>
                <li>Guest play without registration</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. User Accounts</h2>
              <h3>3.1 Registration</h3>
              <p>You may create an account using email/password or Google Sign-In. You must provide accurate information and keep your credentials secure. You are responsible for all activity under your account.</p>
              <h3>3.2 Username Policy</h3>
              <p>Your username must be between 3 and 20 characters, contain only letters, numbers, and underscores, and must not impersonate others or contain offensive content. We reserve the right to change or remove violating usernames.</p>
              <h3>3.3 Account Termination</h3>
              <p>We may suspend or terminate your account if you violate these terms, engage in cheating, or abuse the platform. You may delete your account by contacting us.</p>
            </section>

            <section className="legal-section">
              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use automated scripts, bots, or tools to interact with the Service</li>
                <li>Attempt to manipulate scores, leaderboards, or game outcomes</li>
                <li>Exploit bugs or vulnerabilities (please report them instead)</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Attempt to access other users&apos; accounts or personal data</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Reverse-engineer, decompile, or extract the source code</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Intellectual Property</h2>
              <p>The RouteToGlory name, logo, design, code, and all game content are the property of RouteToGlory and protected by intellectual property laws.</p>
              <p>Player career information is compiled from publicly available sources for educational and entertainment purposes. RouteToGlory is not affiliated with any football club, league, or governing body (FIFA, UEFA, etc.).</p>
              <p>By creating a profile, you grant us a non-exclusive license to display your username and scores on leaderboards and within the platform.</p>
            </section>

            <section className="legal-section">
              <h2>6. Fair Play &amp; Anti-Cheat</h2>
              <p>We implement measures to detect and prevent cheating, including score validation, rate limiting, and integrity checks. Accounts found cheating will have scores removed and may be permanently banned.</p>
            </section>

            <section className="legal-section">
              <h2>7. Disclaimers</h2>
              <p>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee the Service will be uninterrupted or error-free. Football player data may contain inaccuracies.</p>
            </section>

            <section className="legal-section">
              <h2>8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, RouteToGlory shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
            </section>

            <section className="legal-section">
              <h2>9. Modifications</h2>
              <p>We may modify these terms at any time. Changes will be posted with an updated date. Continued use after modifications constitutes acceptance of the updated terms.</p>
            </section>

            <section className="legal-section">
              <h2>10. Contact</h2>
              <p>For questions about these terms, contact us at <a href="mailto:support@routetoglory.com" className="legal-link">support@routetoglory.com</a>.</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
}
