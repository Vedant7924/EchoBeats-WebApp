import { createContext, useContext, useState, useRef, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const { user } = useAuth();
    const audioRef = useRef(new Audio());

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    
    // Controls & Settings (Persisted)
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('echobeats-volume');
        return saved !== null ? Number(saved) : 0.8;
    });

    const [isShuffle, setIsShuffle] = useState(() => {
        return localStorage.getItem('echobeats-shuffle') === 'true';
    });

    // 0 = Off, 1 = Repeat Queue, 2 = Repeat One
    const [repeatMode, setRepeatMode] = useState(() => {
        const saved = localStorage.getItem('echobeats-repeat');
        return saved !== null ? Number(saved) : 0;
    });

    // Audio Metadata
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    // Listen Duration Tracker
    const totalListenedRef = useRef(0);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('echobeats-volume', volume);
    }, [volume]);

    useEffect(() => {
        localStorage.setItem('echobeats-shuffle', isShuffle);
    }, [isShuffle]);

    useEffect(() => {
        localStorage.setItem('echobeats-repeat', repeatMode);
    }, [repeatMode]);

    // Volume sync
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Log playback duration to backend when track changes or unmounts
    const reportPlaybackDuration = async (songToReport) => {
        if (!songToReport || !songToReport._id || totalListenedRef.current < 3 || !user) {
            totalListenedRef.current = 0;
            return;
        }

        const listenedFor = Math.round(totalListenedRef.current);
        totalListenedRef.current = 0;

        try {
            await API.post(`/songs/${songToReport._id}/play`, { listenedFor });
        } catch (err) {
            console.error('Failed to log playback history:', err);
        }
    };

    // Audio element listeners
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            if (!audio.paused) {
                totalListenedRef.current += 0.25;
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            if (currentSong) {
                reportPlaybackDuration(currentSong);
            }

            if (repeatMode === 2) {
                audio.currentTime = 0;
                audio.play().then(() => setIsPlaying(true)).catch(console.error);
            } else {
                nextTrack();
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSong, repeatMode, queue, currentIndex, isShuffle]);

    // Keyboard Shortcuts (Space to play/pause, Left/Right for Seek)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.code === 'ArrowRight' && e.shiftKey) {
                e.preventDefault();
                nextTrack();
            } else if (e.code === 'ArrowLeft' && e.shiftKey) {
                e.preventDefault();
                prevTrack();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, currentSong, queue, currentIndex]);

    // Play a song with optional newQueue or explicitIndex
    const playSong = async (song, newQueue = null, explicitIndex = null) => {
        if (!song || !song.url) return;

        if (currentSong) {
            await reportPlaybackDuration(currentSong);
        }

        const audio = audioRef.current;
        setCurrentSong(song);
        totalListenedRef.current = 0;

        // Log playback event immediately to backend
        if (user && song._id) {
            API.post(`/songs/${song._id}/play`, { listenedFor: 30 }).catch(console.error);
        }

        if (newQueue && newQueue.length > 0) {
            setQueue(newQueue);
            const foundIdx = explicitIndex !== null ? explicitIndex : newQueue.findIndex(s => s._id === song._id);
            setCurrentIndex(foundIdx !== -1 ? foundIdx : 0);
        } else if (explicitIndex !== null) {
            setCurrentIndex(explicitIndex);
        } else {
            setQueue(prev => {
                if (prev.length === 0) {
                    setCurrentIndex(0);
                    return [song];
                }
                const existingIdx = prev.findIndex(s => s._id === song._id);
                if (existingIdx !== -1) {
                    setCurrentIndex(existingIdx);
                    return prev;
                }
                setCurrentIndex(prev.length);
                return [...prev, song];
            });
        }

        try {
            audio.src = song.url;
            await audio.play();
            setIsPlaying(true);
        } catch (err) {
            console.error('Audio Play Error:', err);
            setIsPlaying(false);
        }
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!currentSong) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(console.error);
        }
    };

    const nextTrack = () => {
        if (queue.length === 0) return;

        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * queue.length);
            playSong(queue[randomIndex], null, randomIndex);
            return;
        }

        let nextIdx = currentIndex + 1;
        if (nextIdx >= queue.length) {
            if (repeatMode === 1 || queue.length > 1) {
                nextIdx = 0; // Wrap around smoothly across queue
            } else {
                setIsPlaying(false);
                return;
            }
        }

        playSong(queue[nextIdx], null, nextIdx);
    };

    const prevTrack = () => {
        if (queue.length === 0) return;

        if (audioRef.current.currentTime > 5) {
            audioRef.current.currentTime = 0;
            return;
        }

        let prevIdx = currentIndex - 1;
        if (prevIdx < 0) {
            prevIdx = queue.length - 1;
        }

        playSong(queue[prevIdx], null, prevIdx);
    };

    const playQueue = (songsList, startIndex = 0) => {
        if (!songsList || songsList.length === 0) return;
        setQueue(songsList);
        setCurrentIndex(startIndex);
        playSong(songsList[startIndex], songsList, startIndex);
    };

    const removeFromQueue = (indexToRemove) => {
        setQueue(prev => {
            const updated = prev.filter((_, idx) => idx !== indexToRemove);
            if (indexToRemove < currentIndex) {
                setCurrentIndex(c => c - 1);
            }
            return updated;
        });
    };

    const clearQueue = () => {
        setQueue([]);
        setCurrentIndex(-1);
    };

    const seekTo = (seconds) => {
        if (audioRef.current) {
            audioRef.current.currentTime = seconds;
            setCurrentTime(seconds);
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                queue,
                currentIndex,
                volume,
                isShuffle,
                repeatMode,
                currentTime,
                duration,
                isExpanded,
                audioRef,
                playSong,
                togglePlay,
                nextTrack,
                prevTrack,
                playQueue,
                removeFromQueue,
                clearQueue,
                seekTo,
                setVolume,
                setIsShuffle,
                setRepeatMode,
                setIsExpanded
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
