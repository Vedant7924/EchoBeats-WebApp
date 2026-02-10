const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const History = require('../models/History');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('recentlyPlayed');

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            recentlyPlayed: user.recentlyPlayed
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user analytics
// @route   GET /api/users/analytics
// @access  Private
const getUserAnalytics = asyncHandler(async (req, res) => {
    // Total songs played
    const totalSongsPlayed = await History.countDocuments({ user: req.user._id });

    // Total listening time aggregation
    const durationStats = await History.aggregate([
        { $match: { user: req.user._id } },
        {
            $lookup: {
                from: 'songs',
                localField: 'song',
                foreignField: '_id',
                as: 'songDetails'
            }
        },
        { $unwind: '$songDetails' },
        {
            $group: {
                _id: null,
                totalDuration: { $sum: '$songDetails.duration' }
            }
        }
    ]);

    // Most played song aggregation
    const mostPlayedStats = await History.aggregate([
        { $match: { user: req.user._id } },
        {
            $group: {
                _id: '$song',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: 'songs',
                localField: '_id',
                foreignField: '_id',
                as: 'songDetails'
            }
        },
        { $unwind: '$songDetails' }
    ]);

    res.json({
        totalSongsPlayed,
        totalDuration: durationStats[0]?.totalDuration || 0,
        mostPlayedSong: mostPlayedStats[0]?.songDetails || null,
        mostPlayedCount: mostPlayedStats[0]?.count || 0
    });
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getUserAnalytics,
};
