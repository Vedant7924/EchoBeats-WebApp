import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import api from '../utils/api';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            playNext();
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);


        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    useEffect(() => {
        if (currentSong) {
            audioRef.current.src = currentSong.url;
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play();
            }

            // Track play in backend
            api.post('/songs/' + currentSong._id + '/play');
        }
    }, [currentSong]);

    const playSong = (song) => {
        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            audioRef.current.play();
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        // Simple queue logic for now (cyclic or random can be added)
        // If queue is empty, do nothing or replay
        // Implementation left simple for now
    };

    const playPrevious = () => {
        // Restart song if > 3s, else go to previous
        if (audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
        } else {
            // Go to previous logic
        }
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const changeVolume = (val) => {
        setVolume(val);
        audioRef.current.volume = val;
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            queue,
            volume,
            currentTime,
            duration,
            playSong,
            togglePlay,
            playNext,
            playPrevious,
            seek,
            changeVolume
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
