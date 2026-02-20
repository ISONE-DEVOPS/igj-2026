'use strict'

const Schema = use('Schema')

class SgigjentidadeeventoSchema extends Schema {
  up () {
    this.create('sgigjentidadeevento', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_EVENTO_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjpreventotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_REGISTO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_RESPONSAVEL_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema      
      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]      
      table.string(/*Name*/'ESTADO_PROCESSO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]      
      table.string(/*Name*/'DESIG'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'DESCR'/*Name*/,/*Size*/64000/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.integer(/*Name*/'NUM_SORTEIO_NOITE'/*Name*/,/*Size*/11/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
      
    })
  }

  down () {
    this.drop('sgigjentidadeevento')
  }
}

module.exports = SgigjentidadeeventoSchema
