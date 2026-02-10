import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import api from '../utils/api';
import { FaPlay, FaPause, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

const Home = () => {
    const { user } = useAuth();
    const { playSong, currentSong, isPlaying } = usePlayer();
    const [songs, setSongs] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchSongs = async () => {
            try {
                const { data: songsData } = await api.get('/songs');
                setSongs(songsData);

                if (user) {
                    const { data: userData } = await api.get('/users/profile');
                    setRecentlyPlayed(userData.recentlyPlayed || []);
                }
            } catch (error) {
                console.error("Error fetching data", error);
                toast.error("Failed to load music");
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePlay = (song) => {
        playSong(song);
    };

    const openAddToPlaylist = (e, songId) => {
        e.stopPropagation();
        setSelectedSongId(songId);
        setShowAddModal(true);
    };

    if (loading) return <div className="text-white p-8 animate-pulse">Loading EchoBeats...</div>;

    const featuredSong = songs.length > 0 ? songs[Math.floor(Math.random() * songs.length)] : null;
    // const featuredSong = songs.find(s => s.title === 'Blinding Lights') || songs[0];

    return (
        <div className="text-white pb-32 bg-gradient-to-b from-neutral-900 to-black min-h-screen">

            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-indigo-900 to-neutral-900 p-8 pt-12 mb-8">
                <div className="flex flex-col md:flex-row items-end gap-6 z-10 relative">
                    <img
                        src={featuredSong?.coverImage || 'https://placehold.co/300/191414/FFFFFF?text=Music'}
                        alt="Featured"
                        className="w-52 h-52 shadow-2xl shadow-black/50 rounded-md object-cover transition-transform hover:scale-105 duration-500"
                    />
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="text-xs uppercase font-bold tracking-wider">Featured Track</span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-2 hover:text-white/90 transition-colors">
                            {featuredSong?.title || 'Welcome'}
                        </h1>
                        <p className="text-gray-300 text-lg font-medium">{featuredSong?.artist || 'EchoBeats'}</p>
                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={() => handlePlay(featuredSong)}
                                className="bg-primary text-black font-bold h-12 px-8 rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                {isPlaying && currentSong?._id === featuredSong?._id ? <FaPause /> : <FaPlay />}
                                Play
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl font-bold select-none overflow-hidden pointer-events-none">
                    ECHO
                </div>
            </div>

            <div className="px-8">
                <h2 className="text-3xl font-bold mb-6">{greeting}</h2>

                {/* Audio Disclaimer Banner */}
                <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg mb-8 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-blue-100">Audio Preview Information</h3>
                        <p className="text-sm text-blue-200/80">
                            Due to copyright restrictions, this demo includes royalty-free instrumental placeholders.
                            The lyrics and full tracks seen here are for demonstration of the UI/UX and database capabilities.
                        </p>
                    </div>
                </div>

                {/* Recently Played Section */}
                {recentlyPlayed.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {recentlyPlayed.slice(0, 5).map((song) => (
                                <div
                                    key={`recent-${song._id}`}
                                    className="bg-neutral-800/50 p-4 rounded-lg hover:bg-neutral-700 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                                    onClick={() => handlePlay(song)}
                                >
                                    <div className="relative mb-4">
                                        <img
                                            src={song.coverImage || 'https://placehold.co/300/191414/FFFFFF?text=Music'}
                                            alt={song.title}
                                            className="w-full aspect-square object-cover rounded-md shadow-lg group-hover:shadow-xl transition-shadow"
                                        />
                                        <div className={`absolute bottom-2 right-2 bg-primary rounded-full p-3 shadow-lg transform transition-all duration-300 ${currentSong?._id === song._id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                                            }`}>
                                            {currentSong?._id === song._id && isPlaying ? <FaPause className="text-black" /> : <FaPlay className="text-black pl-1" />}
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate" title={song.title}>{song.title}</h3>
                                    <p className="text-sm text-gray-400 truncate hover:underline">{song.artist}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Song Grid */}
                <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
                    <span>EchoBeats Originals</span>
                    <span className="text-xs uppercase text-gray-400 font-normal tracking-widest hover:text-white cursor-pointer transition-colors">Show All</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {songs.map((song) => (
                        <div
                            key={song._id}
                            className="bg-neutral-900/40 p-4 rounded-lg hover:bg-neutral-800 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                            onClick={() => handlePlay(song)}
                        >
                            <div className="relative mb-4 aspect-square">
                                <img
                                    src={song.coverImage || 'https://placehold.co/300/191414/FFFFFF?text=Music'}
                                    alt={song.title}
                                    className="w-full h-full object-cover rounded-md shadow-lg"
                                    loading="lazy"
                                />
                                <div className={`absolute bottom-2 right-2 bg-primary rounded-full p-3 shadow-lg transform transition-all duration-300 ${currentSong?._id === song._id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                                    }`}>
                                    {currentSong?._id === song._id && isPlaying ? <FaPause className="text-black" /> : <FaPlay className="text-black pl-1" />}
                                </div>
                            </div>
                            <h3 className="font-bold truncate text-base mb-1" title={song.title}>{song.title}</h3>
                            <div className="flex justify-between items-center text-gray-400">
                                <p className="text-sm truncate hover:text-white transition-colors">{song.artist}</p>
                                <button
                                    onClick={(e) => openAddToPlaylist(e, song._id)}
                                    className="hover:text-white hover:bg-neutral-700 p-2 rounded-full transition-colors tooltip tooltip-top"
                                    title="Add to playlist"
                                >
                                    <FaPlus className="text-xs" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showAddModal && (
                    <AddToPlaylistModal
                        songId={selectedSongId}
                        onClose={() => setShowAddModal(false)}
                    />
                )}

            </div>
        </div>
    );
};

export default Home;
