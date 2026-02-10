import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AddToPlaylistModal = ({ songId, onClose }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const { data } = await api.get('/playlists');
                setPlaylists(data);
            } catch (error) {
                toast.error("Failed to load playlists");
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

    const addToPlaylist = async (playlistId) => {
        try {
            await api.post(`/playlists/${playlistId}/songs`, { songId });
            toast.success("Added to playlist");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add song");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-6 rounded-lg w-80 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-white">Add to Playlist</h2>
                {loading ? <div className="text-gray-400">Loading...</div> : (
                    <ul className="space-y-2">
                        {playlists.map(playlist => (
                            <li
                                key={playlist._id}
                                className="p-3 bg-neutral-700 hover:bg-neutral-600 rounded cursor-pointer text-white flex justify-between items-center"
                                onClick={() => addToPlaylist(playlist._id)}
                            >
                                <span className="truncate">{playlist.name}</span>
                            </li>
                        ))}
                        {playlists.length === 0 && <li className="text-gray-400">No playlists found</li>}
                    </ul>
                )}
                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2 text-gray-400 hover:text-white border border-gray-600 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
