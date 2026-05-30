import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Game from './pages/Game';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/play" element={<Game />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
