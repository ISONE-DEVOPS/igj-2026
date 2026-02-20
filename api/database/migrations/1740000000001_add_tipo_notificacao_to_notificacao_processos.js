'use strict'

const Schema = use('Schema')

class AddTipoNotificacaoToNotificacaoProcessosSchema extends Schema {
  up () {
    this.table('notificacao_processos', (table) => {
      table.string('TIPO_NOTIFICACAO', 20).after('DATA')
    })
  }

  down () {
    this.table('notificacao_processos', (table) => {
      table.dropColumn('TIPO_NOTIFICACAO')
    })
  }
}

module.exports = AddTipoNotificacaoToNotificacaoProcessosSchema
