'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateProjetoRubricaSchema extends Schema {
  up () {
    this.create('projeto_rubrica', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'PROJETO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'projetos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'RUBRICA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'rubricas'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.integer(/*Name*/'ANO'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Number[T]
      table.text(/*Name*/'OBS'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.double(/*Name*/'ORCAMENTO_INICIAL'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'ORCAMENTO_CORRIGIDO'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'ORCAMENTO_DISPONIVEL'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'SALDO_DISPONIVEL'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.double(/*Name*/'PAGO'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.double(/*Name*/'PAGO_PERCENT'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('projeto_rubrica')
  }
}

module.exports = CreateProjetoRubricaSchema
