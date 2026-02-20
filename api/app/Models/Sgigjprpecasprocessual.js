'use strict'

const Model = use('Model')

class Sgigjprpecasprocessual extends Model {

  static get table() {
    return 'sgigjprpecasprocessual'
  }
  sgigjrelpecaprocessualcampo() {
    return this.hasMany('App/Models/Sgigjrelpecaprocessualcampo', 'ID', 'PR_PECASPROCESSUAL_ID').where('ESTADO', "1")
  }

  criadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
}

deletadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
}

}

module.exports = Sgigjprpecasprocessual
