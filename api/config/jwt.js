require('dotenv').config()

module.exports = {
    secret: process.env.APP_KEY,
    expiresIn: '7d',
}