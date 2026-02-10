const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    coverImage: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', PlaylistSchema);
