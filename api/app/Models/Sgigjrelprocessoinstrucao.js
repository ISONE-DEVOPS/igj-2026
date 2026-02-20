'use strict'

const Model = use('Model')

class Sgigjrelprocessoinstrucao extends Model {

    static get table () {
        return 'sgigjrelprocessoinstrucao'
    }

    sgigjrelinstrutorpeca() {
        return this.hasMany('App/Models/Sgigjrelinstrutorpeca', 'ID', 'REL_PROCESSO_INSTRUCAO_ID')
    }

    sgigjprocessodespacho() {
        return this.hasMany('App/Models/Sgigjprocessodespacho', 'ID', 'REL_PROCESSO_INSTRUCAO_ID')
    }

    sgigjdespachointerrompido() {
        return this.hasMany('App/Models/Sgigjdespachointerrompido', 'ID', 'REL_PROCESSO_INSTRUCAO_ID')
    }

    sgigjrelprocessoinstrutor() {
        return this.belongsTo('App/Models/Sgigjrelprocessoinstrutor', 'REL_PROCESSO_INSTRUTOR_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjrelprocessoinstrucao
