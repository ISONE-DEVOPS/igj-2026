'use strict'

const Model = use('Model')

class Sgigjpessoa extends Model {

  static get table() {
    return 'sgigjpessoa'
  }

  static get primaryKey() {
    return 'ID'
  }

  sgigjprestadocivil() {
    return this.belongsTo('App/Models/Sgigjprestadocivil', 'PR_ESTADO_CIVIL_ID', 'ID')
  }

  sgigjprgenero() {
    return this.belongsTo('App/Models/Sgigjprgenero', 'PR_GENERO_ID', 'ID')
  }

  nacionalidade() {
    return this.belongsTo('App/Models/Glbgeografia', 'NACIONALIDADE_ID', 'ID')
  }

  localidade() {
    return this.belongsTo('App/Models/Glbgeografia', 'LOCALIDADE_ID', 'ID')
  }

  sgigjrelpessoaentidade() {
    return this.hasMany('App/Models/Sgigjrelpessoaentidade', 'ID', 'PESSOA_ID')
  }

  sgigjrelpessoaentidade() {
    return this.hasMany('App/Models/Sgigjrelpessoaentidade', 'ID', 'PESSOA_ID')
  }

  sgigjreldocumento() {
    return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'PESSOA_ID')
  }

  sgigjrelcontacto() {
    return this.hasMany('App/Models/Sgigjrelcontacto', 'ID', 'PESSOA_ID')
  }

  criadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
  }

  deletadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
  }

}

module.exports = Sgigjpessoa
