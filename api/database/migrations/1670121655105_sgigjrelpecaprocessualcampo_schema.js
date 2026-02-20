'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SgigjrelpecaprocessualcampoSchema extends Schema {
  up() {
    this.create('sgigjrelpecaprocessualcampos', (table) => {
      table.string('ID', 36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'PR_PECASPROCESSUAL_ID'/*Name*/, 36).notNullable().references('ID').inTable(/*Table*/'sgigjprpecasprocessual'/*Table*/) //key-schema
      table.string(/*Name*/'PR_CAMPOS_ID'/*Name*/, 36).notNullable().references('ID').inTable(/*Table*/'sigjprcampo'/*Table*/) //key-schema
      table.string('ORDEM',/*Size*/11/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'FLAG_OBRIGATORIEDADE'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T] 
      table.longText(/*Name*/'TEXT'/*Name*/,/*Size*/1000/*Size*/) //data-schema  [T]Text[T] 
      table.date(/*Name*/'DATA'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down() {
    this.drop('sgigjrelpecaprocessualcampos')
  }
}

module.exports = SgigjrelpecaprocessualcampoSchema
