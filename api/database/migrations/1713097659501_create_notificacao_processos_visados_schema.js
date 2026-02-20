'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateNotificacaoProcessosVisadosSchema extends Schema {
  up () {
    this.create('notificacao_processos_visados', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'VISADO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjrelinterveniente'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'NOTIFICACAO_PROCESSO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'notificacao_processos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
    })
  }

  down () {
    this.drop('notificacao_processos_visados')
  }
}

module.exports = CreateNotificacaoProcessosVisadosSchema
