const mongoose = require('mongoose');

// Disable Mongoose buffering so queries don't hang for 10,000ms if DB is connecting
mongoose.set('bufferCommands', false);

const autoSeed = async () => {
    try {
        const User = require('../models/User');
        const Song = require('../models/Song');
        const songsData = require('../data/songs');

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('🌱 Seeding initial test users & 62 songs...');
            const createdUsers = await User.create([
                { username: 'AdminUser', email: 'admin@example.com', password: 'password123', role: 'admin' },
                { username: 'JohnDoe', email: 'john@example.com', password: 'password123', role: 'user' },
                { username: 'JaneSmith', email: 'jane@example.com', password: 'password123', role: 'user' }
            ]);

            const sampleSongs = songsData.map(song => ({ ...song, user: createdUsers[0]._id }));
            await Song.insertMany(sampleSongs);
            console.log('✅ Auto-Seeding Complete! Test accounts ready: admin@example.com / john@example.com / jane@example.com (password: password123)');
        }
    } catch (seedErr) {
        console.error('Auto-seed error:', seedErr.message);
    }
};

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test' && !process.env.MONGO_URI) {
        return;
    }

    // 1. Try Primary MONGO_URI
    try {
        console.log('Connecting to MongoDB Atlas (SRV)...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 4000
        });
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        await autoSeed();
        return;
    } catch (error) {
        console.warn(`⚠️ SRV Lookup Failed (${error.message}). Trying Direct Atlas Nodes...`);
    }

    // 2. Try Direct Standard Atlas Connection (Bypasses SRV DNS restriction)
    const directAtlasUri = 'mongodb://shindevedant752:VED%407924@echobeats-shard-00-00.bm5obsy.mongodb.net:27017,echobeats-shard-00-01.bm5obsy.mongodb.net:27017,echobeats-shard-00-02.bm5obsy.mongodb.net:27017/echobeats?ssl=true&replicaSet=atlas-bm5obsy-shard-0&authSource=admin&retryWrites=true&w=majority';
    try {
        const conn = await mongoose.connect(directAtlasUri, {
            serverSelectionTimeoutMS: 4000
        });
        console.log(`✅ Direct MongoDB Atlas Connected: ${conn.connection.host}`);
        await autoSeed();
        return;
    } catch (error) {
        console.warn(`⚠️ Direct Atlas Connection Failed (${error.message}). Trying Local MongoDB...`);
    }

    // 3. Try Local MongoDB (if running on localhost:27017)
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/echobeats', {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
        await autoSeed();
        return;
    } catch (error) {
        console.warn(`⚠️ Local MongoDB Not Found (${error.message}). Launching MongoMemoryServer...`);
    }

    // 4. Fallback to MongoMemoryServer (Fast Pinned Binary)
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
            binary: { version: '7.0.3' }
        });
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`✅ MongoMemoryServer Connected at ${uri}`);
        await autoSeed();
    } catch (fallbackError) {
        console.error('MongoMemoryServer fallback failed:', fallbackError.message);
    }
};

module.exports = connectDB;
