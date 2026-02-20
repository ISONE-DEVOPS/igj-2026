'use strict'

const Schema = use('Schema')

class SgigjprocessoautoexclusaoSchema extends Schema {
  up () {
    this.create('sgigjprocessoautoexclusao', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_REGISTO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PESSOA_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjpessoa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_MOTIVO_ESCLUSAO_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprmotivoesclusaotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_PROFISSAO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprprofissao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_EXCLUSAO_PERIODO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprexclusaoperiodo'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'HAND_PAY_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjhandpay'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema
      table.string('REF',/*Size*/10/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'DESCR'/*Name*/,/*Size*/64000/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.date(/*Name*/'DATA'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.date(/*Name*/'DT_INICIO'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.date(/*Name*/'DT_FIM'/*Name*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'URL_DOC_GERADO'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'URL_FOTO'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'FREGUESIA'/*Name*/,/*Size*/30000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CONCELHO'/*Name*/,/*Size*/30000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjprocessoautoexclusao')
  }
}

module.exports = SgigjprocessoautoexclusaoSchema
