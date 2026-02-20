'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CasoSuspeitoSchema extends Schema {
  up () {
    this.create('casosuspeito', (table) => {
      table.string('ID',36).primary()
      table.string('CODIGO',/*Size*/50/*Size*/) //CODIGO-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REFERENCIA'/*Name*/,/*Size*/1500/*Size*/) //data-schema  [T]Text[T] 
      table.datetime(/*Name*/'DT'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.datetime(/*Name*/'DT_OPERACAO'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Date[T]
      table.double(/*Name*/'VALOR'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'DIVISA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'divisa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'MEIOPAGAMENTO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'meiopagamentos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'MODALIDADE_ID'/*Name*/,36).references('ID').inTable(/*Table*/'modalidadepagamento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.text(/*Name*/'TIPO_BEM'/*Name*/,/*Size*/1500/*Size*/) //data-schema  [T]Text[T] 
      table.text(/*Name*/'MOTIVO'/*Name*/,/*Size*/1500/*Size*/) //data-schema  [T]Text[T] 
      table.text(/*Name*/'OBS'/*Name*/,/*Size*/1500/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('casosuspeito')
  }
}

module.exports = CasoSuspeitoSchema
