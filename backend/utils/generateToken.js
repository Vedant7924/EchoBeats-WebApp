const jwt = require('jsonwebtoken');

const generateToken = (userOrId, extraData = {}) => {
    let payload = {};
    if (typeof userOrId === 'object' && userOrId !== null) {
        payload = {
            id: (userOrId._id || userOrId.id).toString(),
            username: userOrId.username || 'User',
            email: userOrId.email || 'user@example.com',
            role: userOrId.role || 'user'
        };
    } else {
        payload = {
            id: userOrId.toString(),
            username: extraData.username || 'User',
            email: extraData.email || 'user@example.com',
            role: extraData.role || 'user'
        };
    }

    return jwt.sign(payload, process.env.JWT_SECRET || 'this_is_a_very_secret_key_123456', {
        expiresIn: '30d'
    });
};

module.exports = generateToken;
