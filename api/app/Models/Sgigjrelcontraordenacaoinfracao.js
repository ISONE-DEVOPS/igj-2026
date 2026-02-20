'use strict'

const Model = use('Model')

class Sgigjrelcontraordenacaoinfracao extends Model {
    
    static get table () {
        return 'sgigjrelcontraordenacaoinfracao'
    }

    sgigjinfracaocoima() {
        return this.belongsTo('App/Models/Sgigjinfracaocoima', 'INFRACAO_COIMA_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjrelcontraordenacaoinfracao
