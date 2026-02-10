const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const verify = async () => {
    try {
        const email = 'admin@example.com';
        const password = 'password123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Stored hashed password:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        // Also check with User method
        const isMatchMethod = await user.matchPassword(password);
        console.log('Method match:', isMatchMethod);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
