const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const songs = require('./data/songs');
const User = require('./models/User');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');
const History = require('./models/History');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await History.deleteMany();
        await Playlist.deleteMany();
        await Song.deleteMany();
        await User.deleteMany();

        // Seed Users
        const createdUsers = await User.create([
            {
                username: 'AdminUser',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            },
            {
                username: 'JohnDoe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                username: 'JaneSmith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user'
            }
        ]);

        const adminUser = createdUsers[0]._id;

        // Seed Songs
        const sampleSongs = songs.map(song => {
            return { ...song, user: adminUser };
        });

        const createdSongs = await Song.insertMany(sampleSongs);

        console.log(`Data Seeded Successfully!`);
        console.log(`- ${createdUsers.length} Users Created (admin@example.com / john@example.com / jane@example.com)`);
        console.log(`- ${createdSongs.length} Songs Created`);
        process.exit();
    } catch (error) {
        console.error(`Error Seeding Data: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await History.deleteMany();
        await Playlist.deleteMany();
        await Song.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error Destroying Data: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
