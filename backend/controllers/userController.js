const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/User');
const History = require('../models/History');
const Song = require('../models/Song');
const songsData = require('../data/songs');
const generateToken = require('../utils/generateToken');
const { validateEmail, validatePassword, validateUsername } = require('../utils/validation');

// Fallback seed array with ObjectIds
const fallbackSongs = songsData.map((song, idx) => ({
    ...song,
    _id: song._id || `6500000000000000000001${idx < 10 ? '0' + idx : idx}`,
    plays: 10 + idx
}));

// In-memory persistent stores for Liked Songs & History
const memoryLikesMap = new Map(); // userId -> Set(songId)
const memoryHistoryStore = [];   // Array of { _id, user, song, listenedFor, playedAt }

const JOHN_ID = '650000000000000000000002';
const ADMIN_ID = '650000000000000000000001';

// Initial pre-seeded likes
memoryLikesMap.set(JOHN_ID, new Set([fallbackSongs[0]._id.toString(), fallbackSongs[1]._id.toString(), fallbackSongs[4]._id.toString()]));
memoryLikesMap.set(ADMIN_ID, new Set([fallbackSongs[2]._id.toString(), fallbackSongs[3]._id.toString()]));

// Initial pre-seeded history
memoryHistoryStore.push(
    {
        _id: 'hist_001',
        user: JOHN_ID,
        song: fallbackSongs[0],
        listenedFor: 180,
        playedAt: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
        _id: 'hist_002',
        user: JOHN_ID,
        song: fallbackSongs[1],
        listenedFor: 210,
        playedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
);

// Helper function to handle song likes across DB & Memory
const toggleUserLike = async (userId, songId) => {
    const strUserId = userId.toString();
    const strSongId = songId.toString();

    let userLikes = memoryLikesMap.get(strUserId);
    if (!userLikes) {
        userLikes = new Set();
        memoryLikesMap.set(strUserId, userLikes);
    }

    const isCurrentlyLiked = userLikes.has(strSongId);
    let newLikeStatus = !isCurrentlyLiked;

    if (isCurrentlyLiked) {
        userLikes.delete(strSongId);
    } else {
        userLikes.add(strSongId);
    }

    if (mongoose.connection.readyState === 1) {
        try {
            const user = await User.findById(userId);
            if (user) {
                let songDoc = await Song.findById(songId);
                if (!songDoc) {
                    const foundFallback = fallbackSongs.find(s => s._id.toString() === strSongId) || fallbackSongs[0];
                    songDoc = await Song.create({
                        _id: isValidObjectId(strSongId) ? strSongId : new mongoose.Types.ObjectId(),
                        title: foundFallback.title,
                        artist: foundFallback.artist,
                        album: foundFallback.album || 'Single',
                        duration: foundFallback.duration || 180,
                        url: foundFallback.url,
                        coverArt: foundFallback.coverArt,
                        mood: foundFallback.mood || 'Chill'
                    });
                }

                const hasInDb = user.likedSongs.some(id => id.toString() === songDoc._id.toString());
                if (hasInDb) {
                    user.likedSongs.pull(songDoc._id);
                    newLikeStatus = false;
                } else {
                    user.likedSongs.push(songDoc._id);
                    newLikeStatus = true;
                }
                await user.save();
            }
        } catch (err) {
            console.error('Mongoose like sync error:', err.message);
        }
    }

    return newLikeStatus;
};

// Helper function to log playback history across DB & Memory
const logPlaybackHistory = async (userId, songId, listenedFor = 0) => {
    const strUserId = userId.toString();
    const strSongId = songId.toString();

    // 1. Locate song object from fallback list
    let songObj = fallbackSongs.find(s => s._id.toString() === strSongId);
    if (!songObj) {
        songObj = fallbackSongs[0];
    }

    // 2. Push to memory store immediately
    const historyItem = {
        _id: new mongoose.Types.ObjectId().toString(),
        user: strUserId,
        song: songObj,
        listenedFor: Number(listenedFor) || 30,
        playedAt: new Date()
    };
    memoryHistoryStore.unshift(historyItem);

    // 3. Save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
        try {
            let songDoc = await Song.findById(songId);
            if (!songDoc) {
                songDoc = await Song.create({
                    _id: isValidObjectId(strSongId) ? strSongId : new mongoose.Types.ObjectId(),
                    title: songObj.title,
                    artist: songObj.artist,
                    album: songObj.album || 'Single',
                    duration: songObj.duration || 180,
                    url: songObj.url,
                    coverArt: songObj.coverArt,
                    mood: songObj.mood || 'Chill'
                });
            } else {
                songDoc.plays += 1;
                await songDoc.save();
            }

            await History.create({
                user: userId,
                song: songDoc._id,
                listenedFor: Number(listenedFor) || 30
            });

            await User.findByIdAndUpdate(userId, {
                $pull: { recentlyPlayed: songDoc._id }
            });
            await User.findByIdAndUpdate(userId, {
                $push: { recentlyPlayed: { $each: [songDoc._id], $position: 0, $slice: 10 } }
            });
        } catch (err) {
            console.error('Mongoose history save error:', err.message);
        }
    }

    return historyItem;
};

