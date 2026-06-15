import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Zap, Users, Globe, Shield, Trophy, Heart } from 'lucide-react';
import '../styles/info-pages.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }),
};

export default function About() {
  return (
    <div className="info-page">
      <div className="container">
        {/* Hero */}
        <motion.div className="info-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="gold" size="md">About Us</Badge>
          <h1>The beautiful game,<br /><span className="text-gold">one guess at a time.</span></h1>
          <p className="body-lg text-secondary info-hero-sub">
            RouteToGlory is a football trivia platform that challenges your knowledge
            of the beautiful game — from career paths and transfers to trophies and records.
          </p>
        </motion.div>

        {/* Mission */}
        <section className="info-section">
          <div className="info-two-col">
            <motion.div className="info-content" initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span className="overline" custom={0} variants={fadeUp}>Our Mission</motion.span>
              <motion.h2 custom={1} variants={fadeUp}>Built by fans,<br />for fans</motion.h2>
              <motion.p className="body text-secondary" custom={2} variants={fadeUp}>
                We believe football knowledge should be celebrated. RouteToGlory was born from
                late-night debates about transfers, career paths, and the players who defined eras.
                We turned those conversations into a game that anyone can enjoy.
              </motion.p>
              <motion.p className="body text-secondary" custom={3} variants={fadeUp}>
                Whether you&apos;re a casual viewer or a die-hard supporter, RouteToGlory offers
                a challenge tailored to your level — from easy warm-ups to hardcore brain-teasers
                that even pundits would struggle with.
              </motion.p>
            </motion.div>
            <motion.div className="info-feature-grid" initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {[
                { icon: <Trophy size={22} />, title: 'Multiple Game Modes', desc: 'Classic, Trophy, Nationality, Time Attack, Hardcore & Daily Challenge.' },
                { icon: <Zap size={22} />, title: 'Instant Gameplay', desc: 'No signup required. Jump in as a guest and start guessing immediately.' },
                { icon: <Users size={22} />, title: 'Global Leaderboard', desc: 'Compete against football fans worldwide and climb the rankings.' },
                { icon: <Shield size={22} />, title: 'Achievement System', desc: 'Unlock badges, build streaks, and track your progress over time.' },
              ].map((feature, i) => (
                <motion.div key={i} custom={i} variants={fadeUp}>
                  <Card className="info-feature-card" padding="md">
                    <div className="info-feature-icon">{feature.icon}</div>
                    <h4>{feature.title}</h4>
                    <p className="body-sm text-secondary">{feature.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="info-section">
          <div className="info-section-header">
            <span className="overline">How It Works</span>
            <h2>Simple rules, endless fun</h2>
          </div>
          <div className="info-steps">
            {[
              { num: '01', title: 'We show you clues', desc: 'Career paths, trophies, nationalities, or a mix — depending on the game mode you choose.' },
              { num: '02', title: 'You make your guess', desc: 'Type the player\'s name. Use hints if you get stuck, but each hint reduces your score.' },
              { num: '03', title: 'Earn points & climb ranks', desc: 'Score points for correct guesses, build streaks, unlock achievements, and rise through the ranks from Rookie to GOAT.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="info-step"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="info-step-num">{step.num}</div>
                <div className="info-step-content">
                  <h3>{step.title}</h3>
                  <p className="body-sm text-secondary">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="info-section">
          <div className="info-section-header text-center">
            <span className="overline">Our Values</span>
            <h2>What we stand for</h2>
          </div>
          <div className="grid grid-3">
            {[
              { icon: <Heart size={24} />, title: 'Passion First', desc: 'Every question, every feature, and every pixel is crafted with genuine love for the game.' },
              { icon: <Globe size={24} />, title: 'For Everyone', desc: 'Football is global. Our platform welcomes fans from every league, every country, every background.' },
              { icon: <Shield size={24} />, title: 'Fair Play', desc: 'No pay-to-win mechanics. No intrusive ads. Just pure football knowledge, fairly tested.' },
            ].map((value, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card padding="lg" className="info-value-card">
                  <div className="info-value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p className="body-sm text-secondary">{value.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="info-section info-cta">
          <Card padding="lg" className="info-cta-card">
            <h2>Ready to test your knowledge?</h2>
            <p className="body text-secondary">
              Join thousands of football fans. No signup required — start playing now.
            </p>
            <div className="info-cta-actions">
              <Link to="/play">
                <Button variant="gold" size="lg" icon={<Zap size={18} />}>Start Playing</Button>
              </Link>
              <Link to="/auth">
                <Button variant="secondary" size="lg">Create Account</Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
