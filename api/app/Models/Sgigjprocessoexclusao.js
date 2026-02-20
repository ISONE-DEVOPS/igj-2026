'use strict'

const Model = use('Model')

class Sgigjprocessoexclusao extends Model {

  static get table() {
    return 'sgigjprocessoexclusao'
  }

  sgigjpessoa() {
    return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
  }

  notificacao(){
    return this.hasMany('App/Models/NotificacaoProcessos', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  decisaoTutelar(){
    return this.hasMany('App/Models/DecisaoTutelarProcessos', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  decisaoTribunal(){
    return this.hasMany('App/Models/DecisaoTribunalProcessos', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  sgigjentidade() {
    return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
  }

  sgigjprorigemtp() {
    return this.belongsTo('App/Models/Sgigjprorigemtp', 'PR_ORIGEM_TP_ID', 'ID')
  }

  sgigjprocessodespacho() {
    return this.hasMany('App/Models/Sgigjprocessodespacho', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  sgigjdespachofinal() {
    return this.hasMany('App/Models/Sgigjdespachofinal', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  sgigjrelpessoaentidade() {
    return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_REGISTO_ID', 'ID')
  }

  sgigjrelinterveniente() {
    return this.hasMany('App/Models/Sgigjrelinterveniente', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  sgigjrelcontraordenacaoinfracao() {
    return this.hasMany('App/Models/Sgigjrelcontraordenacaoinfracao', 'ID', 'PROCESSO_EXCLUSAO_ID')
  }

  criadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
  }

  deletadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
  }


}

module.exports = Sgigjprocessoexclusao
