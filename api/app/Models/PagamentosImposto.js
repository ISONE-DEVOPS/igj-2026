'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PagamentosImposto extends Model {

    static get table () {
        return 'pagamentosimpostos'
    }

    static get primaryKey () {
        return 'ID'
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }

    imposto() {
        return this.belongsTo('App/Models/Imposto', 'imposto_ID', 'ID')
    }

    banco() {
        return this.belongsTo('App/Models/Banco', 'banco_iD', 'ID')
    }

    meiopagamento() {
        return this.belongsTo('App/Models/Meiopagamento', 'meio_pagamento_ID', 'ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'DOCUMENT_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = PagamentosImposto
