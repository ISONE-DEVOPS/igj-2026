'use strict'

const Schema = use('Schema')

class SgigjreleventoparecerSchema extends Schema {
  up () {
    this.create('sgigjreleventoparecer', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string(/*Name*/'REL_EVENTO_DESPACHO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjreleventodespacho'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_PARECER_TP_ID'/*Name*/,36).references('ID').inTable(/*Table*/'parecerparametrizacao'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PARECER'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.datetime(/*Name*/'DT_ATRIBUICAO'/*Name*/).notNullable() //data-schema  [T]Date[T]
      table.date(/*Name*/'DATA'/*Name*/) //data-schema  [T]Date[T]
      table.string(/*Name*/'STATUS'/*Name*/,/*Size*/15/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjreleventoparecer')
  }
}

module.exports = SgigjreleventoparecerSchema
