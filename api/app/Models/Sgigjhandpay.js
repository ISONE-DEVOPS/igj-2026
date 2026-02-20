'use strict'

const Model = use('Model')

class Sgigjhandpay extends Model {

    static get table () {
      return 'sgigjhandpay'
    }
    sgigjpessoa() {
      return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
    }

    sgigjentidade() {
      return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    sgigjreldocumento() {
      return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'HANDPAY_ID')
    }

    criadoPor() {
      return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
  }

  deletadoPor() {
      return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
  }
 
}

module.exports = Sgigjhandpay
