import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const useLiked = () => {
    const { user } = useAuth();
    const [likedIds, setLikedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setLikedIds(new Set());
            return;
        }

        const fetchLikes = async () => {
            try {
                setLoading(true);
                const res = await API.get('/users/likes');
                const ids = new Set((res.data || []).map(song => song._id || song));
                setLikedIds(ids);
            } catch (error) {
                console.error('Failed to load liked songs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, [user]);

    const toggleLike = async (song) => {
        if (!user) {
            toast.info('Please log in to save liked songs');
            return;
        }

        const songId = song._id || song;
        const wasLiked = likedIds.has(songId);

        // Optimistic UI update
        setLikedIds(prev => {
            const next = new Set(prev);
            if (wasLiked) next.delete(songId);
            else next.add(songId);
            return next;
        });

        try {
            const res = await API.post(`/songs/${songId}/like`);
            if (res.data.isLiked) {
                toast.success(`Added "${song.title || 'Song'}" to Liked Songs ❤️`);
            } else {
                toast.info(`Removed from Liked Songs`);
            }
        } catch (error) {
            // Rollback state on failure
            setLikedIds(prev => {
                const next = new Set(prev);
                if (wasLiked) next.add(songId);
                else next.delete(songId);
                return next;
            });
            toast.error('Failed to update liked status');
        }
    };

    const isLiked = (songId) => likedIds.has(songId);

    return { likedIds, isLiked, toggleLike, loading };
};
