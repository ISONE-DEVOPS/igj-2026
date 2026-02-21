'use strict'

const Model = use('Model')

class Sgigjexclusaoreclamacao extends Model {

    static get table () {
        return 'sgigjexclusaoreclamacao'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

    sgigjprocessoexclusao() {
        return this.belongsTo('App/Models/Sgigjprocessoexclusao', 'PROCESSO_EXCLUSAO_ID', 'ID')
    }

    sgigjrelpessoaentidade() {
        return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_REGISTO_ID', 'ID')
    }

    sgigjrelprocessoinstrucao() {
        return this.belongsTo('App/Models/Sgigjrelprocessoinstrucao', 'REL_PROCESSO_INSTRUCAO_ID', 'ID')
    }

    sgigjrelreclamacaopeca() {
        return this.hasMany('App/Models/Sgigjrelreclamacaopeca', 'ID', 'EXCLUSAO_RECLAMACAO_ID')
    }

}

module.exports = Sgigjexclusaoreclamacao
