'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Interveniente extends Model {

    static get table() {
        return 'interveniente'
    }

    static get primaryKey() {
        return 'ID'
    }

    casosuspeito() {
        return this.belongsTo('App/Models/CasoSuspeito', 'ID', 'CASOSUSPEITO_ID')
    }

    pessoa() {
        return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
    }

    profissao() {
        return this.belongsTo('App/Models/Sgigjprprofissao', 'PROFISSAO_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}





module.exports = Interveniente

