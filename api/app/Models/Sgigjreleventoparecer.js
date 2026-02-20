'use strict'

const Model = use('Model')

class Sgigjreleventoparecer extends Model {

    static get table () {
        return 'sgigjreleventoparecer'
    }

    sgigjrelpessoaentidade() {
        return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_ID', 'ID')
    }

    parecer() {
        return this.belongsTo('App/Models/Parecerparametrizacao', 'PR_PARECER_TP_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjreleventoparecer
