export default function ClubBadge({ club, size = 40 }) {
  const getClubColor = (name) => {
    const colors = {
      'real madrid': '#FEBE10', 'barcelona': '#A50044', 'manchester united': '#DA291C',
      'manchester city': '#6CABDD', 'liverpool': '#C8102E', 'chelsea': '#034694',
      'arsenal': '#EF0107', 'bayern munich': '#DC052D', 'juventus': '#000000',
      'paris saint-germain': '#004170', 'ac milan': '#FB090B', 'inter milan': '#009FF1',
      'borussia dortmund': '#FDE100', 'tottenham hotspur': '#132257', 'atletico madrid': '#CB3524',
      'sevilla': '#D4021D', 'napoli': '#12A0D7', 'roma': '#8E1F2F',
      'ajax': '#D2122E', 'psv': '#ED1C24', 'celtic': '#006736',
      'sporting cp': '#00593E', 'porto': '#003893', 'benfica': '#FF0000',
      'monaco': '#E7001B', 'marseille': '#2FAEE0', 'lyon': '#1A5297',
      'al nassr': '#FEDF00', 'al hilal': '#0A4595', 'flamengo': '#E82D2D',
      'santos': '#000000', 'inter miami': '#F7B5CD', 'la galaxy': '#00245D',
    };
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(colors)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
    // Generate from name
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
  };

  const getInitials = (name) => {
    return name.split(/[\s-]+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
  };

  const color = getClubColor(club);

  return (
    <div
      className="club-badge"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.28,
        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
        border: `1.5px solid ${color}44`,
        color: color,
      }}
      title={club}
    >
      {getInitials(club)}
    </div>
  );
}
