'use strict'

const Model = use('Model')

class Sgigjinfracaocoima extends Model {

    static get table () {
        return 'sgigjinfracaocoima'
    }

    sgigjprinfracaotp() {
        return this.belongsTo('App/Models/Sgigjprinfracaotp', 'PR_INFRACAO_TP_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}
 
module.exports = Sgigjinfracaocoima
