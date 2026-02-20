'use strict'

const Schema = use('Schema')

class SgigjrelprocessoinstrucaoSchema extends Schema {
  up () {
    this.create('sgigjrelprocessoinstrucao', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_REGISTO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PROCESSO_INSTRUTOR_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelprocessoinstrutor'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_DECISAO_TP_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjprdecisaotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'DESCR'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.date(/*Name*/'DT_INICIO_INSTRUCAO'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.date(/*Name*/'DT_FIM_INSTRUCAO'/*Name*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'RELATORIO_FINAL'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T] 
      table.date(/*Name*/'DT_RELATORIO_FINAL'/*Name*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'NOTA_NOTIFICACAO'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T] 
      table.date(/*Name*/'DT_NOTA_NOTIFICACAO'/*Name*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjrelprocessoinstrucao')
  }
}

module.exports = SgigjrelprocessoinstrucaoSchema
