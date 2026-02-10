const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'admin',
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
        username: 'JaneDoe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
    }
];

module.exports = users;
