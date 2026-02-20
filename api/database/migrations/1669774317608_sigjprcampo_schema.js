'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SigjprcampoSchema extends Schema {
  up() {
    this.create('sigjprcampo', (table) => {
      table.string('ID', 36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string('CODIGO',/*Size*/50/*Size*/) //CODIGO-schema
      table.string(/*Name*/'DESIG'/*Name*/,/*Size*/64/*Size*/) //data-schema  [T]Text[T]    
      table.string(/*Name*/'FLAG_PESSOA'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_DECISAO'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_ANEXO_DOC'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_OBS'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_DESTINATARIO'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_INFRACAO_COIMA'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_PERIODO_EXCLUSAO'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]     
      table.string(/*Name*/'FLAG_TEXTO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]     
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/)  //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down() {
    this.drop('sigjprcampo')
  }
}

module.exports = SigjprcampoSchema