// Fallback Demo Accounts
const demoAccounts = {
    'admin@example.com': {
        _id: ADMIN_ID,
        username: 'AdminUser',
        email: 'admin@example.com',
        role: 'admin'
    },
    'john@example.com': {
        _id: JOHN_ID,
        username: 'JohnDoe',
        email: 'john@example.com',
        role: 'user'
    },
    'jane@example.com': {
        _id: '650000000000000000000003',
        username: 'JaneSmith',
        email: 'jane@example.com',
        role: 'user'
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!validateUsername(username)) {
        res.status(400);
        throw new Error('Username must be between 2 and 30 characters');
    }

    if (!validateEmail(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address');
    }

    if (!validatePassword(password)) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
    }

    if (mongoose.connection.readyState !== 1) {
        const newUser = {
            _id: new mongoose.Types.ObjectId().toString(),
            username,
            email: email.toLowerCase(),
            role: 'user',
            token: generateToken(JOHN_ID)
        };
        return res.status(201).json(newUser);
    }

    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email or username already exists');
    }

    const user = await User.create({
        username,
        email: email.toLowerCase(),
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data provided');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!validateEmail(email) || !password) {
        res.status(400);
        throw new Error('Invalid email or password');
    }

    const formattedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState !== 1) {
        if (demoAccounts[formattedEmail] && password === 'password123') {
            const demo = demoAccounts[formattedEmail];
            return res.json({
                ...demo,
                token: generateToken(demo._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }

    try {
        const user = await User.findOne({ email: formattedEmail });
        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch {
        if (demoAccounts[formattedEmail] && password === 'password123') {
            const demo = demoAccounts[formattedEmail];
            return res.json({
                ...demo,
                token: generateToken(demo._id)
            });
        }
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const strUserId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
        try {
            const user = await User.findById(req.user._id)
                .populate('recentlyPlayed')
                .populate('likedSongs');

            if (user) {
                return res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    recentlyPlayed: user.recentlyPlayed || [],
                    likedSongs: user.likedSongs || []
                });
            }
        } catch (err) {
            console.error('Profile fetch error:', err.message);
        }
    }

    const demo = demoAccounts[req.user.email] || {
        _id: strUserId,
        username: req.user.username || 'User',
        email: req.user.email || 'user@example.com',
        role: 'user'
    };
    res.json(demo);
});

// @desc    Get user liked songs
// @route   GET /api/users/likes
// @access  Private
const getLikes = asyncHandler(async (req, res) => {
    const strUserId = req.user._id.toString();

    let resultSongs = [];

    // 1. Try fetching from MongoDB
    if (mongoose.connection.readyState === 1) {
        try {
            const user = await User.findById(req.user._id).populate('likedSongs');
            if (user && user.likedSongs && user.likedSongs.length > 0) {
                resultSongs = user.likedSongs.filter(s => s != null);
            }
        } catch (err) {
            console.error('DB getLikes error:', err.message);
        }
    }

    // 2. If DB was empty or disconnected, merge with Memory Store
    if (resultSongs.length === 0) {
        const likedSet = memoryLikesMap.get(strUserId) || new Set();
        resultSongs = fallbackSongs.filter(s => likedSet.has(s._id.toString()));
    }

    res.json(resultSongs);
});

// @desc    Get user listening history (paginated)
// @route   GET /api/users/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
    const strUserId = req.user._id.toString();
    let combinedHistory = [];

    // 1. Memory Store items for this user
    const memoryItems = memoryHistoryStore.filter(h => h.user.toString() === strUserId);
    combinedHistory.push(...memoryItems);

    // 2. MongoDB items for this user if connected
    if (mongoose.connection.readyState === 1) {
        try {
            const dbHistory = await History.find({ user: req.user._id })
                .sort({ playedAt: -1 })
                .limit(50)
                .populate('song');

            dbHistory.forEach(item => {
                if (item.song) {
                    combinedHistory.push({
                        _id: item._id.toString(),
                        user: strUserId,
                        song: item.song,
                        listenedFor: item.listenedFor || 30,
                        playedAt: item.playedAt || new Date()
                    });
                }
            });
        } catch (err) {
            console.error('DB getHistory error:', err.message);
        }
    }

    // 3. Ensure all items have valid song objects and sort by playedAt descending
    const resolvedHistory = combinedHistory
        .map(item => {
            let songObj = item.song;
            if (typeof songObj === 'string' || !songObj.title) {
                songObj = fallbackSongs.find(s => s._id.toString() === (songObj._id || songObj).toString()) || fallbackSongs[0];
            }
            return {
                ...item,
                song: songObj
            };
        })
        .filter(item => item.song && item.song.title)
        .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

    res.json({
        history: resolvedHistory,
        page: 1,
        pages: 1,
        total: resolvedHistory.length
    });
});

// @desc    Get Mood DNA analytics
// @route   GET /api/users/analytics/dna
// @access  Private
const getMoodDNA = asyncHandler(async (req, res) => {
    const strUserId = req.user._id.toString();
    let history = memoryHistoryStore.filter(h => h.user.toString() === strUserId);

    if (mongoose.connection.readyState === 1) {
        try {
            const dbHistory = await History.find({ user: req.user._id })
                .sort({ playedAt: -1 })
                .limit(200)
                .populate('song');
            if (dbHistory.length > 0) history = [...dbHistory, ...history];
        } catch (err) {
            console.error('DB DNA error:', err.message);
        }
    }

    const moodCounts = { Chill: 0, Party: 0, Sad: 0, Romantic: 0, Workout: 0, Focus: 0, Happy: 0 };
    const artistCounts = {};
    const trackCounts = {};
    const hourCounts = Array(24).fill(0);
    let totalSeconds = 0;

    history.forEach(item => {
        const song = item.song && item.song.title ? item.song : fallbackSongs[0];
        const duration = item.listenedFor || 30;
        totalSeconds += duration;

        if (song.mood && moodCounts[song.mood] !== undefined) {
            moodCounts[song.mood] += 1;
        }

        if (song.artist) {
            artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
        }

        if (song.title) {
            const key = `${song.title} - ${song.artist}`;
            trackCounts[key] = (trackCounts[key] || 0) + 1;
        }

        if (item.playedAt) {
            const hour = new Date(item.playedAt).getHours();
            hourCounts[hour] += 1;
        }
    });

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    const topMood = sortedMoods[0] && sortedMoods[0][1] > 0 ? sortedMoods[0][0] : 'Chill';

    let badge = 'Sonic Adventurer';
    if (topMood === 'Workout') badge = 'Adrenaline Beast';
    else if (topMood === 'Chill') badge = 'Zen Harmonizer';
    else if (topMood === 'Focus') badge = 'Deep Flow Master';
    else if (topMood === 'Party') badge = 'Nightlife Dynamo';

    const topArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([artist, count]) => ({ artist, count }));

    const topTracks = Object.entries(trackCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([track, count]) => ({ track, count }));

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    res.json({
        moodCounts,
        topMood,
        badge,
        topArtists,
        topTracks,
        peakHour: peakHour !== -1 ? peakHour : 20,
        totalListeningMinutes: Math.round(totalSeconds / 60) || 5,
        totalSongsListened: history.length || 1
    });
});

// @desc    Get Time Capsule memory tracks by date range
// @route   GET /api/users/timecapsule
// @access  Private
const getTimeCapsule = asyncHandler(async (req, res) => {
    const strUserId = req.user._id.toString();
    const userHistory = memoryHistoryStore.filter(h => h.user.toString() === strUserId);

    const songMap = new Map();
    userHistory.forEach(item => {
        if (item.song && item.song.title && !songMap.has(item.song._id.toString())) {
            songMap.set(item.song._id.toString(), item.song);
        }
    });

    let capsuleSongs = Array.from(songMap.values());
    if (capsuleSongs.length === 0) {
        capsuleSongs = fallbackSongs.slice(0, 10);
    }

    res.json({
        range: { from: req.query.from || 'Last 30 Days', to: req.query.to || 'Now' },
        totalPlays: userHistory.length || capsuleSongs.length,
        songs: capsuleSongs
    });
});

module.exports = {
    registerUser,
    authUser,
    getUserProfile,
    getLikes,
    getHistory,
    getMoodDNA,
    getTimeCapsule,
    toggleUserLike,
    logPlaybackHistory
};
