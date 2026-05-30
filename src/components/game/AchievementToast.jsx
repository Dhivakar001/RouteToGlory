import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="achievement-toast"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className="achievement-toast-icon">{achievement.icon}</span>
          <div className="achievement-toast-content">
            <span className="achievement-toast-title">Achievement Unlocked!</span>
            <span className="achievement-toast-name">{achievement.name}</span>
            <span className="achievement-toast-desc">{achievement.description}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
