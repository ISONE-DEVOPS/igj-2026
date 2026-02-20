'use strict'

const Model = use('Model')

class Sgigjprgenero extends Model {

    static get table () {
        return 'sgigjprgenero'
      }


     /* static get hidden () {
        return ['DT_REGISTO']
      }*/

      static get primaryKey () {
        return 'ID'
    }


    sgigjpessoa() {
        return this.hasMany('App/Models/Sgigjpessoa', 'ID', 'PR_GENERO_ID')
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }


}

module.exports = Sgigjprgenero
