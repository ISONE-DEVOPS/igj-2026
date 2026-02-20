'use strict'

const Schema = use('Schema')

class GlbmenusSchema extends Schema {

  up () {
    this.create('glbmenu', (table) => {


      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string(/*Name*/'SELF_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbmenu'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      table.string(/*Name*/'DS_MENU'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'URL'/*Name*/,/*Size*/1024/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'URL_ICON'/*Name*/,/*Size*/128/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'TIPO'/*Name*/,/*Size*/45/*Size*/) //data-schema  [T]Text[T]

      
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.integer(/*Name*/'ORDEM'/*Name*/).notNullable() //data-schema  [T]Number[T]

      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('glbmenu')
  }

}

module.exports = GlbmenusSchema