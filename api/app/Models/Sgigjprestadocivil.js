'use strict'

const Model = use('Model')

class Sgigjprestadocivil extends Model {

    static get table () {
        return 'sgigjprestadocivil'
    }

    static get primaryKey () {
        return 'ID'
    }


    sgigjpessoa() {
        return this.hasMany('App/Models/Sgigjpessoa', 'ID', 'PR_ESTADO_CIVIL_ID')
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjprestadocivil
