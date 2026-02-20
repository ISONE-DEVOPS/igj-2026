'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NotificacaoProcessosVisados extends Model {

    static get table () {
        return 'notificacao_processos_visados'
    }


    static get primaryKey () {
        return 'ID'
    }

    notificacaoProcessos() {
        return this.belongsTo('App/Models/NotificacaoProcessos', 'NOTIFICACAO_PROCESSO_ID', 'ID')
    }

    sgigjrelinterveniente() {
        return this.belongsTo('App/Models/Sgigjrelinterveniente', 'VISADO_ID','ID')
    }
}

module.exports = NotificacaoProcessosVisados
