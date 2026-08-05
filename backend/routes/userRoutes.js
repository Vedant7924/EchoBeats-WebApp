const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    getLikes,
    getHistory,
    getMoodDNA,
    getTimeCapsule
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.get('/profile', protect, getUserProfile);
router.get('/likes', protect, getLikes);
router.get('/history', protect, getHistory);
router.get('/analytics/dna', protect, getMoodDNA);
router.get('/timecapsule', protect, getTimeCapsule);

module.exports = router;
