'use strict'

const Schema = use('Schema')

class SgigjentidadeSchema extends Schema {

  up () {
    this.create('sgigjentidade', (table) => {


      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string(/*Name*/'SELF_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_ENTIDADE_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprentidadetp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'GEOGRAFIA_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'glbgeografia'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      


      table.string('CODIGO',/*Size*/5/*Size*/).notNullable() //CODIGO-schema

      table.string(/*Name*/'DESIG'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'ENDERECO'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'ENDERECO_COORD'/*Name*/,/*Size*/48/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NIF'/*Name*/,/*Size*/9/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'REGISTO_COMERCIAL'/*Name*/,/*Size*/25/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.integer(/*Name*/'CAPITAL_SOCIAL'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'LOGO_URL'/*Name*/,/*Size*/128/*Size*/).notNullable() //data-schema  [T]Text[T]
      
      table.date(/*Name*/'DT_INICIO_ATIVIDADE'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Date[T]
      

      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('sgigjentidade')
  }

}

module.exports = SgigjentidadeSchema