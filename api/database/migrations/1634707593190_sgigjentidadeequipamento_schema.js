'use strict'

const Schema = use('Schema')

class SgigjentidadeequipamentoSchema extends Schema {

  up () {
    this.create('sgigjentidadeequipamento', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string('CODIGO',/*Size*/5/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_EQUIPAMENTO_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprequipamentotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_EQUIPAMENTO_CLASSIFICACAO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprequipamentoclassificacao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DESIG'/*Name*/,/*Size*/128/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'DESCR'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.integer(/*Name*/'QUANT'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'REFERENCIA'/*Name*/,/*Size*/25/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.integer(/*Name*/'PRECO'/*Name*/,/*Size*/11/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'ANO'/*Name*/,/*Size*/4/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.date(/*Name*/'DT_AQUISICAO'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Date[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]  
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjentidadeequipamento')
  }

}

module.exports = SgigjentidadeequipamentoSchema