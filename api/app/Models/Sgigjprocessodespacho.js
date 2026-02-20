'use strict'

const Model = use('Model')

class Sgigjprocessodespacho extends Model {

    static get table () {
        return 'sgigjprocessodespacho'
    }

    sgigjrelprocessoinstrutor() {
        return this.hasMany('App/Models/Sgigjrelprocessoinstrutor', 'ID', 'PROCESSO_DESPACHO_ID')
    }


    sgigjprdecisaotp() {
        return this.belongsTo('App/Models/Sgigjprdecisaotp', 'PR_DECISAO_TP_ID', 'ID')
    }

    sgigjprexclusaoperiodo() {
        return this.belongsTo('App/Models/Sgigjprexclusaoperiodo', 'PR_EXCLUSAO_PERIODO_ID', 'ID')
    }

    sgigjprocessoexclusao() {
        return this.belongsTo('App/Models/Sgigjprocessoexclusao', 'PROCESSO_EXCLUSAO_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjprocessodespacho
