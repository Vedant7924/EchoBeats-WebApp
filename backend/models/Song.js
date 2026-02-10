const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    mood: {
        type: String, // 'chill', 'workout', 'focus', 'party', etc. (for mood-based generator)
        enum: ['chill', 'workout', 'focus', 'party', 'sad', 'happy', 'romantic', 'energetic'],
        default: 'chill'
    },
    url: {
        type: String, // URL to the audio file (e.g., Cloudinary or local)
        required: true
    },
    coverImage: {
        type: String // URL to cover image
    },
    plays: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
