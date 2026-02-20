'use strict'

const Schema = use('Schema')

class GlbpredefinicaoSchema extends Schema {
  up () {
    this.create('glbpredefinicao', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'NOME'/*Name*/,/*Size*/20/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'DADOS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('glbpredefinicao')
  }
}

module.exports = GlbpredefinicaoSchema
