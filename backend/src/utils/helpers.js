const crypto = require('crypto');

const generateId = (prefix) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomBytes = crypto.randomBytes(16);
    for (let i = 0; i < 16; i++) {
        result += chars[randomBytes[i] % chars.length];
    }
    return prefix + result;
};

module.exports = { generateId };
