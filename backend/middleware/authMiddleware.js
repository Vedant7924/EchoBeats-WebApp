const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Fallback user resolution store
const demoUsersMap = {
    '650000000000000000000001': { _id: '650000000000000000000001', username: 'AdminUser', email: 'admin@example.com', role: 'admin' },
    '650000000000000000000002': { _id: '650000000000000000000002', username: 'JohnDoe', email: 'john@example.com', role: 'user' },
    '650000000000000000000003': { _id: '650000000000000000000003', username: 'JaneSmith', email: 'jane@example.com', role: 'user' }
};

// Dynamic registration registry to support any new user token resolution
const dynamicUserMap = new Map();

const registerUserInAuthMap = (user) => {
    if (user && user._id) {
        const strId = user._id.toString();
        dynamicUserMap.set(strId, {
            _id: strId,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
        });
    }
};

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'this_is_a_very_secret_key_123456';
            const decoded = jwt.verify(token, secret);

            if (mongoose.connection.readyState === 1) {
                try {
                    req.user = await User.findById(decoded.id).select('-password');
                } catch {
                    req.user = null;
                }
            }

            if (!req.user) {
                req.user = dynamicUserMap.get(decoded.id) || demoUsersMap[decoded.id] || {
                    _id: decoded.id,
                    username: 'User',
                    email: 'user@example.com',
                    role: 'user'
                };
            }

            return next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed or expired',
                code: 'UNAUTHORIZED'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
            code: 'NO_TOKEN'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Admin access required',
            code: 'FORBIDDEN'
        });
    }
};

module.exports = { protect, admin, registerUserInAuthMap };
