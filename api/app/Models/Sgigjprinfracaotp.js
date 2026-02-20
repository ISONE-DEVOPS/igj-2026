'use strict'

const Model = use('Model')

class Sgigjprinfracaotp extends Model {

    static get table () {
        return 'sgigjprinfracaotp'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjprinfracaotp
