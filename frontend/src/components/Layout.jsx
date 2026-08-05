import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

const Layout = () => {
    const { user, loading } = useAuth();
    const { currentSong } = usePlayer();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen bg-surface flex items-center justify-center text-gray-400 font-mono text-xs">
                Loading EchoBeats Audio Engine...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="flex min-h-screen bg-surface selection:bg-primary selection:text-black">
            <Sidebar />
            <main className="ml-64 flex-1 min-h-screen overflow-y-auto bg-gradient-to-b from-[#0f0f1a] via-surface to-surface text-white p-6 sm:p-8 pb-32">
                <Outlet />
            </main>
            {currentSong && <Player />}
        </div>
    );
};

export default Layout;
