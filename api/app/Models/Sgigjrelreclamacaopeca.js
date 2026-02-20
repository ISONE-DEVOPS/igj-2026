'use strict'

const Model = use('Model')

class Sgigjrelreclamacaopeca extends Model {

    static get table () {
        return 'sgigjrelreclamacaopeca'
    }
    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
    
}

module.exports = Sgigjrelreclamacaopeca
