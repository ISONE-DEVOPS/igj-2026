'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CasoSuspeito extends Model {

    static get table () {
        return 'casosuspeito'
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

    divisa() {
        return this.belongsTo('App/Models/Divisa', 'DIVISA_ID', 'ID')
    }

    modalidade() {
        return this.belongsTo('App/Models/ModalidadePagamento', 'MODALIDADE_ID', 'ID')
    }

    meiopagamento() {
        return this.belongsTo('App/Models/Meiopagamento', 'MEIOPAGAMENTO_ID', 'ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'PROCESSO_CASOSUSPEITO_ID')
    }

    intervenientes() {
        return this.hasMany('App/Models/Interveniente', 'ID', 'CASOSUSPEITO_ID').orderBy('COLETIVO')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = CasoSuspeito
