'use strict'

const Model = use('Model')

class Sgigjprorigemtp extends Model {

    static get table () {
        return 'sgigjprorigemtp'
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjprorigemtp
