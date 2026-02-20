'use strict'

const Schema = use('Schema')

class SgigjprtipologiaSchema extends Schema {

  up () {
    this.create('sgigjprtipologia', (table) => {


      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      
      table.string('CODIGO',/*Size*/5/*Size*/).notNullable() //CODIGO-schema

      table.string(/*Name*/'DESIG'/*Name*/,/*Size*/128/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('sgigjprtipologia')
  }

}

module.exports = SgigjprtipologiaSchema

