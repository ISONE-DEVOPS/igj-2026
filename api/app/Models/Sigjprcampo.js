'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sigjprcampo extends Model {
    static get table() {
        return 'sigjprcampo'
    }
    sgigjrelpecaprocessualcampo() {
        return this.hasMany('App/Models/Sgigjrelpecaprocessualcampo', 'ID', 'PR_CAMPOS_ID')
    }
    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sigjprcampo


