'use strict'

const Model = use('Model')

class Sgigjdespachofinal extends Model {

    static get table () {
        return 'sgigjdespachofinal'
    }

    sgigjprdecisaotp() {
        return this.belongsTo('App/Models/Sgigjprdecisaotp', 'PR_DECISAO_TP_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjdespachofinal
