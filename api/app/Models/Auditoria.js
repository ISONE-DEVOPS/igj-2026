'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Auditoria extends Model {
    static get table () {
        return 'auditoria'
    }

    static get primaryKey () {
        return 'ID'
    }
    user() {
        return this.belongsTo('App/Models/Glbuser', 'User_ID', 'ID')
    }
}

module.exports = Auditoria
