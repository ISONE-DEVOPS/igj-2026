'use strict'

const Model = use('Model')

class Sgigjrelenteventodecisao extends Model {

    static get table () {
        return 'sgigjrelenteventodecisao'
    }


    sgigjrelpessoaentidade() {
        return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_ID', 'ID')
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

module.exports = Sgigjrelenteventodecisao
