'use strict'


const jwt = require('jsonwebtoken')
const authConfig = require('../../config/jwt')
const io = require('../../start/socket')
const Database = use('Database')

const { promisify } = require('util');



let connectedsocket = {}


io.on('connection', async socketio => {

  const decoded = await promisify(jwt.verify)(socketio.handshake.query.token, authConfig.secret);

  let rooms = [decoded.id + "*_USER"];
  rooms.push(decoded.perfil + "*_PERFIL")
  //rooms.push(decoded.perfil+"*_ENTIDADE")

  socketio.join(rooms)


  connectedsocket[decoded.id] = socketio.id
  io.emit('standard', 'useronline')


})


class Authentication {
  async handle({ request, response }, next) {


    const authHeadear = request.headers().authorization;

    if (!authHeadear) {
      return response.status(401).json({ status: "401Error", message: "authorization header required" });
    }

    const [, token] = authHeadear.split(' ');

    try {

      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      // Verificar se o utilizador ainda está activo
      const user = await Database.table('glbuser')
        .where('ID', decoded.id)
        .where('ESTADO', '<>', '0')
        .limit(1)

      if (user.length < 1) {
        return response.status(401).json({ status: "401Error", message: "user inactive or not found" });
      }

      request.userID = decoded.id;
      request.connectedsocket = connectedsocket
      request.io = io

      await next()


    } catch (err) {

      return response.status(401).json({ status: "401Error", message: "invalid or expired token" });

    }


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