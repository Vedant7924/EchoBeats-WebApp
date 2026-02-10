import React, { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { MdSkipPrevious, MdSkipNext } from 'react-icons/md';

const Player = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        currentTime,
        duration,
        seek,
        changeVolume,
        volume
    } = usePlayer();

    const formatTime = (time) => {
        if (!time) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 h-24 border-t border-gray-800 flex items-center justify-between z-50 player-bar">
            {/* Song Info */}
            <div className="flex items-center w-1/4">
                <img
                    src={currentSong.coverImage || 'https://placehold.co/60/191414/FFFFFF?text=Song'}
                    alt="Cover"
                    className="w-14 h-14 rounded mr-4 object-cover"
                />
                <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold truncate hover:underline cursor-pointer">{currentSong.title}</h4>
                    <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">{currentSong.artist}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center w-2/4">
                <div className="flex items-center gap-6 mb-2">
                    <button className="text-gray-400 hover:text-white transition" title="Previous" onClick={playPrevious}>
                        <MdSkipPrevious size={24} />
                    </button>
                    <button
                        className="bg-white text-black rounded-full p-2 hover:scale-105 transition transform"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="pl-0.5" />}
                    </button>
                    <button className="text-gray-400 hover:text-white transition" title="Next" onClick={playNext}>
                        <MdSkipNext size={24} />
                    </button>
                </div>
                <div className="w-full flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => seek(e.target.value)}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                        style={{ backgroundSize: `${(currentTime / duration) * 100}% 100%` }}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-end w-1/4 gap-2">
                <button onClick={() => changeVolume(volume === 0 ? 0.5 : 0)}>
                    {volume === 0 ? <FaVolumeMute size={20} className="text-gray-400" /> : <FaVolumeUp size={20} className="text-gray-400 hover:text-white" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => changeVolume(e.target.value)}
                    className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundSize: `${volume * 100}% 100%` }}
                />
            </div>
        </div>
    );
};

export default Player;
