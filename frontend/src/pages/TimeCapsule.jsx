import { useState, useEffect } from 'react';
import API from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import { Hourglass, Play, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const presets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'All Time', days: 365 },
];

const TimeCapsule = () => {
    const [selectedDays, setSelectedDays] = useState(30);
    const [songs, setSongs] = useState([]);
    const [totalPlays, setTotalPlays] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedPlaylistId, setSavedPlaylistId] = useState(null);

    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchTimeCapsule = async () => {
            try {
                setLoading(true);
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - selectedDays);

                const res = await API.get(`/users/timecapsule?from=${fromDate.toISOString()}`);
                setSongs(res.data.songs || []);
                setTotalPlays(res.data.totalPlays || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeCapsule();
    }, [selectedDays]);

    const handleSaveAsPlaylist = async () => {
        if (songs.length === 0) return;
        try {
            setSaving(true);
            const playlistName = `Time Capsule (${selectedDays} Days)`;
            const songIds = songs.map(s => s._id);

            const res = await API.post('/playlists', {
                name: playlistName,
                description: `Memory playlist generated from ${totalPlays} play sessions over the past ${selectedDays} days.`,
                songs: songIds
            });

            setSavedPlaylistId(res.data._id);
            toast.success(`Saved "${playlistName}" to your Library! ⏳`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create playlist');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Hero */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-surface border border-accent/20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-xl">
                        <Hourglass className="w-10 h-10 text-accent animate-pulse-slow" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-accent">Memory Generator</span>
                        <h1 className="text-3xl font-black text-white tracking-tight">Audio Time Capsule</h1>
                        <p className="text-sm text-gray-400 mt-1">Revisit the exact tracks you listened to in past time periods</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {songs.length > 0 && (
                        <>
                            <button
                                onClick={() => playQueue(songs)}
                                className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-black font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-accent/20"
                            >
                                <Play className="w-4 h-4 fill-current" /> Play Capsule
                            </button>

                            <button
                                onClick={handleSaveAsPlaylist}
                                disabled={saving || savedPlaylistId}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm border transition-all ${
                                    savedPlaylistId
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                                }`}
                            >
                                {savedPlaylistId ? (
                                    <>
                                        <Check className="w-4 h-4" /> Saved!
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" /> Save as Playlist
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Range Selector Chips */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Era:</span>
                {presets.map((preset) => (
                    <button
                        key={preset.days}
                        onClick={() => {
                            setSelectedDays(preset.days);
                            setSavedPlaylistId(null);
                        }}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                            selectedDays === preset.days
                                ? 'bg-accent/20 border-accent/40 text-accent shadow-md shadow-accent/10'
                                : 'glass-card text-gray-400 border-white/5 hover:text-white'
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Song Grid */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Filtering past memory tracks...</div>
            ) : songs.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center space-y-3">
                    <Hourglass className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                    <h3 className="text-lg font-bold text-white">No Capsule Tracks Found</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        We couldn't find any listen logs in the selected time range. Listen to more music to populate your capsule!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {songs.map((song) => (
                        <SongCard key={song._id} song={song} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimeCapsule;
