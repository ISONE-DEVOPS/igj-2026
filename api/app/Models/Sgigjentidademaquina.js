'use strict'

const Model = use('Model')

class Sgigjentidademaquina extends Model {

    static get table () {
        return 'sgigjentidademaquina'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    sgigjprstatus() {
        return this.belongsTo('App/Models/Sgigjprstatus', 'PR_STATUS_ID', 'ID')
    }

    sgigjentidadegrupo() {
        return this.belongsTo('App/Models/Sgigjentidadegrupo', 'ENTIDADE_GRUPO_ID', 'ID')
    }

    sgigjprmaquinatp() {
        return this.belongsTo('App/Models/Sgigjprmaquinatp', 'PR_MAQUINA_TP_ID', 'ID')
    }

    glbgeografia() {
        return this.belongsTo('App/Models/Glbgeografia', 'PAIS_PRODUCAO_ID', 'ID')
    }

    sgigjprtipologia() {
        return this.belongsTo('App/Models/Sgigjprtipologia', 'PR_TIPOLOGIA_ID', 'ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjentidademaquina
