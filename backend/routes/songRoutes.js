const express = require('express');
const router = express.Router();
const {
    getSongs,
    getSongById,
    createSong,
    toggleLike,
    playSong
} = require('../controllers/songController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSongs)
    .post(protect, admin, createSong);

router.route('/:id')
    .get(getSongById);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/play', protect, playSong);

module.exports = router;
