import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import api from '../utils/api';
import { FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    const { user } = useAuth();
    const { playSong } = usePlayer();
    const [playlists, setPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/playlists');
                setPlaylists(data);
            } catch (error) {
                console.error("Error fetching playlists", error);
                toast.error("Failed to load playlists");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPlaylists();
        }
    }, [user]);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName) return;
        try {
            const { data } = await api.post('/playlists', { name: newPlaylistName, songs: [] });
            setPlaylists([...playlists, data]);
            setShowModal(false);
            setNewPlaylistName('');
            toast.success("Playlist created!");
        } catch (error) {
            console.error("Create playlist error:", error);
            toast.error(error.response?.data?.message || "Failed to create playlist");
        }
    };

    return (
        <div className="p-8 text-white pb-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Library</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-black font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform"
                >
                    <FaPlus /> Create Playlist
                </button>
            </div>

            {loading ? <div className="text-gray-400">Loading library...</div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className="bg-neutral-900 p-4 rounded-lg hover:bg-neutral-800 transition-colors group cursor-pointer"
                            onClick={() => navigate(`/playlist/${playlist._id}`)}
                        >
                            <div className="relative mb-4">
                                <div className="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-md shadow-lg flex items-center justify-center text-4xl text-gray-500">
                                    🎵
                                </div>
                                <div className={`absolute bottom-2 right-2 bg-primary rounded-full p-3 shadow-lg transform transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0`}>
                                    <FaPlay className="text-black pl-1" />
                                </div>
                            </div>
                            <h3 className="font-bold truncate">{playlist.name}</h3>
                            <p className="text-sm text-gray-400 truncate">By {user.username}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Playlist Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-neutral-800 p-8 rounded-lg w-96 text-center relative">
                        <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
                        <input
                            type="text"
                            placeholder="Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="w-full p-3 rounded mb-4 bg-neutral-700 text-white outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-white hover:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePlaylist}
                                className="bg-primary text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
