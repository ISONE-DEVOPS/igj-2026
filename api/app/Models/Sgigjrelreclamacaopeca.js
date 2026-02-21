'use strict'

const Model = use('Model')

class Sgigjrelreclamacaopeca extends Model {

    static get table () {
        return 'sgigjrelreclamacaopeca'
    }
    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

    sgigjexclusaoreclamacao() {
        return this.belongsTo('App/Models/Sgigjexclusaoreclamacao', 'EXCLUSAO_RECLAMACAO_ID', 'ID')
    }

    sgigjprpecasprocessual() {
        return this.belongsTo('App/Models/Sgigjprpecasprocessual', 'PR_PECAS_PROCESSUAIS_ID', 'ID')
    }

}

module.exports = Sgigjrelreclamacaopeca
