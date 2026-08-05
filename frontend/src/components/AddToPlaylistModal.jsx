import { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Plus, X, FolderPlus } from 'lucide-react';

const AddToPlaylistModal = ({ song, onClose }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    const songId = song._id || song;

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const { data } = await API.get('/playlists');
                setPlaylists(data);
            } catch (error) {
                toast.error("Failed to load playlists");
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

    const addToPlaylist = async (playlist) => {
        try {
            const existingSongIds = (playlist.songs || []).map(s => s._id || s);
            if (existingSongIds.includes(songId)) {
                toast.info(`Track is already in "${playlist.name}"`);
                onClose();
                return;
            }

            const updatedSongs = [...existingSongIds, songId];
            await API.put(`/playlists/${playlist._id}`, { songs: updatedSongs });
            toast.success(`Added "${song.title || 'Track'}" to "${playlist.name}" 🎵`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add song to playlist");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-primary" /> Add to Playlist
                    </h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-400 text-xs">Loading playlists...</div>
                ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist._id}
                                onClick={() => addToPlaylist(playlist)}
                                className="flex items-center justify-between p-3 rounded-2xl glass-card hover:border-primary/40 cursor-pointer transition-all"
                            >
                                <span className="text-xs font-bold text-white truncate">{playlist.name}</span>
                                <Plus className="w-4 h-4 text-primary" />
                            </div>
                        ))}
                        {playlists.length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-6">
                                No playlists found. Create one in your Library!
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
