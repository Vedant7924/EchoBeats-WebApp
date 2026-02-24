const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'Vedant',
        email: 'shindevedant752@gmail.com',
        password: 'VED%407924',
        role: 'admin'
    },
    {
        username: 'Atharv',
        email: 'patilatharv2829@gmail.com',
        password: 'atharv2005',
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
