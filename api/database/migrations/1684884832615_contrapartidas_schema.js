'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContrapartidaSchema extends Schema {
  up () {

    this.create('contrapartidas', (table) => {
      table.string('ID',36).primary()
      table.string('CODIGO',/*Size*/50/*Size*/) //CODIGO-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.integer(/*Name*/'ANO'/*Name*/,/*Size*/15/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.string(/*Name*/'MES'/*Name*/,/*Size*/15/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.double(/*Name*/'BRUTO'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'Art_48'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.double(/*Name*/'Art_49'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.double(/*Name*/'Art_48_percent'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.double(/*Name*/'Art_49_percent'/*Name*/,/*Size*/100/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'DUC'/*Name*/,/*Size*/36/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'DUC_Art_48'/*Name*/,/*Size*/36/*Size*/)//data-schema  [T]Text[T]
      table.datetime(/*Name*/'DT_EMISSAO_DUC_Art_48'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'DUC_Art_49'/*Name*/,/*Size*/36/*Size*/)//data-schema  [T]Text[T]
      table.datetime(/*Name*/'DT_EMISSAO_DUC_Art_49'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('contrapartidas')
  }
}

module.exports = ContrapartidaSchema
