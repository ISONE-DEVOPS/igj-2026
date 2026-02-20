'use strict'

const Schema = use('Schema')

class GlbperfilmenusSchema extends Schema {

  up () {
    this.create('glbperfilmenu', (table) => {


      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string(/*Name*/'PERFIL_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'glbperfil'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'MENUS_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'glbmenu'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
      

    })
  }

  down () {
    this.drop('glbperfilmenu')
  }

}

module.exports = GlbperfilmenusSchema
