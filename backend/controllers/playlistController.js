const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user playlists
// @route   GET /api/playlists/me
// @access  Private
const getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user._id });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Private (if private) or Public (if public)
const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');

        if (playlist) {
            if (playlist.isPublic || (req.user && playlist.user.toString() === req.user._id.toString())) {
                res.json(playlist);
            } else {
                res.status(403).json({ message: 'Not authorized to view this playlist' });
            }
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
        const { name, description, isPublic } = req.body;
        const playlist = await Playlist.findById(req.params.id);

        if (playlist) {
            if (playlist.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            playlist.name = name || playlist.name;
            playlist.description = description || playlist.description;
            playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;

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
        const playlist = await Playlist.findById(req.params.id);

        if (playlist) {
            if (playlist.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            const songKey = await Song.findById(songId);
            if (!songKey) {
                return res.status(404).json({ message: 'Song not found' });
            }

            if (playlist.songs.includes(songId)) {
                return res.status(400).json({ message: 'Song already in playlist' });
            }

            playlist.songs.push(songId);
            await playlist.save();
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
        const playlist = await Playlist.findById(req.params.id);

        if (playlist) {
            if (playlist.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

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
        const playlist = await Playlist.findById(req.params.id);

        if (playlist) {
            if (playlist.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }
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
