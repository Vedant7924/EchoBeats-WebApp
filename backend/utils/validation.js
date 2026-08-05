const mongoose = require('mongoose');

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 6;
};

const validateUsername = (username) => {
    if (!username || typeof username !== 'string') return false;
    return username.trim().length >= 2 && username.trim().length <= 30;
};

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    isValidObjectId
};
