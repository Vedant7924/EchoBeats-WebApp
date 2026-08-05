import { useEffect, useState } from 'react';
import API from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { Play, Sparkles, Flame, Radio } from 'lucide-react';

const moodsList = ['All', 'Chill', 'Party', 'Workout', 'Focus', 'Romantic', 'Happy', 'Sad'];

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [selectedMood, setSelectedMood] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const endpoint = selectedMood === 'All' ? '/songs' : `/songs?mood=${selectedMood}`;
                const res = await API.get(endpoint);
                setSongs(res.data);
            } catch (err) {
                console.error('Failed to load songs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [selectedMood]);

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-primary/20 via-accent/15 to-surface border border-primary/20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Next-Gen Audio Experience
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        Stream Without Limits. Feel Every Beat.
                    </h1>
                    <p className="text-sm text-gray-300">
                        Discover 62+ curated tracks, mood-based stations, procedural visualizations, and dynamic Mood DNA analytics.
                    </p>

                    <div className="pt-2 flex items-center gap-4">
                        {songs.length > 0 && (
                            <button
                                onClick={() => playQueue(songs)}
                                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-black font-extrabold text-sm hover:scale-105 transition-all shadow-xl shadow-primary/25"
                            >
                                <Play className="w-5 h-5 fill-current" /> Play All Featured
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative hidden md:block w-64 h-64 flex-shrink-0">
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 border border-white/20 p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80"
                            alt="Hero Cover"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Mood Station Quick Bar */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Radio className="w-4 h-4 text-primary" /> Mood Stations
                    </h2>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {moodsList.map((mood) => (
                        <button
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                                selectedMood === mood
                                    ? 'bg-primary text-black border-primary font-black shadow-lg shadow-primary/20 scale-105'
                                    : 'glass-card text-gray-300 border-white/10 hover:text-white hover:border-white/20'
                            }`}
                        >
                            {mood === 'All' ? '🔥 All Songs' : mood}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Songs Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <Flame className="w-5 h-5 text-accent" /> Trending {selectedMood !== 'All' ? `${selectedMood} Beats` : 'Collection'}
                    </h2>
                    <span className="text-xs text-gray-400 font-mono">{songs.length} tracks available</span>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-400">Loading audio library...</div>
                ) : songs.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 text-center text-gray-400">
                        No songs found for this mood station.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {songs.map((song) => (
                            <SongCard
                                key={song._id}
                                song={song}
                                songList={songs}
                                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add To Playlist Modal */}
            {selectedSongForPlaylist && (
                <AddToPlaylistModal
                    song={selectedSongForPlaylist}
                    onClose={() => setSelectedSongForPlaylist(null)}
                />
            )}
        </div>
    );
};

export default Home;
