'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Orcalmentodespesa extends Model {
    static get table () {
        return 'orcalmentodespesa'
    }

    static get primaryKey () {
        return 'ID'
    }

    glbuser() {
        return this.belongsTo('App/Models/Glbuser', 'USER_ID', 'ID')
    }

    rubrica() {
        return this.hasMany('App/Models/Rubrica', 'RUBRICA_ID', 'ID')
    }

    orcalmento() {
        return this.hasMany('App/Models/Orcamento', 'ORCALMENTO_ID', 'ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'ORCALMENTO_DESPESA_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Orcalmentodespesa
