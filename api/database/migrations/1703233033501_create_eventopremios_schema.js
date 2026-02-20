'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateProjetoRubricaSchema extends Schema {
  up () {
    this.create('eventopremios', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'ENTIDADE_EVENTO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidadeevento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.text(/*Name*/'OBS'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.integer(/*Name*/'NUMERO'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'VALOR'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
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
