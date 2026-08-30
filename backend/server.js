const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// Routes
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

dotenv.config();

connectDB();

const app = express();
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.endsWith('.monkeycode-ai.live') || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());

// Global API rate limiting
app.use('/api', apiLimiter);

// Route Mounting
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    );
} else if (!process.env.VERCEL) {
    app.get('/', (req, res) => {
        res.send('EchoBeats API is running cleanly...');
    });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`EchoBeats Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
