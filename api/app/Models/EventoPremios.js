'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EventoPremios extends Model {

    static get table () {
        return 'eventopremios'
    }
    
    static get primaryKey () {
        return 'ID'
    }

    eventos() {
        return this.belongsTo('App/Models/Sgigjentidadeevento', 'ENTIDADE_EVENTO_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = EventoPremios
