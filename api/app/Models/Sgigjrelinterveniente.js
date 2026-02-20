'use strict'

const Model = use('Model')

class Sgigjrelinterveniente extends Model {

    static get table () {
        return 'sgigjrelinterveniente'
    }

    sgigjpessoa() {
        return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjrelinterveniente
