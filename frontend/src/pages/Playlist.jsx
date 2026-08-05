import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react';
import API from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import { Play, Music, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const Playlist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/playlists/${id}`);
                setPlaylist(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load playlist');
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [id]);

    const handleRemoveSong = async (songId) => {
        try {
            const updatedSongs = playlist.songs.filter(s => s._id !== songId).map(s => s._id);
            const res = await API.put(`/playlists/${id}`, { songs: updatedSongs });
            setPlaylist(res.data);
            toast.info('Song removed from playlist');
        } catch (err) {
            toast.error('Failed to remove song');
        }
    };

    const handleDeletePlaylist = async () => {
        try {
            await API.delete(`/playlists/${id}`);
            toast.info('Playlist deleted');
            navigate('/library');
        } catch (err) {
            toast.error('Failed to delete playlist');
        }
    };

    if (loading) return <div className="text-center py-16 text-gray-400">Loading playlist details...</div>;
    if (!playlist) return <div className="text-center py-16 text-gray-400">Playlist not found.</div>;

    return (
        <div className="space-y-8 pb-12">
            <button
                onClick={() => navigate('/library')}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Library
            </button>

            {/* Header Hero */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-xl">
                        <Music className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-primary">Custom Playlist</span>
                        <h1 className="text-3xl font-black text-white tracking-tight">{playlist.name}</h1>
                        <p className="text-sm text-gray-400 mt-1">{playlist.songs?.length || 0} tracks in queue</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {playlist.songs?.length > 0 && (
                        <button
                            onClick={() => playQueue(playlist.songs)}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <Play className="w-4 h-4 fill-current" /> Play Playlist
                        </button>
                    )}
                    <button
                        onClick={handleDeletePlaylist}
                        className="p-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all"
                        title="Delete Playlist"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Songs Grid */}
            {playlist.songs?.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center text-gray-400">
                    No songs in this playlist yet. Add songs from Home or Search!
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {playlist.songs.map((song) => (
                        <div key={song._id} className="relative group">
                            <SongCard song={song} songList={playlist.songs} />
                            <button
                                onClick={() => handleRemoveSong(song._id)}
                                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove from playlist"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Playlist;
