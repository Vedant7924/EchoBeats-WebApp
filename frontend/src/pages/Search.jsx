import { useState, useEffect } from 'react';
import API from '../utils/api';
import SongCard from '../components/SongCard';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { Search as SearchIcon, X, Sliders } from 'lucide-react';

const moods = ['Chill', 'Party', 'Workout', 'Focus', 'Romantic', 'Happy', 'Sad'];

const Search = () => {
    const [query, setQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState('');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

    useEffect(() => {
        const searchSongs = async () => {
            try {
                setLoading(true);
                let params = [];
                if (query.trim()) params.push(`q=${encodeURIComponent(query.trim())}`);
                if (selectedMood) params.push(`mood=${encodeURIComponent(selectedMood)}`);

                const url = params.length > 0 ? `/songs?${params.join('&')}` : '/songs';
                const res = await API.get(url);
                setSongs(res.data);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchSongs, 300);
        return () => clearTimeout(timer);
    }, [query, selectedMood]);

    return (
        <div className="space-y-8 pb-12">
            {/* Search Input Hero */}
            <div className="space-y-4">
                <div className="relative max-w-2xl">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tracks, artists, albums, or moods..."
                        className="w-full pl-12 pr-10 py-4 rounded-2xl bg-card border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm shadow-xl transition-all"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-1">
                        <Sliders className="w-3.5 h-3.5" /> Filter:
                    </span>
                    <button
                        onClick={() => setSelectedMood('')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedMood === ''
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : 'glass-card text-gray-400 border-white/5 hover:text-white'
                        }`}
                    >
                        All Moods
                    </button>
                    {moods.map((m) => (
                        <button
                            key={m}
                            onClick={() => setSelectedMood(selectedMood === m ? '' : m)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                selectedMood === m
                                    ? 'bg-primary text-black border-primary font-bold'
                                    : 'glass-card text-gray-400 border-white/5 hover:text-white'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                        {query || selectedMood ? `Search Results (${songs.length})` : 'All Tracks'}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-400">Searching audio library...</div>
                ) : songs.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 text-center text-gray-400">
                        No tracks matched your search query. Try another keyword.
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

            {selectedSongForPlaylist && (
                <AddToPlaylistModal
                    song={selectedSongForPlaylist}
                    onClose={() => setSelectedSongForPlaylist(null)}
                />
            )}
        </div>
    );
};

export default Search;
