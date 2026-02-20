'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sgigjrelpecaprocessualcampo extends Model {
    static get table() {
        return 'sgigjrelpecaprocessualcampo'
    }
    static get createdAtColumn() {
        return null;
    }

    static get updatedAtColumn() {
        return null;
    }
    sgigjprpecasprocessual() {
        return this.belongsTo('App/Models/Sgigjprpecasprocessual', 'PR_PECASPROCESSUAL_ID', 'ID')
    }
    sigjprcampo() {
        return this.belongsTo('App/Models/Sigjprcampo', 'PR_CAMPOS_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjrelpecaprocessualcampo
