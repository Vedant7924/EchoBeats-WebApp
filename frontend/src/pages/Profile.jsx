import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Sparkles, Activity, Clock, Flame, Disc } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [dna, setDna] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDNA = async () => {
            try {
                const res = await API.get('/users/analytics/dna');
                setDna(res.data);
            } catch (err) {
                console.error('Failed to fetch Mood DNA:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDNA();
    }, []);

    // SVG Radar Chart Generator
    const renderRadarChart = (moodCounts) => {
        if (!moodCounts) return null;
        const moods = Object.keys(moodCounts);
        const values = Object.values(moodCounts);
        const maxVal = Math.max(...values, 1);

        const center = 120;
        const radius = 80;
        const total = moods.length;

        const points = moods.map((mood, idx) => {
            const angle = (Math.PI * 2 * idx) / total - Math.PI / 2;
            const val = moodCounts[mood] || 0;
            const r = (val / maxVal) * radius * 0.85 + radius * 0.15;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto drop-shadow-xl">
                {/* Background Concentric Webs */}
                {[0.25, 0.5, 0.75, 1].map((scale) => {
                    const webPoints = moods.map((_, idx) => {
                        const angle = (Math.PI * 2 * idx) / total - Math.PI / 2;
                        const r = radius * scale;
                        const x = center + r * Math.cos(angle);
                        const y = center + r * Math.sin(angle);
                        return `${x},${y}`;
                    }).join(' ');
                    return (
                        <polygon
                            key={scale}
                            points={webPoints}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Axes */}
                {moods.map((_, idx) => {
                    const angle = (Math.PI * 2 * idx) / total - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <line
                            key={idx}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Radar Polygon */}
                <polygon
                    points={points}
                    fill="rgba(46, 230, 196, 0.25)"
                    stroke="#2ee6c4"
                    strokeWidth="2.5"
                />

                {/* Labels */}
                {moods.map((mood, idx) => {
                    const angle = (Math.PI * 2 * idx) / total - Math.PI / 2;
                    const labelR = radius + 18;
                    const x = center + labelR * Math.cos(angle);
                    const y = center + labelR * Math.sin(angle);
                    return (
                        <text
                            key={mood}
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#a78bfa"
                        >
                            {mood}
                        </text>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Hero */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-xl">
                        <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-white">{user?.username}</h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/30">
                                {user?.role || 'User'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                    </div>
                </div>

                {dna && (
                    <div className="glass-card rounded-2xl px-5 py-3 border border-accent/30 text-center sm:text-right">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-accent flex items-center gap-1 justify-center sm:justify-end">
                            <Sparkles className="w-3 h-3" /> Listening Personality
                        </span>
                        <p className="text-lg font-black text-white mt-0.5">{dna.badge}</p>
                    </div>
                )}
            </div>

            {/* Analytics Dashboard Grid */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Computing Mood DNA analytics...</div>
            ) : dna ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: SVG Radar Chart */}
                    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" /> Mood Radar DNA
                            </h3>
                            <span className="text-xs text-gray-400 font-medium">Dominant: <strong className="text-primary">{dna.topMood}</strong></span>
                        </div>

                        <div className="py-2">
                            {renderRadarChart(dna.moodCounts)}
                        </div>

                        <p className="text-xs text-gray-400 text-center">
                            Calculated dynamically across your 200 most recent listening sessions.
                        </p>
                    </div>

                    {/* Middle: Metrics Cards */}
                    <div className="space-y-4">
                        <div className="glass-card rounded-3xl p-5 border border-white/10 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Total Listening Time</span>
                                <h4 className="text-2xl font-black text-white">{dna.totalListeningMinutes} mins</h4>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-5 border border-white/10 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                                <Disc className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Total Songs Played</span>
                                <h4 className="text-2xl font-black text-white">{dna.totalSongsListened} plays</h4>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-5 border border-white/10 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Peak Listening Hour</span>
                                <h4 className="text-2xl font-black text-white">
                                    {dna.peakHour}:00 - {dna.peakHour + 1}:00
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Right: Top Artists Breakdown */}
                    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent" /> Top Artists
                        </h3>

                        {dna.topArtists.length === 0 ? (
                            <p className="text-xs text-gray-500 py-6 text-center">No artist analytics recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {dna.topArtists.map((item, idx) => (
                                    <div key={item.artist} className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 text-center text-xs font-black text-accent">#{idx + 1}</span>
                                            <span className="text-xs font-bold text-white">{item.artist}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">{item.count} plays</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Profile;
