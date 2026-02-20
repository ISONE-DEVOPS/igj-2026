'use strict'

const functionsDatabase = require('../functionsDatabase');
class entity {
  async store({ request }) {


    const { USERNAME, PASSWORD } = request.only(['USERNAME', 'PASSWORD'])

    return await functionsDatabase.login(USERNAME, PASSWORD)

  }

}

module.exports = entity
