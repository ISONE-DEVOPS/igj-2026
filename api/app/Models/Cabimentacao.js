'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cabimentacao extends Model {

    static get table () {
        return 'cabimentacaos'
    }
    
    static get primaryKey () {
        return 'ID'
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }

    projeto_rubrica() {
        return this.hasMany('App/Models/ProjetoRubrica', 'PROJETO_RUBRICA_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'PAGAMENTO_CABIMENTO')
    }
}

module.exports = Cabimentacao
