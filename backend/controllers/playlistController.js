const asyncHandler = require('express-async-handler');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, songs, isPublic } = req.body;

    const playlist = new Playlist({
        name,
        description,
        songs: songs || [],
        user: req.user._id,
        isPublic: isPublic || false
    });

    const createdPlaylist = await playlist.save();
    res.status(201).json(createdPlaylist);
});

// @desc    Get user playlists
// @route   GET /api/playlists/me
// @access  Private
const getMyPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ user: req.user._id });
    res.json(playlists);
});

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Private (if private) or Public (if public)
const getPlaylistById = asyncHandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.id).populate('songs');

    if (playlist) {
        // Check if public or owner
        if (playlist.isPublic || (req.user && playlist.user.toString() === req.user._id.toString())) {
            res.json(playlist);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this playlist');
        }
    } else {
        res.status(404);
        throw new Error('Playlist not found');
    }
});

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (playlist) {
        if (playlist.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        playlist.name = name || playlist.name;
        playlist.description = description || playlist.description;
        playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;

        const updatedPlaylist = await playlist.save();
        res.json(updatedPlaylist);
    } else {
        res.status(404);
        throw new Error('Playlist not found');
    }
});

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = asyncHandler(async (req, res) => {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (playlist) {
        if (playlist.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        // Check if song exists
        const songKey = await Song.findById(songId);
        if (!songKey) {
            res.status(404);
            throw new Error('Song not found');
        }

        if (playlist.songs.includes(songId)) {
            res.status(400);
            throw new Error('Song already in playlist');
        }

        playlist.songs.push(songId);
        await playlist.save();
        res.json(playlist);
    } else {
        res.status(404);
        throw new Error('Playlist not found');
    }
});

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
const removeSong = asyncHandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);

    if (playlist) {
        if (playlist.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        playlist.songs = playlist.songs.filter(
            (song) => song.toString() !== req.params.songId
        );

        await playlist.save();
        res.json(playlist);
    } else {
        res.status(404);
        throw new Error('Playlist not found');
    }
});


// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = asyncHandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);

    if (playlist) {
        if (playlist.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        await playlist.deleteOne();
        res.json({ message: 'Playlist removed' });
    } else {
        res.status(404);
        throw new Error('Playlist not found');
    }
});


module.exports = {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSong,
    deletePlaylist,
    updatePlaylist
};
