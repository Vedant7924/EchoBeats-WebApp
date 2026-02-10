import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import api from '../utils/api';
import { FaPlay, FaPause, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Playlist = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { playSong, currentSong, isPlaying } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/playlists/${id}`);
                setPlaylist(data);
            } catch (error) {
                console.error("Error fetching playlist", error);
                toast.error("Failed to load playlist");
                navigate('/library');
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [id, navigate]);

    const handlePlay = (song) => {
        playSong(song);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/playlists/${playlist._id}`);
            toast.success("Playlist deleted");
            navigate('/library');
        } catch (error) {
            toast.error("Failed to delete playlist");
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;
    if (!playlist) return <div className="text-white p-8">Playlist not found</div>;

    const isOwner = user && user._id === playlist.user;

    return (
        <div className="p-8 pb-32">
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl rounded-lg flex items-center justify-center text-6xl text-white">
                    🎵
                </div>
                <div className="flex flex-col justify-end">
                    <h5 className="text-sm font-bold uppercase tracking-wider mb-2">Playlist</h5>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none">{playlist.name}</h1>
                    <p className="text-gray-300 text-sm font-medium mb-2">{playlist.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-white font-bold">{user.username}</span>
                        <span>• {playlist.songs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
                <button
                    className="bg-primary text-black rounded-full p-4 hover:scale-105 transition transform shadow-lg"
                    onClick={() => playlist.songs.length > 0 && handlePlay(playlist.songs[0])}
                >
                    {currentSong && playlist.songs.some(s => s._id === currentSong._id) && isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="pl-1" />}
                </button>

                {isOwner && (
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-white transition text-sm font-bold uppercase tracking-widest border border-gray-600 hover:border-white px-4 py-2 rounded-full"
                    >
                        Delete Playlist
                    </button>
                )}
            </div>

            <div className="flex flex-col mb-4">
                <div className="grid grid-cols-[auto,1fr,auto] gap-4 text-gray-400 border-b border-gray-800 pb-2 px-4 text-sm uppercase tracking-wider font-medium">
                    <span className="w-8 text-center">#</span>
                    <span>Title</span>
                    <span className="w-16 text-center">Time</span>
                </div>
                {playlist.songs.map((song, index) => (
                    <div
                        key={song._id}
                        className="grid grid-cols-[auto,1fr,auto] gap-4 items-center text-gray-400 hover:bg-white/10 p-3 rounded-md group cursor-pointer transition-colors"
                        onClick={() => handlePlay(song)}
                    >
                        <span className="w-8 text-center group-hover:text-white">
                            {currentSong?._id === song._id && isPlaying ?
                                <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="playing" className="w-3 h-3 mx-auto" />
                                : index + 1
                            }
                        </span>
                        <div className="flex items-center gap-4">
                            <img src={song.coverImage || 'https://placehold.co/40/191414/FFFFFF?text=Song'} alt={song.title} className="w-10 h-10 object-cover rounded shadow" />
                            <div className="flex flex-col">
                                <span className={`font-medium ${currentSong?._id === song._id ? 'text-primary' : 'text-white'}`}>{song.title}</span>
                                <span className="text-sm group-hover:text-white transition">{song.artist}</span>
                            </div>
                        </div>
                        <span className="w-16 text-center text-sm font-mono">
                            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playlist;
