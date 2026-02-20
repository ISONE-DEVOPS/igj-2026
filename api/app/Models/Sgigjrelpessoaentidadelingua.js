'use strict'

const Model = use('Model')

class Sgigjrelpessoaentidadelingua extends Model {
    
    static get table () {
        return 'sgigjrelpessoaentidadelingua'
    }

    sgigjprlingua() {
        return this.belongsTo('App/Models/Sgigjprlingua', 'PR_LINGUA_ID', 'ID')
      }

    sgigjprnivellinguistico() {
        return this.belongsTo('App/Models/Sgigjprnivellinguistico', 'PR_NIVEL_LINGUISTICO_ID', 'ID')
      }

      criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }
}

module.exports = Sgigjrelpessoaentidadelingua
