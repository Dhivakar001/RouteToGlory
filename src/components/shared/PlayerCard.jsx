import ClubBadge from './ClubBadge';
import Badge from '../ui/Badge';

export default function PlayerCard({ player, revealed = true, onClick }) {
  const diffColors = { easy: 'success', medium: 'warning', hard: 'danger' };

  return (
    <div className="player-card" onClick={onClick}>
      <div className="player-card-clubs">
        {player.career.slice(0, 3).map((c, i) => (
          <ClubBadge key={i} club={c.club} size={32} />
        ))}
        {player.career.length > 3 && (
          <span className="player-card-more">+{player.career.length - 3}</span>
        )}
      </div>
      {revealed ? (
        <div className="player-card-info">
          <h4 className="player-card-name">{player.name}</h4>
          <span className="player-card-nat">{player.nationality} · {player.position}</span>
        </div>
      ) : (
        <div className="player-card-info">
          <h4 className="player-card-name">???</h4>
          <span className="player-card-nat">Guess this player</span>
        </div>
      )}
      <Badge variant={diffColors[player.difficulty]}>{player.difficulty}</Badge>
    </div>
  );
}
