'use strict'

const Schema = use('Schema')

class SgigjinfracaocoimaSchema extends Schema {
  up() {
    this.create('sgigjinfracaocoima', (table) => {
      table.string('ID', 36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string('CODIGO',/*Size*/258/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'PR_INFRACAO_TP_ID'/*Name*/, 36).notNullable().references('ID').inTable(/*Table*/'sgigjprinfracaotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.float(/*Name*/'VALOR_MINIMO'/*Name*/,/*Size*/11/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.float(/*Name*/'VALOR_MAXIMO'/*Name*/,/*Size*/11/*Size*/).notNullable() //data-schema  [T]Number[T]
      table.date(/*Name*/'DT_INICIO'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.date(/*Name*/'DT_FIM'/*Name*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down() {
    this.drop('sgigjinfracaocoima')
  }
}

module.exports = SgigjinfracaocoimaSchema
