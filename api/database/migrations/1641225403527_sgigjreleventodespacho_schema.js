'use strict'

const Schema = use('Schema')

class SgigjreleventodespachoSchema extends Schema {
  up () {
    this.create('sgigjreleventodespacho', (table) => {
     
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string(/*Name*/'SELF_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'ENTIDADE_EVENTO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjentidadeevento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_DECISAO_TP_ID'/*Name*/,36).references('ID').inTable(/*Table*/'sgigjprdecisaotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema

      table.string(/*Name*/'REFERENCIA'/*Name*/,/*Size*/25/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'DESPACHO'/*Name*/,/*Size*/4199999999/*Size*/) //data-schema  [T]Text[T]
      table.date(/*Name*/'DATA'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.string(/*Name*/'URL_DOC_GERADO'/*Name*/,/*Size*/128/*Size*/) //data-schema  [T]Text[T]  
      
      table.string(/*Njame*/'STATUS'/*Name*/,/*Size*/15/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjreleventodespacho')
  }
}

module.exports = SgigjreleventodespachoSchema
