'use strict'

const Model = use('Model')

class Sgigjentidadegrupo extends Model {

    static get table () {
        return 'sgigjentidadegrupo'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjentidadegrupo
