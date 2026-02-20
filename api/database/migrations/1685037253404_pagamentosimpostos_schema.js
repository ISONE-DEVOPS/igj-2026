'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagamentosimpostoSchema extends Schema {
  up() {
    this.create('pagamentosimpostos', (table) => {
      table.string('ID', 36).primary()
      table.double(/*Name*/'VALOR'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.string(/*Name*/'NUM_DOC'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.datetime(/*Name*/'DT_CONFIRMACAO'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'USER_ID'/*Name*/, 36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'imposto_ID'/*Name*/, 36).references('ID').inTable(/*Table*/'impostos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'banco_iD'/*Name*/, 36).references('ID').inTable(/*Table*/'bancos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'meio_pagamento_ID'/*Name*/, 36).references('ID').inTable(/*Table*/'meiopagamentos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DOCUMENT_ID'/*Name*/, 36).references('ID').inTable(/*Table*/'sgigjreldocumento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      table.string(/*Name*/'DUC'/*Name*/,/*Size*/36/*Size*/)//data-schema  [T]Text[T]
      table.datetime(/*Name*/'DT_EMISSAO_DUC'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]

      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/, 36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/, 36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down() {
    this.drop('pagamentosimpostos')
  }
}

module.exports = PagamentosimpostoSchema
