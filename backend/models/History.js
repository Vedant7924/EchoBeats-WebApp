const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    listenedFor: {
        type: Number, // Duration in seconds
        default: 0
    },
    playedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

HistorySchema.index({ user: 1, playedAt: -1 });

module.exports = mongoose.model('History', HistorySchema);
