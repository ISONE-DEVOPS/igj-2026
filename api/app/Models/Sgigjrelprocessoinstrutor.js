'use strict'

const Model = use('Model')

class Sgigjrelprocessoinstrutor extends Model {
    
    static get table () {
        return 'sgigjrelprocessoinstrutor'
    }

    
    sgigjrelprocessoinstrucao() {
        return this.hasMany('App/Models/Sgigjrelprocessoinstrucao', 'ID', 'REL_PROCESSO_INSTRUTOR_ID')
    }

    sgigjrelpessoaentidade() {
        return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_ID', 'ID')
    }

    sgigjrelprocessoinstrutor() {
        return this.belongsTo('App/Models/Sgigjprocessodespacho', 'REL_PROCESSO_INSTRUTOR_ID', 'ID')
    }

    sgigjprocessodespacho() {
        return this.belongsTo('App/Models/Sgigjprocessodespacho', 'PROCESSO_DESPACHO_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
    
}

module.exports = Sgigjrelprocessoinstrutor
