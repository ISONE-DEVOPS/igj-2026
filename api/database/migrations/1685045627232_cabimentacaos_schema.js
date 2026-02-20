'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CabimentacaoSchema extends Schema {
  up () {
    this.create('cabimentacaos', (table) => {
      table.string('ID',36).primary()
      table.double(/*Name*/'CABIMENTADO'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'CABIMENTADO_PERCENT'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.longText(/*Name*/'COMENTARIO'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.timestamp(/*Name*/'DT_PAGAMENTO'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'USER_ID_PAGAMENTO'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PROJETO_RUBRICA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'projeto_rubrica'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      // table.string(/*Name*/'DOCUMENT_PAGAMENTO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjreldocumento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      // table.string(/*Name*/'NUM_DOC_PAGAMENTO'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]

      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('cabimentacaos')
  }
}



module.exports = CabimentacaoSchema
