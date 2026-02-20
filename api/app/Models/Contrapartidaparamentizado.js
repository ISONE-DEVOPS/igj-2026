'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contrapartidaparamentizado extends Model {

    static get table() {
        return 'contrapartidaparamentizados'
    }

    static get primaryKey() {
        return 'ID'
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }


    entidade() {
        return this.hasMany('App/Models/Contrapartidaentidade', 'ID', 'CONTRAPARTIDA_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Contrapartidaparamentizado
