const asyncHandler = require('express-async-handler');
const Song = require('../models/Song');
const User = require('../models/User');
const History = require('../models/History');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
const getSongs = asyncHandler(async (req, res) => {
    const { mood, genre, artist } = req.query;
    let query = {};

    if (mood) {
        query.mood = mood;
    }
    if (genre) {
        query.genre = genre;
    }
    if (artist) {
        query.artist = { $regex: artist, $options: 'i' };
    }

    const songs = await Song.find(query);
    res.json(songs);
});

// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
const getSongById = asyncHandler(async (req, res) => {
    const song = await Song.findById(req.params.id);

    if (song) {
        res.json(song);
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});

// @desc    Create a song
// @route   POST /api/songs
// @access  Private/Admin
const createSong = asyncHandler(async (req, res) => {
    const { title, artist, album, duration, mood, url, coverImage } = req.body;

    const song = new Song({
        title,
        artist,
        album,
        duration,
        mood,
        url,
        coverImage
    });

    const createdSong = await song.save();
    res.status(201).json(createdSong);
});

// @desc    Update a song
// @route   PUT /api/songs/:id
// @access  Private/Admin
const updateSong = asyncHandler(async (req, res) => {
    const { title, artist, album, duration, mood, url, coverImage } = req.body;

    const song = await Song.findById(req.params.id);

    if (song) {
        song.title = title || song.title;
        song.artist = artist || song.artist;
        song.album = album || song.album;
        song.duration = duration || song.duration;
        song.mood = mood || song.mood;
        song.url = url || song.url;
        song.coverImage = coverImage || song.coverImage;

        const updatedSong = await song.save();
        res.json(updatedSong);
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});

// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Private/Admin
const deleteSong = asyncHandler(async (req, res) => {
    const song = await Song.findById(req.params.id);

    if (song) {
        await song.deleteOne();
        res.json({ message: 'Song removed' });
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});

// @desc    Get songs by mood (for generator)
// @route   GET /api/songs/mood/:mood
// @access  Public
const getSongsByMood = asyncHandler(async (req, res) => {
    const mood = req.params.mood;
    const songs = await Song.find({ mood }); // Simple filter for now
    res.json(songs);
});

// @desc    Play a song (increment plays, add to history)
// @route   POST /api/songs/:id/play
// @access  Private
const playSong = asyncHandler(async (req, res) => {
    const song = await Song.findById(req.params.id);

    if (song) {
        // Increment global plays
        song.plays = song.plays + 1;
        await song.save();

        // Add to user history (last 10 played)
        // Using $push with $each, $position, and $slice to keep only last 10
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                recentlyPlayed: {
                    $each: [song._id],
                    $position: 0,
                    $slice: 10
                }
            }
        });

        // Add to global History collection for analytics
        await History.create({
            user: req.user._id,
            song: song._id
        });

        res.json({ message: 'Song played' });
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});

module.exports = {
    getSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    getSongsByMood,
    playSong
};
