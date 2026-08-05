import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import MoodGenerator from './pages/MoodGenerator';
import LikedSongs from './pages/LikedSongs';
import HistoryPage from './pages/HistoryPage';
import TimeCapsule from './pages/TimeCapsule';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-gray-400">Loading EchoBeats...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mood" element={<MoodGenerator />} />
            <Route path="/liked" element={<LikedSongs />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/timecapsule" element={<TimeCapsule />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
