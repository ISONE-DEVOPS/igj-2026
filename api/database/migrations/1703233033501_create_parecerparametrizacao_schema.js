'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateParecerparametrizacaoSchema extends Schema {
  up () {
    this.create('parecerparametrizacao', (table) => {
      table.text(/*Name*/'NOME'/*Name*/,/*Size*/250/*Size*/).notNullable() //data-schema  [T]Text[T] 
      table.text(/*Name*/'DESCRICAO'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('parecerparametrizacao')
  }
}

module.exports = CreateParecerparametrizacaoSchema
