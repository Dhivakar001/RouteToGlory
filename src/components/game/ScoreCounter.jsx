import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreCounter({ score, totalScore }) {
  return (
    <div className="score-counter">
      <div className="score-total">
        <span className="score-label">Score</span>
        <span className="score-value">{totalScore}</span>
      </div>
      <AnimatePresence>
        {score > 0 && (
          <motion.div
            className="score-popup"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            +{score}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
