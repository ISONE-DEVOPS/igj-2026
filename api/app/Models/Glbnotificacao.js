'use strict'

const Model = use('Model')

class Glbnotificacao extends Model {

  static get table() {
    return 'glbnotificacao'
  }


  sgigjpessoa() {
    return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
  }

  sgigjrelnotificacaovizualizado() {
    return this.hasMany('App/Models/Sgigjrelnotificacaovizualizado', 'ID', 'NOTIFICACAO_ID')
  }

  criadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
  }

  deletadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
  }

}

module.exports = Glbnotificacao
