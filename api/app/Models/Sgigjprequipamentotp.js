'use strict'

const Model = use('Model')

class Sgigjprequipamentotp extends Model {

    static get table () {
        return 'sgigjprequipamentotp'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjprequipamentotp
