'use strict'

const Schema = use('Schema')

class AddTermoEncerramentoToSgigjprocessoexclusaoSchema extends Schema {
  up () {
    this.table('sgigjprocessoexclusao', (table) => {
      table.string('ESTADO_ENCERRAMENTO', 20)
      table.date('DATA_ENCERRAMENTO')
      table.string('URL_TERMO_ENCERRAMENTO', 500)
    })
  }

  down () {
    this.table('sgigjprocessoexclusao', (table) => {
      table.dropColumn('ESTADO_ENCERRAMENTO')
      table.dropColumn('DATA_ENCERRAMENTO')
      table.dropColumn('URL_TERMO_ENCERRAMENTO')
    })
  }
}

module.exports = AddTermoEncerramentoToSgigjprocessoexclusaoSchema
