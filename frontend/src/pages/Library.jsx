import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Plus, Play, Music, FolderPlus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const { data } = await API.get('/playlists');
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
        if (!newPlaylistName.trim()) return;
        try {
            const { data } = await API.post('/playlists', { name: newPlaylistName.trim(), songs: [] });
            setPlaylists([...playlists, data]);
            setShowModal(false);
            setNewPlaylistName('');
            toast.success("Playlist created! 🎵");
        } catch (error) {
            console.error("Create playlist error:", error);
            toast.error(error.response?.data?.message || "Failed to create playlist");
        }
    };

    const handleDeletePlaylist = async (e, playlistId) => {
        e.stopPropagation();
        try {
            await API.delete(`/playlists/${playlistId}`);
            setPlaylists(prev => prev.filter(p => p._id !== playlistId));
            toast.info("Playlist deleted");
        } catch (error) {
            toast.error("Failed to delete playlist");
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Hero */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Your Library</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage your personal playlists and saved music collections</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-black font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus className="w-5 h-5" /> Create Playlist
                </button>
            </div>

            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading library...</div>
            ) : playlists.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center space-y-4">
                    <FolderPlus className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                    <h3 className="text-lg font-bold text-white">No Playlists Created Yet</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        Create custom playlists to organize your favorite tracks by mood, genre, or vibe.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2.5 rounded-full bg-primary text-black font-bold text-xs hover:scale-105 transition-all"
                    >
                        Create Your First Playlist
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            onClick={() => navigate(`/playlist/${playlist._id}`)}
                            className="group glass-card rounded-2xl p-4 cursor-pointer relative flex flex-col justify-between"
                        >
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-tr from-surface via-card to-secondary border border-white/10 flex items-center justify-center">
                                <Music className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform" />

                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <div className="p-3 rounded-full bg-primary text-black shadow-lg">
                                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <div className="truncate min-w-0">
                                    <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                                        {playlist.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{playlist.songs?.length || 0} tracks</p>
                                </div>
                                <button
                                    onClick={(e) => handleDeletePlaylist(e, playlist._id)}
                                    className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                                    title="Delete Playlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Playlist Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-panel border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-lg font-bold text-white">Create New Playlist</h2>
                        <input
                            type="text"
                            placeholder="Playlist Title (e.g. Midnight Beats)"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-surface border border-white/10 text-white text-sm outline-none focus:border-primary"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePlaylist}
                                className="px-5 py-2.5 rounded-full bg-primary text-black font-bold text-xs hover:scale-105 transition-all"
                            >
                                Create Playlist
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
