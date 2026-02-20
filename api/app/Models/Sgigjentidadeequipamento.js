'use strict'

const Model = use('Model')

class Sgigjentidadegrupo extends Model {

    static get table () {
        return 'sgigjentidadeequipamento'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    sgigjprequipamentotp() {
        return this.belongsTo('App/Models/Sgigjprequipamentotp', 'PR_EQUIPAMENTO_TP_ID', 'ID')
    }

    sgigjprequipamentoclassificacao() {
        return this.belongsTo('App/Models/Sgigjprequipamentoclassificacao', 'PR_EQUIPAMENTO_CLASSIFICACAO_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjentidadegrupo
