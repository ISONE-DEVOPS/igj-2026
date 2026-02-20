'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PremiosSchema extends Schema {
  up () {
    this.create('premios', (table) => {
      table.string('ID',36).primary()
      table.string('CODIGO',/*Size*/50/*Size*/) //CODIGO-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PREMIOS_ID'/*Name*/,36).references('ID').inTable(/*Table*/'premios'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.integer(/*Name*/'ANO'/*Name*/,/*Size*/15/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'VALOR'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'SUBSEQUENTE'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.double(/*Name*/'N_VEZES'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.double(/*Name*/'PRIMEIRO_ANO'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'USER_ID_PAGAMENTO'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      
      table.string(/*Name*/'DUC'/*Name*/,/*Size*/36/*Size*/) //data-schema  [T]Text[T]
      table.datetime(/*Name*/'DT_EMISSAO_DUC'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      
      table.string(/*Name*/'NUM_DOC_PAGAMENTO'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.datetime(/*Name*/'DT_PAGAMENTO'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'banco_iD'/*Name*/,36).references('ID').inTable(/*Table*/'bancos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DOCUMENT_PAGAMENTO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjreldocumento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'meio_pagamento_ID'/*Name*/,36).references('ID').inTable(/*Table*/'meiopagamentos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('premios')
  }
}

module.exports = PremiosSchema
