const express = require('express');
const router = express.Router();
const {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSong,
    deletePlaylist,
    updatePlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getMyPlaylists)
    .post(createPlaylist);

router.route('/:id')
    .get(getPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist);

router.route('/:id/songs')
    .post(addSongToPlaylist);

router.route('/:id/songs/:songId')
    .delete(removeSong);

module.exports = router;
