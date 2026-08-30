const request = require('supertest');
const app = require('../server');
const { validateEmail, validatePassword, validateUsername, isValidObjectId } = require('../utils/validation');

describe('EchoBeats Comprehensive API & Security Test Suite', () => {
    let johnToken;
    let janeToken;
    let adminToken;
    let johnPlaylistId;

    describe('1. Validation Helper Functions', () => {
        test('validateEmail validates email formats correctly', () => {
            expect(validateEmail('user@example.com')).toBe(true);
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('')).toBe(false);
            expect(validateEmail(null)).toBe(false);
        });

        test('validatePassword validates length boundaries', () => {
            expect(validatePassword('123456')).toBe(true);
            expect(validatePassword('12345')).toBe(false);
            expect(validatePassword('')).toBe(false);
        });

        test('validateUsername validates length & whitespace', () => {
            expect(validateUsername('john_doe')).toBe(true);
            expect(validateUsername('a')).toBe(false);
            expect(validateUsername('   ')).toBe(false);
        });

        test('isValidObjectId validates MongoDB ObjectIds', () => {
            expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
            expect(isValidObjectId('invalid-id')).toBe(false);
        });
    });

    describe('2. Public Endpoints & Song Catalog', () => {
        test('GET / returns API status message', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('EchoBeats API is running');
        });

        test('GET /api/songs returns audio track catalog', async () => {
            const res = await request(app).get('/api/songs');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        test('GET /api/songs with mood filter returns filtered songs', async () => {
            const res = await request(app).get('/api/songs?mood=Chill');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/songs with search query returns matching tracks', async () => {
            const res = await request(app).get('/api/songs?q=waves');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('3. Authentication Flow & Persistent Credential Security', () => {
        test('POST /api/users/login works for test account (John)', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'john@example.com', password: 'password123' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.email).toBe('john@example.com');
            johnToken = res.body.token;
        });

        test('POST /api/users/login works for test account (Jane)', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'jane@example.com', password: 'password123' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            janeToken = res.body.token;
        });

        test('POST /api/users/login works for admin account', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'admin@example.com', password: 'password123' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.role).toBe('admin');
            adminToken = res.body.token;
        });

        test('POST /api/users/login rejects incorrect password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'john@example.com', password: 'wrongpassword' });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test('POST /api/users/register creates new account and returns JWT', async () => {
            const uniqueEmail = `newuser_${Date.now()}@example.com`;
            const res = await request(app)
                .post('/api/users/register')
                .send({ username: `newuser_${Date.now()}`, email: uniqueEmail, password: 'password123' });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');

            // Test immediate login with newly registered user
            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ email: uniqueEmail, password: 'password123' });
            expect(loginRes.statusCode).toBe(200);
            expect(loginRes.body.email).toBe(uniqueEmail);
        });

        test('POST /api/users/register rejects duplicate registration with 409 Conflict', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({ username: 'JohnDoeDup', email: 'john@example.com', password: 'password123' });
            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
        });
    });

    describe('4. User Profile & Password Updates', () => {
        test('GET /api/users/profile returns authenticated user profile', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${johnToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('john@example.com');
        });

        test('GET /api/users/profile rejects unauthenticated request', async () => {
            const res = await request(app).get('/api/users/profile');
            expect(res.statusCode).toBe(401);
        });

        test('PUT /api/users/profile updates user details', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${johnToken}`)
                .send({ username: 'JohnDoeUpdated' });
            expect(res.statusCode).toBe(200);
            expect(res.body.username).toBe('JohnDoeUpdated');
        });
    });

    describe('5. RBAC & Admin Endpoint Authorization', () => {
        test('POST /api/songs allows Admin to create a track', async () => {
            const res = await request(app)
                .post('/api/songs')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Test Admin Track',
                    artist: 'Admin Artist',
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                });
            expect(res.statusCode).toBe(201);
        });

        test('POST /api/songs rejects Non-Admin user with 403 Forbidden', async () => {
            const res = await request(app)
                .post('/api/songs')
                .set('Authorization', `Bearer ${johnToken}`)
                .send({
                    title: 'Forbidden Track',
                    artist: 'Hacker',
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                });
            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('6. Playlist Management & Ownership Protection (IDOR Defense)', () => {
        test('POST /api/playlists creates playlist for John', async () => {
            const res = await request(app)
                .post('/api/playlists')
                .set('Authorization', `Bearer ${johnToken}`)
                .send({ name: "John's Chill Vibes", description: 'Private list' });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe("John's Chill Vibes");
            johnPlaylistId = res.body._id;
        });

        test('GET /api/playlists returns only user-specific playlists', async () => {
            const res = await request(app)
                .get('/api/playlists')
                .set('Authorization', `Bearer ${johnToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('PUT /api/playlists/:id allows Owner (John) to update playlist', async () => {
            const res = await request(app)
                .put(`/api/playlists/${johnPlaylistId}`)
                .set('Authorization', `Bearer ${johnToken}`)
                .send({ name: "John's Updated Vibes" });
            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe("John's Updated Vibes");
        });

        test('PUT /api/playlists/:id rejects Non-Owner (Jane) with 403 Forbidden', async () => {
            const res = await request(app)
                .put(`/api/playlists/${johnPlaylistId}`)
                .set('Authorization', `Bearer ${janeToken}`)
                .send({ name: 'Hacked Playlist Name' });
            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test('DELETE /api/playlists/:id rejects Non-Owner (Jane) with 403 Forbidden', async () => {
            const res = await request(app)
                .delete(`/api/playlists/${johnPlaylistId}`)
                .set('Authorization', `Bearer ${janeToken}`);
            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test('DELETE /api/playlists/:id allows Owner (John) to delete playlist', async () => {
            const res = await request(app)
                .delete(`/api/playlists/${johnPlaylistId}`)
                .set('Authorization', `Bearer ${johnToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('7. Song Likes, Playback Duration & Analytics', () => {
        test('POST /api/songs/:id/like toggles liked status', async () => {
            const res = await request(app)
                .post('/api/songs/650000000000000000000100/like')
                .set('Authorization', `Bearer ${johnToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('isLiked');
        });

        test('POST /api/songs/:id/play logs duration within valid bounds', async () => {
            const res = await request(app)
                .post('/api/songs/650000000000000000000100/play')
                .set('Authorization', `Bearer ${johnToken}`)
                .send({ listenedFor: 45 });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test('GET /api/users/analytics/dna returns Mood DNA metrics', async () => {
            const res = await request(app)
                .get('/api/users/analytics/dna')
                .set('Authorization', `Bearer ${johnToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('topMood');
            expect(res.body).toHaveProperty('badge');
        });

        test('GET /api/users/timecapsule returns memory tracks', async () => {
            const res = await request(app)
                .get('/api/users/timecapsule')
                .set('Authorization', `Bearer ${johnToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('songs');
        });
    });
});
