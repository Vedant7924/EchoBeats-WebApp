import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBolt, FaCoffee, FaDumbbell, FaGlassCheers, FaCloudRain, FaHeart } from 'react-icons/fa';

const moods = [
    { name: 'chill', icon: <FaCoffee />, color: 'bg-green-500' },
    { name: 'workout', icon: <FaDumbbell />, color: 'bg-red-500' },
    { name: 'focus', icon: <FaBolt />, color: 'bg-blue-500' },
    { name: 'party', icon: <FaGlassCheers />, color: 'bg-purple-500' },
    { name: 'sad', icon: <FaCloudRain />, color: 'bg-gray-500' },
    { name: 'romantic', icon: <FaHeart />, color: 'bg-pink-500' }
];

const MoodGenerator = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const generatePlaylist = async (mood) => {
        setLoading(true);
        try {
            // 1. Fetch songs
            const { data: songs } = await api.get(`/songs/mood/${mood}`);

            if (songs.length === 0) {
                toast.info(`No songs found for ${mood} mood`);
                setLoading(false);
                return;
            }

            // 2. Create Playlist
            const playlistName = `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mix`;
            const { data: playlist } = await api.post('/playlists', {
                name: playlistName,
                description: `Auto-generated ${mood} playlist`,
                songs: songs.map(s => s._id),
                isPublic: false
            });

            toast.success("Playlist generated!");
            navigate(`/playlist/${playlist._id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate playlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-8">Mood Playlist Generator</h1>
            <p className="text-gray-400 mb-8">Select your current vibe and we'll build the perfect playlist for you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {moods.map((m) => (
                    <div
                        key={m.name}
                        onClick={() => generatePlaylist(m.name)}
                        className={`${m.color} p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center h-48`}
                    >
                        <div className="text-4xl mb-4">{m.icon}</div>
                        <h2 className="text-2xl font-bold uppercase tracking-wider">{m.name}</h2>
                    </div>
                ))}
            </div>

            {loading && <div className="mt-8 text-center text-xl animate-pulse">Generating your mix...</div>}
        </div>
    );
};

export default MoodGenerator;
