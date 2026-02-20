'use strict'

const Model = use('Model')

class Sgigjprocessoautoexclusao extends Model {

    static get table () {
        return 'sgigjprocessoautoexclusao'
    }

    sgigjpessoa() {
        return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    sgigjprmotivoesclusaotp() {
        return this.belongsTo('App/Models/Sgigjprmotivoesclusaotp', 'PR_MOTIVO_ESCLUSAO_TP_ID', 'ID')
    }

    sgigjprprofissao() {
        return this.belongsTo('App/Models/Sgigjprprofissao', 'PR_PROFISSAO_ID', 'ID')
    }

    sgigjprexclusaoperiodo() {
        return this.belongsTo('App/Models/Sgigjprexclusaoperiodo', 'PR_EXCLUSAO_PERIODO_ID', 'ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'PROCESSO_AUTOEXCLUSAO_ID')
    }

    sgigjprocessodespacho() {
        return this.hasMany('App/Models/Sgigjprocessodespacho', 'ID', 'PROCESSO_AUTOEXCLUSAO_ID') 
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }



}

module.exports = Sgigjprocessoautoexclusao
