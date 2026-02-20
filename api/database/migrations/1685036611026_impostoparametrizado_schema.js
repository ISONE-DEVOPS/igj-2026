'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImpostoparametrizadoSchema extends Schema {
  up () {
    this.create('impostoparametrizados', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'NOME'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.text(/*Name*/'TYPE'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.double(/*Name*/'PERCENTAGEM'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('impostoparametrizados')
  }
}

module.exports = ImpostoparametrizadoSchema
