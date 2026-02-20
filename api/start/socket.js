
const Server = use('Server')

const jwt = require('jsonwebtoken')
const authConfig = require('../config/jwt')
const {promisify} = require('util');




const io   = use('socket.io')(Server.getInstance(), {cors: {
    origin: '*',
}})


module.exports = io




