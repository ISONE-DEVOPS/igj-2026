'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contribuicoes extends Model {

    static get table () {
        return 'contribuicoes'
    }

    static get primaryKey () {
        return 'ID'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }

    pagamento() {
        return this.hasMany('App/Models/Pagamentoscontribuicoes', 'ID', 'contribuicoes_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Contribuicoes
