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
        await User.deleteMany();
        await Song.deleteMany();
        await Playlist.deleteMany();
        await History.deleteMany();

        const createdUsers = [];
        for (const user of users) {
            const newUser = await User.create(user);
            createdUsers.push(newUser);
        }
        const adminUser = createdUsers[0]._id;

        const sampleSongs = songs.map((song) => {
            return { ...song, user: adminUser };
        });

        await Song.insertMany(sampleSongs);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Song.deleteMany();
        await Playlist.deleteMany();
        await History.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
