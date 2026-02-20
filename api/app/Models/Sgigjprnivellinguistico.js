'use strict'

const Model = use('Model')

class Sgigjprnivellinguistico extends Model {

    static get table () {
        return 'sgigjprnivellinguistico'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjprnivellinguistico
