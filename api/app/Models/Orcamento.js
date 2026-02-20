'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Orcamento extends Model {

    static get table () {
        return 'orcamentos'
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

    projeto() {
        return this.hasMany('App/Models/Projeto', 'PROJETO_ID', 'ID')
    }
    cabimentacao() {
        return this.hasMany('App/Models/Cabimentacao', 'ID','ORCAMENTO_ID')
    }

    despesa() {
        return this.hasMany('App/Models/Orcalmentodespesa', 'ID','ORCALMENTO_ID')
    }


    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
    
}

module.exports = Orcamento
