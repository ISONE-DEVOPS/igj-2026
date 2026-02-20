'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RubricasSchema extends Schema {
  up () {
    this.create('rubricas', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'DESIGNACAO'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.longText(/*Name*/'DESCRICAO'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'RUBRICA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'rubricas'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ULTIMO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('rubricas')
  }
}

module.exports = RubricasSchema
