import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchPlayers } from '../../lib/playerData';

export default function GuessInput({ onSubmit, disabled }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      const results = searchPlayers(query);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (player) => {
    setQuery(player.name);
    setShowSuggestions(false);
    onSubmit(player.name);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && query.trim()) {
        onSubmit(query.trim());
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (query.trim()) {
          onSubmit(query.trim());
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div className="guess-input-wrapper">
      <div className="guess-input-container">
        <Search size={20} className="guess-input-icon" />
        <input
          ref={inputRef}
          type="text"
          className="guess-input"
          placeholder="Type a player name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className="guess-submit-btn"
          onClick={() => query.trim() && onSubmit(query.trim())}
          disabled={disabled || !query.trim()}
        >
          Guess
        </button>
      </div>

      {showSuggestions && (
        <ul className="guess-suggestions" ref={listRef}>
          {suggestions.map((player, i) => (
            <li
              key={player.id}
              className={`guess-suggestion ${i === selectedIndex ? 'guess-suggestion-active' : ''}`}
              onMouseDown={() => handleSelect(player)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className="guess-suggestion-name">{player.name}</span>
              <span className="guess-suggestion-meta">{player.nationality} · {player.position}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
