import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import api from '../utils/api';
import { FaPlay, FaPause } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Search = () => {
    const { playSong, currentSong, isPlaying } = usePlayer();
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/songs?artist=${query}`);
                setSongs(data);
            } catch (error) {
                console.error("Error fetching songs", error);
            } finally {
                setLoading(false);
            }
        };

        if (query.length > 2) {
            const timeoutId = setTimeout(() => {
                fetchSongs();
            }, 500);
            return () => clearTimeout(timeoutId);
        } else if (query.length === 0) {
            setSongs([]);
        }
    }, [query]);

    return (
        <div className="p-8 text-white pb-24">
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    className="w-full md:w-1/2 p-4 rounded-full bg-white text-black outline-none focus:ring-4 focus:ring-primary/50 text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {loading && <div className="text-gray-400">Searching...</div>}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {songs.map((song) => (
                    <div
                        key={song._id}
                        className="bg-neutral-900 p-4 rounded-lg hover:bg-neutral-800 transition-colors group cursor-pointer"
                        onClick={() => playSong(song)}
                    >
                        <div className="relative mb-4">
                            <img
                                src={song.coverImage || 'https://placehold.co/300/191414/FFFFFF?text=Music'}
                                alt={song.title}
                                className="w-full aspect-square object-cover rounded-md shadow-lg"
                            />
                            <div className={`absolute bottom-2 right-2 bg-primary rounded-full p-3 shadow-lg transform transition-all duration-300 ${currentSong?._id === song._id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                                }`}>
                                {currentSong?._id === song._id && isPlaying ? <FaPause className="text-black" /> : <FaPlay className="text-black pl-1" />}
                            </div>
                        </div>
                        <h3 className="font-bold truncate">{song.title}</h3>
                        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                ))}
            </div>

            {query.length > 2 && songs.length === 0 && !loading && (
                <div className="text-center text-gray-400 mt-10">
                    No songs found for "{query}"
                </div>
            )}
        </div>
    );
};

export default Search;
