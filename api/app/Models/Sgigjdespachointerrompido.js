'use strict'

const Model = use('Model')

class Sgigjdespachointerrompido extends Model {

    static get table () {
        return 'sgigjdespachointerrompido'
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'DESPACHO_INTERROMPIDO_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjdespachointerrompido
