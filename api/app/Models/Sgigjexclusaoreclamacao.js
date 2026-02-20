'use strict'

const Model = use('Model')

class Sgigjexclusaoreclamacao extends Model {

    static get table () {
        return 'sgigjexclusaoreclamacao'
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjexclusaoreclamacao
