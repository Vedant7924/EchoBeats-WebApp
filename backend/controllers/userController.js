const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const History = require('../models/History');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with that email or username' });
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
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists with that email or username' });
        }
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
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
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Login failed' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('recentlyPlayed');

        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                recentlyPlayed: user.recentlyPlayed
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user analytics
// @route   GET /api/users/analytics
// @access  Private
const getUserAnalytics = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getUserAnalytics,
};
