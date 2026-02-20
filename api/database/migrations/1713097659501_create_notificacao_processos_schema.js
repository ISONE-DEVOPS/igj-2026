'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateNotificacaoProcessosSchema extends Schema {
  up () {
    this.create('notificacao_processos', (table) => {
      table.string('ID',36).primary()
      table.string('CODIGO',/*Size*/50/*Size*/) //CODIGO-schema
      table.string(/*Name*/'PROCESSO_EXCLUSAO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjprocessoexclusao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.text(/*Name*/'CORPO'/*Name*/,/*Size*/1000/*Size*/) //data-schema  [T]Text[T] 
      table.text(/*Name*/'URL_DOC_GERADO'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'ESTADO_NOTIFICACAO'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Text[T] 
      table.date(/*Name*/'DATA'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('notificacao_processos')
  }
}

module.exports = CreateNotificacaoProcessosSchema
