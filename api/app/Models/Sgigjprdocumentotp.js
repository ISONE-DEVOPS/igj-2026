'use strict'

const Model = use('Model')

class Sgigjprdocumentotp extends Model {

    static get table () {
        return 'sgigjprdocumentotp'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjprdocumentotp
