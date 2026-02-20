'use strict'

const Model = use('Model')

class Glbuser extends Model {

    static get table () {
        return 'glbuser'
    }

    static get hidden () {
        return ['PASSWORD','PASSWORD_DT_ALTERACAO','ULTIMO_LOGIN','DT_REGISTO']
      }


      sgigjrelpessoaentidade() {
        return this.belongsTo('App/Models/Sgigjrelpessoaentidade', 'REL_PESSOA_ENTIDADE_ID', 'ID')
      }


      glbperfil() {
        return this.belongsTo('App/Models/Glbperfil', 'PERFIL_ID', 'ID')
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

      
}

module.exports = Glbuser
