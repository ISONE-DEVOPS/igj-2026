'use strict'

const Model = use('Model')

class Sgigjrelcontacto extends Model {

    static get table () {
        return 'sgigjrelcontacto'
    }

    sgigjprcontactotp() {
        return this.belongsTo('App/Models/Sgigjprcontactotp', 'PR_CONTACTO_TP_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjrelcontacto
