import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

const Layout = () => {
    const { user, loading } = useAuth();
    const { currentSong } = usePlayer();
    const location = useLocation();

    // Check if user is authenticated
    if (loading) {
        return <div className="h-screen bg-black flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="flex bg-black">
            <Sidebar />
            <div className="ml-64 w-full h-screen overflow-y-auto bg-gradient-to-b from-[#121212] to-black text-white p-6 pb-32">
                <Outlet />
            </div>
            {currentSong && <Player />}
        </div>
    );
};

export default Layout;
