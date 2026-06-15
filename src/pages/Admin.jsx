import { useState } from 'react';
import { PLAYERS_DATA } from '../lib/playerData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import '../styles/admin.css';

const ADMIN_TABS = [
  { id: 'players', label: 'Players', icon: '⚽' },
  { id: 'challenges', label: 'Challenges', icon: '📅' },
  { id: 'users', label: 'Users', icon: '👤' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('players');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);

  const filteredPlayers = PLAYERS_DATA.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="body-sm text-secondary">Manage players, challenges, and view analytics.</p>
          </div>
        </div>

        <Tabs tabs={ADMIN_TABS} activeTab={activeTab} onChange={setActiveTab} className="admin-tabs" />

        {activeTab === 'players' && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <div className="admin-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => { setEditPlayer(null); setModalOpen(true); }}>
                Add Player
              </Button>
            </div>

            <Card padding="none">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Position</th>
                    <th>Difficulty</th>
                    <th>Clubs</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="admin-name">{player.name}</td>
                      <td>{player.nationality}</td>
                      <td>{player.position}</td>
                      <td>
                        <Badge variant={player.difficulty === 'easy' ? 'success' : player.difficulty === 'medium' ? 'warning' : 'danger'} size="sm">
                          {player.difficulty}
                        </Badge>
                      </td>
                      <td>{player.career.length}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" onClick={() => { setEditPlayer(player); setModalOpen(true); }} title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button className="admin-action-btn admin-action-danger" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <p className="body-sm text-secondary" style={{ marginTop: 12 }}>{filteredPlayers.length} players</p>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="admin-section">
            <Card padding="lg">
              <h3>Daily Challenges</h3>
              <p className="body-sm text-secondary" style={{ marginBottom: 20 }}>
                Schedule daily challenges for players. Select a player and game mode for each day.
              </p>
              <div className="admin-challenge-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="admin-challenge-day">
                    <span className="admin-day-label overline">{day}</span>
                    <div className="admin-day-slot">
                      <Plus size={16} />
                      <span className="body-sm text-secondary">Add</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <Card padding="lg">
              <h3>User Management</h3>
              <p className="body-sm text-secondary" style={{ marginBottom: 20 }}>
                View and manage registered users.
              </p>
              <table className="admin-table">
                <thead>
                  <tr><th>Username</th><th>Score</th><th>Games</th><th>Joined</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {['CR7Fanatic', 'GoalMachine', 'TikiTaka99', 'PitchMaster', 'LeoTheGoat'].map((name, i) => (
                    <tr key={i}>
                      <td className="admin-name">{name}</td>
                      <td>{(4200 - i * 350).toLocaleString()}</td>
                      <td>{89 - i * 8}</td>
                      <td>2025-{String(i + 1).padStart(2, '0')}-15</td>
                      <td><Badge variant="success" size="sm">Active</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="admin-section">
            <div className="grid grid-4">
              <Card padding="md" className="admin-stat-card">
                <div className="admin-stat-label body-sm text-secondary">Total Users</div>
                <div className="admin-stat-value">2,341</div>
              </Card>
              <Card padding="md" className="admin-stat-card">
                <div className="admin-stat-label body-sm text-secondary">Games Today</div>
                <div className="admin-stat-value">847</div>
              </Card>
              <Card padding="md" className="admin-stat-card">
                <div className="admin-stat-label body-sm text-secondary">Avg Score</div>
                <div className="admin-stat-value">68.4</div>
              </Card>
              <Card padding="md" className="admin-stat-card">
                <div className="admin-stat-label body-sm text-secondary">Popular Mode</div>
                <div className="admin-stat-value">Classic</div>
              </Card>
            </div>
          </div>
        )}

        {/* Add/Edit Player Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editPlayer ? 'Edit Player' : 'Add Player'} size="lg">
          <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
            <div className="admin-form-row">
              <Input label="Player Name" placeholder="e.g. Kylian Mbappé" defaultValue={editPlayer?.name || ''} />
              <Input label="Nationality" placeholder="e.g. France" defaultValue={editPlayer?.nationality || ''} />
            </div>
            <div className="admin-form-row">
              <Input label="Position" placeholder="e.g. Forward" defaultValue={editPlayer?.position || ''} />
              <Input label="Age" type="number" placeholder="e.g. 25" defaultValue={editPlayer?.age || ''} />
            </div>
            <div className="admin-form-row">
              <div className="input-group">
                <label className="input-label">Difficulty</label>
                <select className="admin-select" defaultValue={editPlayer?.difficulty || 'medium'}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Player Image</label>
                <input type="file" className="admin-file-input" accept="image/*" />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: 8 }}>
              <label className="input-label">Career History (one per line: Club Name, Start Year, End Year)</label>
              <textarea
                className="admin-textarea"
                rows={5}
                placeholder="Barcelona, 2004, 2021&#10;PSG, 2021, 2023"
                defaultValue={editPlayer?.career?.map(c => `${c.club}, ${c.years}`).join('\n') || ''}
              />
            </div>

            <div className="admin-form-actions">
              <Button variant="ghost" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
              <Button variant="primary">{editPlayer ? 'Save Changes' : 'Add Player'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
