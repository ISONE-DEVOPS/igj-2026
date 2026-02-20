'use strict'

const Model = use('Model')

class Sgigjentidade extends Model {

    static get table () {
        return 'sgigjentidade'
    }

    sgigjprentidadetp() {
        return this.belongsTo('App/Models/Sgigjprentidadetp', 'PR_ENTIDADE_TP_ID', 'ID')
    }

    glbgeografia() {
        return this.belongsTo('App/Models/Glbgeografia', 'GEOGRAFIA_ID', 'ID')
    }

    sgigjentidademaquina() {
        return this.hasMany('App/Models/Sgigjentidademaquina', 'ID', 'ENTIDADE_ID')
    }

    sgigjentidadebanca() {
        return this.hasMany('App/Models/Sgigjentidadebanca', 'ID', 'ENTIDADE_ID')
    }

    sgigjentidadegrupo() {
        return this.hasMany('App/Models/Sgigjentidadegrupo', 'ID', 'ENTIDADE_ID')
    }

    sgigjentidadeequipamento() {
        return this.hasMany('App/Models/Sgigjentidadeequipamento', 'ID', 'ENTIDADE_ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'ENTIDADE_ID')
    }

    sgigjrelcontacto() {
        return this.hasMany('App/Models/Sgigjrelcontacto', 'ID', 'ENTIDADE_ID')
    }

    sgigjrelpessoaentidade() {
        return this.hasMany('App/Models/Sgigjrelpessoaentidade', 'ID', 'ENTIDADE_ID')
    }

    sgigjrelpessoaentidade() {
        return this.hasMany('App/Models/Sgigjrelpessoaentidade', 'ID', 'ENTIDADE_ID')
    }

    sgigjhandpay() {
        return this.hasMany('App/Models/Sgigjhandpay', 'ID', 'ENTIDADE_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Sgigjentidade
