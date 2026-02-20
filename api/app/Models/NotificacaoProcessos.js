'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NotificacaoProcessos extends Model {

    static get table () {
        return 'notificacao_processos'
    }


    static get primaryKey () {
        return 'ID'
    }

    processo() {
        return this.belongsTo('App/Models/Sgigjprocessoexclusao', 'PROCESSO_EXCLUSAO_ID', 'ID')
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }


    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'NOTIFICACAO_PROCESSO_ID')
    }

    visados() {
        return this.hasMany('App/Models/NotificacaoProcessosVisados', 'ID', 'NOTIFICACAO_PROCESSO_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = NotificacaoProcessos
