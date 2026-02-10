const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    playedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('History', HistorySchema);
