'use strict'

const Model = use('Model')

class Sgigjrelnotificacaovizualizado extends Model {

    static get table () {
        return 'sgigjrelnotificacaovizualizado'
    }
    
    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjrelnotificacaovizualizado
