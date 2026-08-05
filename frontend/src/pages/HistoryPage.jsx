import { useEffect, useState } from 'react';
import API from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { History as HistoryIcon, Play, Clock, Calendar, RefreshCw } from 'lucide-react';

const formatDuration = (secs) => {
    if (!secs || secs < 5) return '30s session';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m > 0 ? `${m}m ${s}s listened` : `${s}s listened`;
};

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { playSong, currentSong } = usePlayer();

    const fetchHistory = async () => {
        try {
            setRefreshing(true);
            const res = await API.get('/users/history?limit=40');
            setHistory(res.data.history || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [currentSong]); // Re-fetch history whenever current song changes!

    return (
        <div className="space-y-8 pb-12">
            {/* Header Hero */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-cyan-900/40 via-surface to-surface border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-xl">
                        <HistoryIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">Activity Log</span>
                        <h1 className="text-3xl font-black text-white tracking-tight">Listening History</h1>
                        <p className="text-sm text-gray-400 mt-1">Review your recent audio sessions & duration metrics</p>
                    </div>
                </div>

                <button
                    onClick={fetchHistory}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Activity
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading history logs...</div>
            ) : history.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center space-y-3">
                    <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                    <h3 className="text-lg font-bold text-white">No Listening History Yet</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        Start playing tracks in EchoBeats to log your listening history automatically.
                    </p>
                </div>
            ) : (
                <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 space-y-2">
                    {history.map((item) => {
                        if (!item.song) return null;
                        const song = item.song;
                        const playedDate = new Date(item.playedAt || Date.now()).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div
                                key={item._id}
                                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                            >
                                <div
                                    onClick={() => playSong(song)}
                                    className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={song.coverArt} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Play className="w-5 h-5 text-white fill-current" />
                                        </div>
                                    </div>

                                    <div className="truncate min-w-0">
                                        <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                                            {song.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-gray-400">
                                    <span className="hidden sm:flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        {formatDuration(item.listenedFor)}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {playedDate}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
