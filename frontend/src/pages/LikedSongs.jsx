import { useEffect, useState } from 'react';
import API from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { useLiked } from '../hooks/useLiked';
import SongCard from '../components/SongCard';
import { Heart, Play } from 'lucide-react';

const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();
    const { likedIds } = useLiked();

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await API.get('/users/likes');
                setSongs(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, []);

    // Filter songs dynamically based on active likedIds
    const activeLikedSongs = songs.filter(song => likedIds.has(song._id));

    return (
        <div className="space-y-8 pb-12">
            {/* Header Hero */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-surface border border-rose-500/20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shadow-2xl">
                        <Heart className="w-12 h-12 text-rose-500 fill-current" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-rose-400">Personal Collection</span>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Liked Songs</h1>
                        <p className="text-sm text-gray-400 mt-1">{activeLikedSongs.length} tracks saved to your library</p>
                    </div>
                </div>

                {activeLikedSongs.length > 0 && (
                    <button
                        onClick={() => playQueue(activeLikedSongs)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-500 text-white font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-rose-500/20"
                    >
                        <Play className="w-5 h-5 fill-current" /> Play Collection
                    </button>
                )}
            </div>

            {/* Content List */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading your liked songs...</div>
            ) : activeLikedSongs.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center space-y-3">
                    <Heart className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                    <h3 className="text-lg font-bold text-white">No Liked Songs Yet</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        Click the heart icon on any song to add it to your personal collection.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {activeLikedSongs.map((song) => (
                        <SongCard key={song._id} song={song} songList={activeLikedSongs} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikedSongs;
