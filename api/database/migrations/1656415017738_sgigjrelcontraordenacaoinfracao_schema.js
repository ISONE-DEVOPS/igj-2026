'use strict'

const Schema = use('Schema')

class SgigjrelcontraordenacaoinfracaoSchema extends Schema {
  up () {
    this.create('sgigjrelcontraordenacaoinfracao', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'INFRACAO_COIMA_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjinfracaocoima'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PROCESSO_EXCLUSAO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprocessoexclusao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.float(/*Name*/'VALOR_PROPOSTO'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.float(/*Name*/'VALOR_FINAL'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjrelcontraordenacaoinfracao')
  }
}

module.exports = SgigjrelcontraordenacaoinfracaoSchema
