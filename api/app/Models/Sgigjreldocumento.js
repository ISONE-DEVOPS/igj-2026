'use strict'

const Model = use('Model')

class Sgigjreldocumento extends Model {

    static get table () {
        return 'sgigjreldocumento'
    }

    sgigjprdocumentotp() {
        return this.belongsTo('App/Models/Sgigjprdocumentotp', 'PR_DOCUMENTO_TP_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjreldocumento
