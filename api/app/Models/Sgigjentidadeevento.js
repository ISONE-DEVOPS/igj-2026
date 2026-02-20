'use strict'

const Model = use('Model')

class Sgigjentidadeevento extends Model {

    static get table () {
        return 'sgigjentidadeevento'
    }


    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
    }

    sgigjpreventotp() {
        return this.belongsTo('App/Models/Sgigjpreventotp', 'PR_EVENTO_TP_ID', 'ID')
    }

    sgigjrelpessoaentidade() {
        return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_RESPONSAVEL_ID', 'ID')
    }

    sgigjrelenteventodecisao() {
        return this.hasMany('App/Models/Sgigjrelenteventodecisao', 'ID', 'ENTIDADE_EVENTO_ID')
    }

    premios() {
        return this.hasMany('App/Models/EventoPremios', 'ID', 'ENTIDADE_EVENTO_ID')
    }
    
    data() {
        return this.belongsTo('App/Models/EventoData', 'ID', 'ENTIDADE_EVENTO_ID')
    }

    sgigjrelenteventodecisao() {
        return this.hasMany('App/Models/Sgigjrelenteventodecisao', 'ID', 'ENTIDADE_EVENTO_ID')
    }

    sgigjreleventodespacho() {
        return this.hasMany('App/Models/Sgigjreleventodespacho', 'ID', 'ENTIDADE_EVENTO_ID')
    }

    sgigjreldocumento() {
        return this.hasMany('App/Models/Sgigjreldocumento', 'ID', 'ENTIDADE_EVENTO_ID')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

    

}

module.exports = Sgigjentidadeevento
