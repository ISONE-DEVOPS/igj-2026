'use strict'

const Schema = use('Schema')

class SgigjreldocumentoSchema extends Schema {

  up () {
    this.create('sgigjreldocumento', (table) => {


      
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
    
      table.string(/*Name*/'PR_DOCUMENTO_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprdocumentotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PESSOA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjpessoa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ENTIDADE_EVENTO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidadeevento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_EVENTO_PARECER_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjreleventoparecer'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'HANDPAY_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjhandpay'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PROCESSO_AUTOEXCLUSAO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjprocessoautoexclusao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_INSTRUTOR_PECAS_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjrelinstrutorpeca'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PROCESSO_CASOSUSPEITO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'casosuspeito'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PAGAMENTO_CONTRATAPARTIDA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'contrapartidapagamentos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ORCALMENTO_DESPESA_ID'/*Name*/,36).references('ID').inTable(/*Table*/'orcalmentodespesa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'NOTIFICACAO_PROCESSO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'notificacao_processos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DECISAO_TRIBUNAL_PROCESSOS_ID'/*Name*/,36).references('ID').inTable(/*Table*/'decisao_tribunal_processos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DECISAO_TUTELAR_PROCESSOS_ID'/*Name*/,36).references('ID').inTable(/*Table*/'decisao_tutelar_processos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DESPACHO_INTERROMPIDO_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjdespachointerrompido'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PAGAMENTO_CABIMENTO'/*Name*/,36).references('ID').inTable(/*Table*/'cabimentacaos'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      
      

      table.string(/*Name*/'NUMERO'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'MAIN'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Number[T]
      table.string(/*Name*/'DOC_URL'/*Name*/,/*Size*/64000/*Size*/).notNullable() //data-schema  [T]Text[T]


      table.date(/*Name*/'DT_EMISSAO'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Date[T]
      table.date(/*Name*/'DT_VALIDADE'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Date[T]
      
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('sgigjreldocumento')
  }

}

module.exports = SgigjreldocumentoSchema