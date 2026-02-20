'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

// TIPO pode ser "MENSAL","SEMANAL","ANUAL","INTERVALO","FIXO"
// DT_INICIO pode ser "dia","dias de semanas","mes/mes","ano/mes/dia","ano/mes/dia"
// caso se o tipo for INTERVALO deve ser inserido data do FIm

class CreateProjetoRubricaSchema extends Schema {
  up () {
    this.create('eventodata', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'ENTIDADE_EVENTO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidadeevento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.text(/*Name*/'TIPO'/*Name*/,/*Size*/250/*Size*/) //data-schema  [T]Text[T] 
      table.text(/*Name*/'DT_INICIO'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.text(/*Name*/'DT_FIM'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Text[T]
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
