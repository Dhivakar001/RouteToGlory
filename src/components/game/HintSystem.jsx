import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Calendar, UserCircle, Trophy } from 'lucide-react';

const HINT_CONFIG = {
  nationality: { icon: <Globe size={18} />, label: 'Nationality', cost: 25 },
  age: { icon: <Calendar size={18} />, label: 'Age', cost: 25 },
  position: { icon: <UserCircle size={18} />, label: 'Position', cost: 25 },
  trophy: { icon: <Trophy size={18} />, label: 'Top Trophy', cost: 25 },
};

export default function HintSystem({ player, hintsRevealed, onRevealHint, disabled }) {
  const getHintValue = (type) => {
    if (!player) return '';
    switch (type) {
      case 'nationality': return player.nationality;
      case 'age': return `${player.age} years old`;
      case 'position': return player.position;
      case 'trophy': return player.trophies?.[0] || 'No major trophies listed';
      default: return '';
    }
  };

  return (
    <div className="hint-system">
      <div className="hint-header">
        <span className="overline">Hints</span>
        <span className="body-sm text-secondary">{hintsRevealed.length}/4 used</span>
      </div>
      <div className="hint-grid">
        {Object.entries(HINT_CONFIG).map(([type, config]) => {
          const isRevealed = hintsRevealed.includes(type);
          return (
            <button
              key={type}
              className={`hint-btn ${isRevealed ? 'hint-btn-revealed' : ''}`}
              onClick={() => onRevealHint(type)}
              disabled={disabled || isRevealed}
            >
              <div className="hint-btn-top">
                {config.icon}
                <span className="hint-btn-label">{config.label}</span>
              </div>
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.div
                    className="hint-btn-value"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {getHintValue(type)}
                  </motion.div>
                ) : (
                  <div className="hint-btn-cost">-{config.cost} pts</div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}
