const express = require('express');
const router = express.Router();
const {
    getSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    getSongsByMood,
    playSong
} = require('../controllers/songController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSongs)
    .post(protect, admin, createSong);

router.get('/mood/:mood', getSongsByMood);

router.route('/:id')
    .get(getSongById)
    .put(protect, admin, updateSong)
    .delete(protect, admin, deleteSong);

router.post('/:id/play', protect, playSong);

module.exports = router;
