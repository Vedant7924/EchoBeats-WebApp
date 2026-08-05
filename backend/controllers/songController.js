const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Song = require('../models/Song');
const songsData = require('../data/songs');
const { toggleUserLike, logPlaybackHistory } = require('./userController');

// Fallback seed array with ObjectIds
const fallbackSongs = songsData.map((song, idx) => ({
    ...song,
    _id: song._id || `6500000000000000000001${idx < 10 ? '0' + idx : idx}`,
    plays: 10 + idx
}));

// @desc    Fetch all songs (supports mood filter & multi-field search ?q=)
// @route   GET /api/songs
// @access  Public
const getSongs = asyncHandler(async (req, res) => {
    const { mood, q } = req.query;

    if (mongoose.connection.readyState !== 1) {
        let results = [...fallbackSongs];
        if (mood) {
            results = results.filter(s => s.mood && s.mood.toLowerCase() === mood.toLowerCase());
        }
        if (q) {
            const term = q.toLowerCase();
            results = results.filter(s =>
                s.title.toLowerCase().includes(term) ||
                s.artist.toLowerCase().includes(term) ||
                (s.album && s.album.toLowerCase().includes(term)) ||
                (s.mood && s.mood.toLowerCase().includes(term))
            );
        }
        return res.json(results);
    }

    try {
        let filter = {};
        if (mood) {
            filter.mood = { $regex: new RegExp(`^${mood.trim()}$`, 'i') };
        }
        if (q) {
            const queryRegex = new RegExp(q.trim(), 'i');
            filter.$or = [
                { title: queryRegex },
                { artist: queryRegex },
                { album: queryRegex },
                { mood: queryRegex }
            ];
        }

        const songs = await Song.find(filter).sort({ createdAt: -1 });
        res.json(songs.length > 0 ? songs : fallbackSongs);
    } catch {
        res.json(fallbackSongs);
    }
});

// @desc    Fetch single song by ID
// @route   GET /api/songs/:id
// @access  Public
const getSongById = asyncHandler(async (req, res) => {
    const foundFallback = fallbackSongs.find(s => s._id.toString() === req.params.id);
    if (foundFallback) {
        return res.json(foundFallback);
    }

    if (mongoose.connection.readyState !== 1) {
        return res.json(fallbackSongs[0]);
    }

    try {
        const song = await Song.findById(req.params.id);
        if (song) {
            res.json(song);
        } else {
            res.status(404);
            throw new Error('Song not found');
        }
    } catch {
        res.json(fallbackSongs[0]);
    }
});

// @desc    Create a song
// @route   POST /api/songs
// @access  Private/Admin
const createSong = asyncHandler(async (req, res) => {
    const { title, artist, album, duration, url, coverArt, mood } = req.body;

    if (!title || !artist || !url) {
        res.status(400);
        throw new Error('Title, artist, and audio URL are required');
    }

    if (mongoose.connection.readyState !== 1) {
        const created = {
            _id: new mongoose.Types.ObjectId().toString(),
            title,
            artist,
            album: album || 'Single',
            duration: duration || 180,
            url,
            coverArt: coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
            mood: mood || 'Chill'
        };
        fallbackSongs.unshift(created);
        return res.status(201).json(created);
    }

    const song = new Song({
        title,
        artist,
        album: album || 'Single',
        duration: duration || 180,
        url,
        coverArt: coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
        mood: mood || 'Chill'
    });

    const createdSong = await song.save();
    res.status(201).json(createdSong);
});

// @desc    Toggle like status of a song
// @route   POST /api/songs/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
    const songId = req.params.id;
    const userId = req.user._id;

    const isLiked = await toggleUserLike(userId, songId);
    res.json({ isLiked, songId });
});

// @desc    Record song playback & duration listen log
// @route   POST /api/songs/:id/play
// @access  Private
const playSong = asyncHandler(async (req, res) => {
    const songId = req.params.id;
    const userId = req.user._id;
    const listenedFor = Number(req.body && req.body.listenedFor ? req.body.listenedFor : 30);

    const historyLog = await logPlaybackHistory(userId, songId, listenedFor);
    res.json({ message: 'Playback logged successfully', history: historyLog });
});

module.exports = {
    getSongs,
    getSongById,
    createSong,
    toggleLike,
    playSong
};
