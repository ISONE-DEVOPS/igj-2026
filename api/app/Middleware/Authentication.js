'use strict'


const jwt = require('jsonwebtoken')
const authConfig = require('../../config/jwt')
const io = require('../../start/socket')
const Database = use('Database')

const { promisify } = require('util');



// Mapa de utilizadores conectados: { userID: Set<socketID> }
// Usa Set para suportar múltiplas abas do mesmo utilizador
let connectedsocket = {}

// Mapa inverso: socketID -> userID (para encontrar o user no disconnect)
let socketToUser = {}


io.on('connection', async socketio => {

  try {
    const decoded = await promisify(jwt.verify)(socketio.handshake.query.token, authConfig.secret);

    let rooms = [decoded.id + "*_USER"];
    rooms.push(decoded.perfil + "*_PERFIL")

    socketio.join(rooms)

    // Registar a conexão (suporta múltiplas abas)
    if (!connectedsocket[decoded.id]) {
      connectedsocket[decoded.id] = new Set()
    }
    connectedsocket[decoded.id].add(socketio.id)
    socketToUser[socketio.id] = decoded.id

    io.emit('standard', 'useronline')

    // Handler de desconexão
    socketio.on('disconnect', () => {
      const userId = socketToUser[socketio.id]
      if (userId && connectedsocket[userId]) {
        connectedsocket[userId].delete(socketio.id)
        // Se não tem mais nenhuma aba aberta, remover o utilizador
        if (connectedsocket[userId].size === 0) {
          delete connectedsocket[userId]
        }
      }
      delete socketToUser[socketio.id]
      io.emit('standard', 'useronline')
    })

  } catch (err) {
    // Token inválido ou expirado — desconectar o socket
    socketio.disconnect(true)
  }

})


class Authentication {
  async handle({ request, response }, next) {


    const authHeadear = request.headers().authorization;

    if (!authHeadear) {
      return response.status(401).json({ status: "401Error", message: "authorization header required" });
    }

    const [, token] = authHeadear.split(' ');

    let decoded
    try {
      decoded = await promisify(jwt.verify)(token, authConfig.secret);
    } catch (err) {
      return response.status(401).json({ status: "401Error", message: "invalid or expired token" });
    }

    // Verificar se o utilizador ainda está activo
    const user = await Database.table('glbuser')
      .where('ID', decoded.id)
      .where('ESTADO', '<>', '0')
      .limit(1)

    if (user.length < 1) {
      return response.status(401).json({ status: "401Error", message: "user inactive or not found" });
    }

    request.userID = decoded.id;
    request.perfilID = decoded.perfil;
    request.connectedsocket = connectedsocket
    request.io = io

    await next()


  }
  async wsHandle({ request }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = Authentication

/*



  console.log(rooms)
*/