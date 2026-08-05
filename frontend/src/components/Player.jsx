import { usePlayer } from '../context/PlayerContext';
import { useLiked } from '../hooks/useLiked';
import NowPlaying from './NowPlaying';
import Equalizer from './Equalizer';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Maximize2,
    Heart,
    Volume2,
    VolumeX,
    Shuffle,
    Repeat
} from 'lucide-react';

const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Player = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        nextTrack,
        prevTrack,
        currentTime,
        duration,
        seekTo,
        volume,
        setVolume,
        isShuffle,
        setIsShuffle,
        repeatMode,
        setRepeatMode,
        isExpanded,
        setIsExpanded
    } = usePlayer();

    const { isLiked, toggleLike } = useLiked();

    if (!currentSong) return null;

    const liked = isLiked(currentSong._id);

    return (
        <>
            {/* Bottom Floating Glass Player */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 shadow-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Left Track Info */}
                    <div className="flex items-center gap-3 w-1/4 min-w-0">
                        <div
                            onClick={() => setIsExpanded(true)}
                            className="relative group cursor-pointer flex-shrink-0"
                        >
                            <img
                                src={currentSong.coverArt}
                                alt={currentSong.title}
                                className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="truncate min-w-0">
                            <h4
                                onClick={() => setIsExpanded(true)}
                                className="text-sm font-bold text-white truncate cursor-pointer hover:text-primary transition-colors"
                            >
                                {currentSong.title}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
                        </div>

                        <button
                            onClick={() => toggleLike(currentSong)}
                            className={`p-1.5 rounded-lg transition-colors ml-1 flex-shrink-0 ${
                                liked ? 'text-rose-500' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Center Controls & Progress Bar */}
                    <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setIsShuffle(!isShuffle)}
                                className={`text-xs transition-colors ${
                                    isShuffle ? 'text-primary' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Shuffle className="w-4 h-4" />
                            </button>

                            <button onClick={prevTrack} className="text-gray-300 hover:text-white transition-colors">
                                <SkipBack className="w-5 h-5" />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="p-2.5 rounded-full bg-primary text-black hover:scale-105 transition-transform shadow-md shadow-primary/20"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                            </button>

                            <button onClick={nextTrack} className="text-gray-300 hover:text-white transition-colors">
                                <SkipForward className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setRepeatMode((repeatMode + 1) % 3)}
                                className={`text-xs transition-colors relative ${
                                    repeatMode > 0 ? 'text-primary' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Repeat className="w-4 h-4" />
                                {repeatMode === 2 && (
                                    <span className="absolute -top-1 -right-1 text-[8px] bg-primary text-black rounded-full w-3 h-3 flex items-center justify-center font-bold">
                                        1
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-2 text-[11px] font-mono text-gray-400">
                            <span>{formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min={0}
                                max={duration || 100}
                                value={currentTime}
                                onChange={(e) => seekTo(Number(e.target.value))}
                                className="w-full"
                            />
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Right Tools (Volume & EQ & Expand) */}
                    <div className="flex items-center justify-end gap-3 w-1/4">
                        <Equalizer />

                        <div className="hidden md:flex items-center gap-2 w-24">
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
                            onClick={() => setIsExpanded(true)}
                            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            title="Expand Player"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Render Full-Screen Modal if Expanded */}
            {isExpanded && <NowPlaying />}
        </>
    );
};

export default Player;
