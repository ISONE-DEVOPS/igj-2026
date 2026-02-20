'use strict'

const Schema = use('Schema')

class SgigjdespachofinalSchema extends Schema {
  up () {
    this.create('sgigjdespachofinal', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_REGISTO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_DECISAO_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprdecisaotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PROCESSO_EXCLUSAO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjprocessoexclusao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'INFRACAO_COIMA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjinfracaocoima'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'DESPACHO'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'REFERENCIA'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Text[T]
      table.date(/*Name*/'DATA'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.float(/*Name*/'COIMA'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.integer(/*Name*/'PRAZO'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'URL_DOC_GERADO'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]      
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjdespachofinal')
  }
}

module.exports = SgigjdespachofinalSchema
