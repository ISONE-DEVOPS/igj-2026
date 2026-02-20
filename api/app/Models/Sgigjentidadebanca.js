'use strict'

const Model = use('Model')

class Sgigjentidadebanca extends Model {

    static get table () {
        return 'sgigjentidadebanca'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    sgigjprbancatp() {
        return this.belongsTo('App/Models/Sgigjprbancatp', 'PR_BANCA_TP_ID', 'ID')
    }

    sgigjprstatus() {
        return this.belongsTo('App/Models/Sgigjprstatus', 'PR_STATUS_ID', 'ID')
    }

    sgigjentidadegrupo() {
        return this.belongsTo('App/Models/Sgigjentidadegrupo', 'ENTIDADE_GRUPO_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjentidadebanca
