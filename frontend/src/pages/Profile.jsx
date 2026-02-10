import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaClock, FaMusic, FaChartLine } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/users/analytics');
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats", error);
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) return <div className="text-white p-8">Loading stats...</div>;

    return (
        <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-8">Profile & Analytics</h1>

            <div className="bg-neutral-900 p-8 rounded-lg mb-12 flex items-center gap-6">
                <div className="w-24 h-24 bg-primary text-black rounded-full flex items-center justify-center text-4xl font-bold uppercase">
                    {user?.username?.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    <p className="text-gray-400">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-2">Member since {new Date().getFullYear()}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaChartLine /> Listening Habits</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider">Total Plays</h3>
                        <FaMusic className="text-2xl opacity-50" />
                    </div>
                    <p className="text-4xl font-bold">{stats?.totalSongsPlayed || 0}</p>
                    <p className="text-sm opacity-75 mt-2">Songs streamed</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider">Listening Time</h3>
                        <FaClock className="text-2xl opacity-50" />
                    </div>
                    <p className="text-4xl font-bold">{Math.floor(stats?.totalDuration / 60)}m</p>
                    <p className="text-sm opacity-75 mt-2">{(stats?.totalDuration % 60)}s total duration</p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider">Favorite Track</h3>
                        <FaMusic className="text-2xl opacity-50" />
                    </div>
                    {stats?.mostPlayedSong ? (
                        <>
                            <p className="text-xl font-bold truncate">{stats.mostPlayedSong.title}</p>
                            <p className="text-sm opacity-75 mt-1">{stats?.mostPlayedCount} plays</p>
                        </>
                    ) : (
                        <p className="text-lg">No data yet</p>
                    )}
                </div>
            </div>

            {/* Recently Played */}
            {/* Can be implemented similarly by fetching user recent history from backend or AuthContext if updated */}
        </div>
    );
};

export default Profile;
