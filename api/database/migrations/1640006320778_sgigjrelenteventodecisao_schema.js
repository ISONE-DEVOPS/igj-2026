'use strict'

const Schema = use('Schema')

class SgigjrelenteventodecisaoSchema extends Schema {
  up () {
    this.create('sgigjrelenteventodecisao', (table) => {
      
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      
      table.string(/*Name*/'ENTIDADE_EVENTO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjentidadeevento'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_DECISAO_TP_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprdecisaotp'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema

      table.date(/*Name*/'DATA'/*Name*/).notNullable() //data-schema  [T]Date[T]
      
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('sgigjrelenteventodecisao')
  }
}

module.exports = SgigjrelenteventodecisaoSchema
