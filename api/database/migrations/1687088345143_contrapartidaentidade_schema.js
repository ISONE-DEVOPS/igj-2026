'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContrapartidaEntidadeSchema extends Schema {
  up() {
    this.create('contrapartidaentidade', (table) => {
      table.string('ID', 36).primary()
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/, 36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'CONTRAPARTIDA_ID'/*Name*/, 36).references('ID').inTable(/*Table*/'contrapartidaparamentizados'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down() {
    this.drop('contrapartidaentidade')
  }
}

module.exports = ContrapartidaEntidadeSchema
