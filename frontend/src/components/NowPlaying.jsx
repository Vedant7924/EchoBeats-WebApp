import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useLiked } from '../hooks/useLiked';
import Visualizer from './Visualizer';
import Equalizer from './Equalizer';
import {
    ChevronDown,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Heart,
    ListMusic,
    Trash2,
    Volume2,
    VolumeX
} from 'lucide-react';

const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const NowPlaying = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        nextTrack,
        prevTrack,
        currentTime,
        duration,
        seekTo,
        isShuffle,
        setIsShuffle,
        repeatMode,
        setRepeatMode,
        setIsExpanded,
        queue,
        currentIndex,
        playSong,
        removeFromQueue,
        clearQueue,
        volume,
        setVolume
    } = usePlayer();

    const { isLiked, toggleLike } = useLiked();
    const [showQueue, setShowQueue] = useState(false);

    if (!currentSong) return null;

    const liked = isLiked(currentSong._id);

    return (
        <div className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300 overflow-y-auto">
            {/* Ambient Dynamic Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Bar Navigation */}
            <div className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto">
                <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <span className="text-xs uppercase tracking-widest text-primary font-bold">Now Playing</span>
                    <p className="text-xs text-gray-400 font-medium">EchoWave Audio Engine</p>
                </div>
                <Equalizer />
            </div>

            {/* Main Center Content Grid */}
            <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-auto py-6">
                {/* Left Column: Vinyl Spin Album Art */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative group">
                        <div
                            className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden transition-transform duration-700 ${
                                isPlaying ? 'animate-spin-slow shadow-primary/20' : 'scale-95 opacity-90'
                            }`}
                        >
                            <img
                                src={currentSong.coverArt}
                                alt={currentSong.title}
                                className="w-full h-full object-cover rounded-full"
                            />
                            {/* Vinyl Center Hole */}
                            <div className="absolute inset-0 m-auto w-16 h-16 bg-surface border-4 border-white/20 rounded-full shadow-inner flex items-center justify-center">
                                <div className="w-5 h-5 bg-primary/40 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Track Details & Queue Modal */}
                <div className="flex flex-col justify-center space-y-6">
                    {/* Song Meta */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
                                {currentSong.mood || 'Chill'} Mood
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                {currentSong.title}
                            </h1>
                            <p className="text-lg text-gray-400 font-medium mt-1">{currentSong.artist}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{currentSong.album || 'Single'}</p>
                        </div>
                        <button
                            onClick={() => toggleLike(currentSong)}
                            className={`p-3 rounded-2xl border transition-all ${
                                liked
                                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Procedural Canvas Visualizer */}
                    <Visualizer isPlaying={isPlaying} mood={currentSong.mood} height={90} />

                    {/* Seek Progress Slider */}
                    <div className="space-y-2">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={(e) => seekTo(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Audio Playback Controls */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            onClick={() => setIsShuffle(!isShuffle)}
                            className={`p-2.5 rounded-xl border transition-all ${
                                isShuffle ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                            title="Toggle Shuffle"
                        >
                            <Shuffle className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={prevTrack}
                                className="p-3 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                            >
                                <SkipBack className="w-7 h-7" />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="p-5 rounded-full bg-primary text-black hover:scale-105 transition-all shadow-lg shadow-primary/30"
                            >
                                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
                            </button>

                            <button
                                onClick={nextTrack}
                                className="p-3 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                            >
                                <SkipForward className="w-7 h-7" />
                            </button>
                        </div>

                        <button
                            onClick={() => setRepeatMode((repeatMode + 1) % 3)}
                            className={`p-2.5 rounded-xl border transition-all relative ${
                                repeatMode > 0 ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                            title="Repeat Mode"
                        >
                            <Repeat className="w-5 h-5" />
                            {repeatMode === 2 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black font-bold text-[9px] rounded-full flex items-center justify-center">
                                    1
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Bottom Drawer Bar: Volume & Queue Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 w-36">
                            <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-gray-400 hover:text-white">
                                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <button
                            onClick={() => setShowQueue(!showQueue)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                showQueue ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            <ListMusic className="w-4 h-4" />
                            <span>Queue ({queue.length})</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Queue Modal Drawer */}
            {showQueue && (
                <div className="relative z-20 w-full max-w-4xl mx-auto bg-card/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Playback Queue</h3>
                        {queue.length > 0 && (
                            <button
                                onClick={clearQueue}
                                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Clear Queue
                            </button>
                        )}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {queue.map((song, idx) => (
                            <div
                                key={`${song._id}-${idx}`}
                                className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                                    idx === currentIndex
                                        ? 'bg-primary/20 border border-primary/30 text-primary font-semibold'
                                        : 'hover:bg-white/5 text-gray-300'
                                }`}
                            >
                                <div
                                    onClick={() => playSong(song)}
                                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                >
                                    <img src={song.coverArt} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                    <div className="truncate">
                                        <p className="text-xs text-white truncate">{song.title}</p>
                                        <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromQueue(idx)}
                                    className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NowPlaying;
