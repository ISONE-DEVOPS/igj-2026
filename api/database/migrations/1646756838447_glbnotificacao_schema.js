'use strict'

const Schema = use('Schema')

class GlbnotificacaoSchema extends Schema {
  up () {
    this.create('glbnotificacao', (table) => {

      
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string(/*Name*/'USER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PERFIL_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbperfil'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PESSOA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjpessoa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      table.string(/*Name*/'TITULO'/*Name*/,/*Size*/128/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'URL'/*Name*/,/*Size*/128/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'MSG'/*Name*/,/*Size*/128/*Size*/).notNullable() //data-schema  [T]Text[T]

      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('glbnotificacao')
  }

}

module.exports = GlbnotificacaoSchema
