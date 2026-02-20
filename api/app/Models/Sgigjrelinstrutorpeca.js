'use strict'

const Model = use('Model')

class Sgigjrelinstrutorpeca extends Model {
    
    static get table () {
        return 'sgigjrelinstrutorpeca'
    }

    sgigjrelprocessoinstrucao() {
      return this.belongsTo('App/Models/Sgigjrelprocessoinstrucao', 'REL_PROCESSO_INSTRUCAO_ID', 'ID')
    }

    sgigjprpecasprocessual() {
        return this.belongsTo('App/Models/Sgigjprpecasprocessual', 'PR_PECAS_PROCESSUAIS_ID', 'ID')
      }

    sgigjreldocumento() {
      return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'REL_INSTRUTOR_PECAS_ID')
    }

    criadoPor() {
      return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
  }

  deletadoPor() {
      return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
  }
    
}

module.exports = Sgigjrelinstrutorpeca
