'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Premio extends Model {

    static get table () {
        return 'premios'
    }

    static get primaryKey () {
        return 'ID'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }

    subsequente() {
        return this.hasMany('App/Models/Premio', 'ID', 'PREMIOS_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

    banco() {
        return this.belongsTo('App/Models/Banco', 'banco_iD', 'ID')
    }

    meiopagamento() {
        return this.belongsTo('App/Models/Meiopagamento', 'meio_pagamento_ID', 'ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'DOCUMENT_PAGAMENTO_ID', 'ID')
    }
}

module.exports = Premio
