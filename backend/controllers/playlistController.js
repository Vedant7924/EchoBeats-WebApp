const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const songsData = require('../data/songs');

// In-memory fallback playlists store
const inMemoryPlaylists = new Map();

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
    try {
        const { name, description, songs, isPublic } = req.body;

        if (mongoose.connection.readyState !== 1) {
            const newPlaylist = {
                _id: new mongoose.Types.ObjectId().toString(),
                name,
                description: description || '',
                songs: songs || [],
                user: req.user._id,
                isPublic: isPublic || false,
                createdAt: new Date().toISOString()
            };
            inMemoryPlaylists.set(newPlaylist._id, newPlaylist);
            return res.status(201).json(newPlaylist);
        }

        const playlist = new Playlist({
            name,
            description,
            songs: songs || [],
            user: req.user._id,
            isPublic: isPublic || false
        });

        const createdPlaylist = await playlist.save();
        res.status(201).json(createdPlaylist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user playlists
// @route   GET /api/playlists
// @access  Private
const getMyPlaylists = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(Array.from(inMemoryPlaylists.values()));
        }
        const playlists = await Playlist.find({ user: req.user._id });
        res.json(playlists);
    } catch (error) {
        res.json(Array.from(inMemoryPlaylists.values()));
    }
};

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Private
const getPlaylistById = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const memoryPlaylist = inMemoryPlaylists.get(req.params.id);
            if (memoryPlaylist) {
                const sampleSongs = songsData.slice(0, 5).map((s, idx) => ({ ...s, _id: `6500000000000000000001${idx < 10 ? '0' + idx : idx}` }));
                return res.json({ ...memoryPlaylist, songs: sampleSongs });
            }
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const playlist = await Playlist.findById(req.params.id).populate('songs');

        if (playlist) {
            res.json(playlist);
        } else {
            res.status(404).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = async (req, res) => {
    try {
        const { name, description, songs, isPublic } = req.body;

        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(req.params.id);
            if (!memory) {
                memory = { _id: req.params.id, name: name || 'Playlist', user: req.user._id, songs: [] };
            }
            if (name !== undefined) memory.name = name;
            if (songs !== undefined) memory.songs = songs;
            inMemoryPlaylists.set(req.params.id, memory);
            return res.json(memory);
        }

        const playlist = await Playlist.findById(req.params.id);

        if (playlist) {
            if (name !== undefined) playlist.name = name;
            if (description !== undefined) playlist.description = description;
            if (songs !== undefined) playlist.songs = songs;
            if (isPublic !== undefined) playlist.isPublic = isPublic;

            const updatedPlaylist = await playlist.save();
            res.json(updatedPlaylist);
        } else {
            res.status(404).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(req.params.id) || { _id: req.params.id, name: 'My Playlist', songs: [] };
            if (!memory.songs.includes(songId)) memory.songs.push(songId);
            inMemoryPlaylists.set(req.params.id, memory);
            return res.json(memory);
        }

        const playlist = await Playlist.findById(req.params.id);
        if (playlist) {
            if (!playlist.songs.includes(songId)) {
                playlist.songs.push(songId);
                await playlist.save();
            }
            res.json(playlist);
        } else {
            res.status(404).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
const removeSong = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            let memory = inMemoryPlaylists.get(req.params.id);
            if (memory) {
                memory.songs = memory.songs.filter(s => (s._id || s).toString() !== req.params.songId);
                inMemoryPlaylists.set(req.params.id, memory);
            }
            return res.json(memory || { message: 'Song removed' });
        }

        const playlist = await Playlist.findById(req.params.id);
        if (playlist) {
            playlist.songs = playlist.songs.filter(
                (song) => song.toString() !== req.params.songId
            );
            await playlist.save();
            res.json(playlist);
        } else {
            res.status(404).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            inMemoryPlaylists.delete(req.params.id);
            return res.json({ message: 'Playlist removed' });
        }

        const playlist = await Playlist.findById(req.params.id);
        if (playlist) {
            await playlist.deleteOne();
            res.json({ message: 'Playlist removed' });
        } else {
            res.status(404).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
