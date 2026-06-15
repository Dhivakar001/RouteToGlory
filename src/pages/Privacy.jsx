import { motion } from 'framer-motion';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import '../styles/info-pages.css';

export default function Privacy() {
  const lastUpdated = 'June 15, 2026';

  return (
    <div className="info-page">
      <div className="container">
        <motion.div className="info-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="green" size="md">Legal</Badge>
          <h1>Privacy Policy</h1>
          <p className="body text-secondary info-hero-sub">
            Your privacy matters to us. This policy explains how RouteToGlory collects,
            uses, and protects your information.
          </p>
          <span className="body-sm text-tertiary">Last updated: {lastUpdated}</span>
        </motion.div>

        <div className="legal-content">
          <Card padding="lg" className="legal-card">

            <section className="legal-section">
              <h2>1. Information We Collect</h2>

              <h3>1.1 Account Information</h3>
              <p>When you create an account, we collect:</p>
              <ul>
                <li>Email address (for email/password authentication)</li>
                <li>Display name and username</li>
                <li>Profile photo (if you sign in with Google)</li>
              </ul>
              <p>
                If you sign in with Google, we receive your name, email, and profile picture
                from your Google account. We do not receive or store your Google password.
              </p>

              <h3>1.2 Game Data</h3>
              <p>We collect data related to your gameplay, including:</p>
              <ul>
                <li>Game scores and performance statistics</li>
                <li>Achievements unlocked and streaks</li>
                <li>Game mode preferences</li>
                <li>Time spent per round</li>
              </ul>

              <h3>1.3 Technical Data</h3>
              <p>We automatically collect certain technical information:</p>
              <ul>
                <li>Browser type and version</li>
                <li>Device type (desktop, mobile, tablet)</li>
                <li>General location data (country-level, via IP address)</li>
                <li>Pages visited and interactions within the app</li>
              </ul>

              <h3>1.4 Guest Users</h3>
              <p>
                If you play as a guest, we create an anonymous session. No personal information
                is collected. Guest data is temporary and may not persist between sessions.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li><strong>Provide the service</strong> — authenticate your account, save your progress, and display your profile on leaderboards.</li>
                <li><strong>Improve the platform</strong> — analyze aggregate gameplay patterns to balance difficulty and create better content.</li>
                <li><strong>Ensure security</strong> — detect and prevent abuse, unauthorized access, and cheating.</li>
                <li><strong>Communicate with you</strong> — send important service updates (we do not send marketing emails).</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Data Storage & Security</h2>
              <p>
                Your data is stored securely using <strong>Google Firebase</strong>, which provides
                enterprise-grade security infrastructure including:
              </p>
              <ul>
                <li>Data encryption in transit (TLS/SSL) and at rest</li>
                <li>Firebase Authentication for secure sign-in</li>
                <li>Firestore Security Rules restricting data access to authorized users</li>
                <li>Regular security audits and compliance certifications (SOC 2, ISO 27001)</li>
              </ul>
              <p>
                While we take reasonable measures to protect your data, no method of electronic
                storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Data Sharing</h2>
              <p>We do <strong>not</strong> sell, trade, or rent your personal information. We may share data in these limited cases:</p>
              <ul>
                <li><strong>Public leaderboards</strong> — Your username, score, and streak are visible to other players.</li>
                <li><strong>Service providers</strong> — We use Google Firebase for hosting, authentication, and data storage. Google&apos;s privacy policy applies to their services.</li>
                <li><strong>Legal compliance</strong> — If required by law, court order, or governmental request.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> your personal data at any time through your profile page.</li>
                <li><strong>Update</strong> your profile information (username, display name).</li>
                <li><strong>Delete</strong> your account by contacting us — we will remove your profile data and anonymize your scores.</li>
                <li><strong>Opt out</strong> of non-essential data collection by playing as a guest.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. Cookies & Local Storage</h2>
              <p>
                RouteToGlory uses browser local storage and session storage to:
              </p>
              <ul>
                <li>Maintain your authentication session</li>
                <li>Store game preferences locally</li>
                <li>Implement rate limiting for security</li>
              </ul>
              <p>We do not use third-party tracking cookies or advertising cookies.</p>
            </section>

            <section className="legal-section">
              <h2>7. Children&apos;s Privacy</h2>
              <p>
                RouteToGlory is not directed at children under 13. We do not knowingly collect
                personal information from children. If you believe a child under 13 has provided
                us with personal data, please contact us and we will delete it promptly.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. When we make significant changes,
                we will notify users through an in-app notice. Continued use of RouteToGlory after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Contact</h2>
              <p>
                If you have questions about this privacy policy or your data, please reach out to us
                at <a href="mailto:privacy@routetoglory.com" className="legal-link">privacy@routetoglory.com</a>.
              </p>
            </section>

          </Card>
        </div>
      </div>
    </div>
  );
}
