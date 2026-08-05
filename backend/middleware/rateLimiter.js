const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication routes (login / register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300, // Limit each IP to 300 requests per minute
    message: { message: 'Too many requests sent. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
