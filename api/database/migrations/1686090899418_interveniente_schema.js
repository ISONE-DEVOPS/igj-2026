'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IntervenienteSchema extends Schema {
  up () {
    this.create('interveniente', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'PESSOA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjpessoa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'TELEFONE'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Number[T]
      table.integer(/*Name*/'NIF'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'MORADA'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'PROFISSAO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjprprofissao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'LOCAL_TRABALHO'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'ENTIDADE_PATRONAL'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'NOME'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'ATIVIDADE'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'COLETIVO'/*Name*/,/*Size*/1/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'CASOSUSPEITO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'casosuspeito'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('interveniente')
  }
}

module.exports = IntervenienteSchema
