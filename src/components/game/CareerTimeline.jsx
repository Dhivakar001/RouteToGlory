import { motion } from 'framer-motion';
import ClubBadge from '../shared/ClubBadge';

export default function CareerTimeline({ career, mode = 'classic' }) {
  if (mode === 'hardcore') {
    // Only show first club
    const first = career[0];
    return (
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-dot" />
          <ClubBadge club={first.club} size={44} />
          <div className="timeline-info">
            <span className="timeline-club">{first.club}</span>
            <span className="timeline-years">{first.years}</span>
          </div>
        </div>
        <div className="timeline-hidden">
          <span>+{career.length - 1} more clubs hidden</span>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline">
      {career.map((step, i) => (
        <motion.div
          key={i}
          className="timeline-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.35 }}
        >
          <div className="timeline-connector">
            <div className="timeline-dot" />
            {i < career.length - 1 && <div className="timeline-line" />}
          </div>
          <ClubBadge club={step.club} size={44} />
          <div className="timeline-info">
            <span className="timeline-club">{step.club}</span>
            <span className="timeline-years">{step.years}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
