const request = require('supertest');
const app = require('../server');
const { validateEmail, validatePassword, validateUsername, isValidObjectId } = require('../utils/validation');

describe('EchoBeats Utility & API Sanity Tests', () => {
    describe('Validation Helpers', () => {
        test('validateEmail validates correctly', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('')).toBe(false);
        });

        test('validatePassword validates length', () => {
            expect(validatePassword('123456')).toBe(true);
            expect(validatePassword('12345')).toBe(false);
        });

        test('validateUsername validates length boundaries', () => {
            expect(validateUsername('john_doe')).toBe(true);
            expect(validateUsername('a')).toBe(false);
        });

        test('isValidObjectId validates MongoDB ObjectIds', () => {
            expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
            expect(isValidObjectId('invalid-id')).toBe(false);
        });
    });

    describe('Public Routes', () => {
        test('GET / returns API status message', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('EchoBeats API is running');
        });
    });
});
