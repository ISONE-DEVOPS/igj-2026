'use strict'

const Model = use('Model')

class Sgigjprlingua extends Model {

    static get table () {
        return 'sgigjprlingua'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }


}

module.exports = Sgigjprlingua
