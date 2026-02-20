'use strict'

const Model = use('Model')

class Sgigjrelpessoaentidade extends Model {

    static get table () {
        return 'sgigjrelpessoaentidade'
    }

    sgigjentidade() {
        return this.belongsTo('App/Models/Sgigjentidade', 'ENTIDADE_ID', 'ID')
      }


      sgigjpessoa() {
        return this.belongsTo('App/Models/Sgigjpessoa', 'PESSOA_ID', 'ID')
      }

      sgigjprcategoriaprofissional() {
        return this.belongsTo('App/Models/Sgigjprcategoriaprofissional', 'PR_CATEGORIA_PROFISSIONAL_ID', 'ID')
      }

      sgigjprnivelescolaridade() {
        return this.belongsTo('App/Models/Sgigjprnivelescolaridade', 'PR_NIVEL_ESCOLARIDADE_ID', 'ID')
      }

      sgigjrelpessoaentidadelingua() {
        return this.hasMany('App/Models/Sgigjrelpessoaentidadelingua', 'ID', 'REL_PESSOA_ENTIDADE_ID')
      }

      glbuser() {
        return this.hasMany('App/Models/Glbuser', 'ID', 'REL_PESSOA_ENTIDADE_ID')
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }



      

}

module.exports = Sgigjrelpessoaentidade
