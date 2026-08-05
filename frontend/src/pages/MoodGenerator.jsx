import { useState } from 'react';
import API from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import { Smile, Play, Sparkles } from 'lucide-react';

const moods = [
    { name: 'Chill', color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400', desc: 'Ambient lo-fi & calming soundscapes' },
    { name: 'Party', color: 'from-pink-500/20 to-purple-500/10 border-pink-500/30 text-pink-400', desc: 'High-energy electronic & dance beats' },
    { name: 'Workout', color: 'from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-400', desc: 'Pump-up rhythm & cardio motivation' },
    { name: 'Focus', color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400', desc: 'Alpha wave study & deep flow music' },
    { name: 'Romantic', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400', desc: 'Sensual acoustics & moonlit serenades' },
    { name: 'Happy', color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400', desc: 'Uplifting sunshine pop & bright vibes' },
    { name: 'Sad', color: 'from-slate-500/20 to-indigo-500/10 border-slate-500/30 text-slate-400', desc: 'Melancholic piano & reflective melodies' },
];

const MoodGenerator = () => {
    const [selectedMood, setSelectedMood] = useState('Chill');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    const { playQueue } = usePlayer();

    const fetchMoodSongs = async (moodName) => {
        try {
            setSelectedMood(moodName);
            setLoading(true);
            const res = await API.get(`/songs?mood=${moodName}`);
            setSongs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Hero */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-primary/20 via-card to-surface border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-xl">
                        <Smile className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-primary">Smart Discovery Engine</span>
                        <h1 className="text-3xl font-black text-white tracking-tight">Mood Generator</h1>
                        <p className="text-sm text-gray-400 mt-1">Select your current vibe to build instant audio sessions</p>
                    </div>
                </div>

                {songs.length > 0 && (
                    <button
                        onClick={() => playQueue(songs)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-black font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        <Play className="w-5 h-5 fill-current" /> Play {selectedMood} Station
                    </button>
                )}
            </div>

            {/* Mood Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {moods.map((m) => (
                    <button
                        key={m.name}
                        onClick={() => fetchMoodSongs(m.name)}
                        className={`p-5 rounded-3xl border text-left transition-all bg-gradient-to-br ${m.color} ${
                            selectedMood === m.name
                                ? 'scale-105 shadow-xl border-2 font-bold ring-2 ring-primary/40'
                                : 'hover:scale-102 opacity-80 hover:opacity-100'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider block mb-1">{m.name}</span>
                        <p className="text-[11px] text-gray-300 line-clamp-2">{m.desc}</p>
                    </button>
                ))}
            </div>

            {/* Song Grid Output */}
            <div className="space-y-4 pt-4">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> {selectedMood} Station Queue ({songs.length} Tracks)
                </h2>

                {loading ? (
                    <div className="text-center py-16 text-gray-400">Tuning into {selectedMood} station...</div>
                ) : songs.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 text-center text-gray-400">
                        Click any mood station above to generate songs!
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {songs.map((song) => (
                            <SongCard key={song._id} song={song} songList={songs} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodGenerator;
