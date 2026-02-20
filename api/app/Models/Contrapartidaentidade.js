'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contrapartidaentidade extends Model {
    static get table () {
        return 'contrapartidaentidade'
    }

    static get primaryKey () {
        return 'ID'
    }

    contrapartidaParamentrizado() {
        return this.belongsTo('App/Models/Contrapartidaparamentizado', 'CONTRAPARTIDA_ID', 'ID')
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Contrapartidaentidade
