const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const songsData = require('../data/songs');
const { isValidObjectId } = require('../utils/validation');

// In-memory fallback playlists store
const inMemoryPlaylists = new Map();

// Helper to sanitize playlist output
const formatPlaylist = (p) => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description || '',
    songs: p.songs || [],
    user: p.user ? p.user.toString() : '',
    isPublic: !!p.isPublic,
    createdAt: p.createdAt || new Date().toISOString()
});

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
    try {
        const { name, description, songs, isPublic } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Playlist name is required and cannot be empty',
                code: 'INVALID_INPUT'
            });
        }

        const trimmedName = name.trim();
        const trimmedDesc = description ? String(description).trim() : '';

        if (mongoose.connection.readyState !== 1) {
            const newId = new mongoose.Types.ObjectId().toString();
            const newPlaylist = {
                _id: newId,
                name: trimmedName,
                description: trimmedDesc,
                songs: Array.isArray(songs) ? songs : [],
                user: req.user._id.toString(),
                isPublic: !!isPublic,
                createdAt: new Date().toISOString()
            };
            inMemoryPlaylists.set(newId, newPlaylist);
            return res.status(201).json(newPlaylist);
        }

        const playlist = new Playlist({
            name: trimmedName,
            description: trimmedDesc,
            songs: Array.isArray(songs) ? songs : [],
            user: req.user._id,
            isPublic: !!isPublic
        });

        const createdPlaylist = await playlist.save();
        res.status(201).json(formatPlaylist(createdPlaylist));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, code: 'SERVER_ERROR' });
    }
};

// @desc    Get user playlists (User Isolation Enforced)
// @route   GET /api/playlists
// @access  Private
const getMyPlaylists = async (req, res) => {
    try {
        const userIdStr = req.user._id.toString();

        if (mongoose.connection.readyState !== 1) {
            const userPlaylists = Array.from(inMemoryPlaylists.values()).filter(p => p.user === userIdStr);
            return res.json(userPlaylists);
        }

        const playlists = await Playlist.find({ user: req.user._id });
        res.json(playlists.map(formatPlaylist));
    } catch (error) {
        const userIdStr = req.user._id.toString();
        const userPlaylists = Array.from(inMemoryPlaylists.values()).filter(p => p.user === userIdStr);
        res.json(userPlaylists);
    }
};

// @desc    Get playlist by ID (Private Ownership or Public View Enforced)
// @route   GET /api/playlists/:id
// @access  Private
const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;
        const userIdStr = req.user._id.toString();

        if (mongoose.connection.readyState !== 1) {
            const memoryPlaylist = inMemoryPlaylists.get(id);
            if (!memoryPlaylist) {
                return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
            }
            if (!memoryPlaylist.isPublic && memoryPlaylist.user !== userIdStr) {
                return res.status(403).json({ success: false, message: 'Forbidden: Access denied to private playlist', code: 'FORBIDDEN' });
            }
            const sampleSongs = songsData.slice(0, 5).map((s, idx) => ({ ...s, _id: `6500000000000000000001${idx < 10 ? '0' + idx : idx}` }));
            return res.json({ ...memoryPlaylist, songs: sampleSongs });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid playlist ID format', code: 'INVALID_ID' });
        }

        const playlist = await Playlist.findById(id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
        }

        if (!playlist.isPublic && playlist.user.toString() !== userIdStr) {
            return res.status(403).json({ success: false, message: 'Forbidden: Access denied to private playlist', code: 'FORBIDDEN' });
        }

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, code: 'SERVER_ERROR' });
    }
};

// @desc    Update playlist (Strict Ownership Enforced)
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, songs, isPublic } = req.body;
        const userIdStr = req.user._id.toString();

        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(id);
            if (!memory) {
                return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
            }
            if (memory.user !== userIdStr) {
                return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
            }

            if (name !== undefined) memory.name = String(name).trim();
            if (description !== undefined) memory.description = String(description).trim();
            if (songs !== undefined && Array.isArray(songs)) memory.songs = songs;
            if (isPublic !== undefined) memory.isPublic = !!isPublic;

            inMemoryPlaylists.set(id, memory);
            return res.json(memory);
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid playlist ID format', code: 'INVALID_ID' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
        }

        if (playlist.user.toString() !== userIdStr) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
        }

        if (name !== undefined) playlist.name = String(name).trim();
        if (description !== undefined) playlist.description = String(description).trim();
        if (songs !== undefined && Array.isArray(songs)) playlist.songs = songs;
        if (isPublic !== undefined) playlist.isPublic = !!isPublic;

        const updatedPlaylist = await playlist.save();
        res.json(formatPlaylist(updatedPlaylist));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, code: 'SERVER_ERROR' });
    }
};

// @desc    Add song to playlist (Strict Ownership Enforced)
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { songId } = req.body;
        const userIdStr = req.user._id.toString();

        if (!songId) {
            return res.status(400).json({ success: false, message: 'Song ID is required', code: 'INVALID_INPUT' });
        }

        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(id);
            if (!memory) {
                return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
            }
            if (memory.user !== userIdStr) {
                return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
            }
            if (!memory.songs.includes(songId)) memory.songs.push(songId);
            inMemoryPlaylists.set(id, memory);
            return res.json(memory);
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid playlist ID format', code: 'INVALID_ID' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
        }

        if (playlist.user.toString() !== userIdStr) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
        }

        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            await playlist.save();
        }
        res.json(formatPlaylist(playlist));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, code: 'SERVER_ERROR' });
    }
};

// @desc    Remove song from playlist (Strict Ownership Enforced)
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
const removeSong = async (req, res) => {
    try {
        const { id, songId } = req.params;
        const userIdStr = req.user._id.toString();

        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(id);
            if (!memory) {
                return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
            }
            if (memory.user !== userIdStr) {
                return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
            }
            memory.songs = memory.songs.filter(s => (s._id || s).toString() !== songId);
            inMemoryPlaylists.set(id, memory);
            return res.json(memory);
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid playlist ID format', code: 'INVALID_ID' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
        }

        if (playlist.user.toString() !== userIdStr) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
        }

        playlist.songs = playlist.songs.filter(s => s.toString() !== songId);
        await playlist.save();
        res.json(formatPlaylist(playlist));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, code: 'SERVER_ERROR' });
    }
};

// @desc    Delete playlist (Strict Ownership Enforced)
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const userIdStr = req.user._id.toString();

        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(id);
            if (!memory) {
                return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
            }
            if (memory.user !== userIdStr) {
                return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
            }
            inMemoryPlaylists.delete(id);
            return res.json({ success: true, message: 'Playlist removed' });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid playlist ID format', code: 'INVALID_ID' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found', code: 'NOT_FOUND' });
        }

        if (playlist.user.toString() !== userIdStr) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this playlist', code: 'FORBIDDEN' });
        }

        await playlist.deleteOne();
        res.json({ success: true, message: 'Playlist removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, code: 'SERVER_ERROR' });
    }
};

module.exports = {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSong,
    deletePlaylist,
    updatePlaylist
};
