import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdHome, MdLibraryMusic, MdPerson, MdSearch, MdSettings, MdLogout } from 'react-icons/md';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="w-64 bg-black h-screen fixed left-0 top-0 flex flex-col p-6 z-40 overflow-y-auto">
            <div
                className="flex items-center gap-2 mb-8 cursor-pointer group"
                onClick={() => navigate('/')}
            >
                <div className="bg-primary p-2 rounded-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <MdLibraryMusic className="text-black text-2xl" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter">
                    Echo<span className="text-primary">Beats</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                <div
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-4 text-white p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${location.pathname === '/' ? 'bg-white/10' : ''}`}
                >
                    <MdHome className="text-2xl" />
                    <span className="font-medium text-lg">Home</span>
                </div>

                <div
                    onClick={() => navigate('/search')}
                    className={`flex items-center gap-4 text-white p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${location.pathname === '/search' ? 'bg-white/10' : ''}`}
                >
                    <MdSearch className="text-2xl" />
                    <span className="font-medium text-lg">Search</span>
                </div>

                <div
                    onClick={() => navigate('/library')}
                    className={`flex items-center gap-4 text-white p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${location.pathname === '/library' ? 'bg-white/10' : ''}`}
                >
                    <MdLibraryMusic className="text-2xl" />
                    <span className="font-medium text-lg">Your Library</span>
                </div>

                <div
                    onClick={() => navigate('/mood')}
                    className={`flex items-center gap-4 text-white p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${location.pathname === '/mood' ? 'bg-white/10' : ''}`}
                >
                    <MdSettings className="text-xl" />
                    <span className="font-medium text-lg">Mood Mix (Beta)</span>
                </div>

                <hr className="bg-gray-800 border-gray-800 my-4" />

                <div className="flex items-center gap-4 text-gray-400 p-3 hover:text-white cursor-pointer transition">
                    <MdSettings className="text-xl" />
                    <span className="font-medium">Settings</span>
                </div>

                <div className="flex items-center gap-4 text-gray-400 p-3 hover:text-white cursor-pointer transition" onClick={() => navigate('/profile')}>
                    <MdPerson className="text-xl" />
                    <span className="font-medium">Profile</span>
                </div>
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-3 text-red-500 font-bold mt-auto p-3 hover:bg-red-500/10 rounded-lg transition-colors w-full"
            >
                <MdLogout className="text-xl" />
                Logout
            </button>
        </aside>
    );
};

export default Sidebar;
