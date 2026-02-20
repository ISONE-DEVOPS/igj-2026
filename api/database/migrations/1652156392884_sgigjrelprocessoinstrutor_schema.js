'use strict'

const Schema = use('Schema')

class SgigjrelprocessoinstrutorSchema extends Schema {
  up () {
    this.create('sgigjrelprocessoinstrutor', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PROCESSO_DESPACHO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprocessodespacho'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DESCR'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.integer(/*Name*/'PRAZO'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjrelprocessoinstrutor')
  }
}

module.exports = SgigjrelprocessoinstrutorSchema
