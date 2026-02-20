'use strict'

const Schema = use('Schema')

class GlbgeografiaSchema extends Schema {

  up () {
    this.create('glbgeografia', (table) => {


      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string(/*Name*/'GLB_GEOG_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbgeografia'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      
      table.string(/*Name*/'NOME'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ZONA'/*Name*/,/*Size*/5/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'FREGUESIA'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CONCELHO'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ILHA'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'PAIS'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NIVEL_DETALHE'/*Name*/,/*Size*/2/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NACIONALIDADE'/*Name*/,/*Size*/100/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NOME_OFICIAL'/*Name*/,/*Size*/300/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'FLAG_ALTER'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NOME_NORM'/*Name*/,/*Size*/300/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'TP_GEOG_CD'/*Name*/,/*Size*/4/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'FLG_SITUACAO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CODIGO_INE'/*Name*/,/*Size*/20/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CODIGO'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
      
      

    })
  }

  down () {
    this.drop('glbgeografia')
  }

}

module.exports = GlbgeografiaSchema