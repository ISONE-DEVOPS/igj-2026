'use strict'

const Schema = use('Schema')

class SgigjrelpessoaentidadelinguaSchema extends Schema {

  up () {
    this.create('sgigjrelpessoaentidadelingua', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()    
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_LINGUA_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprlingua'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_NIVEL_LINGUISTICO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprnivellinguistico'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema            
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjrelpessoaentidadelingua')
  }

}

module.exports = SgigjrelpessoaentidadelinguaSchema