'use strict'

const Schema = use('Schema')

class SgigjpessoaSchema extends Schema {

  up () {
    this.create('sgigjpessoa', (table) => {


      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()

      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema

      table.string(/*Name*/'NACIONALIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'glbgeografia'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'LOCALIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'glbgeografia'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_ESTADO_CIVIL_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprestadocivil'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_GENERO_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprgenero'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      
      table.string(/*Name*/'NOME'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Text[T]
      table.string(/*Name*/'DOC_IDENTIFICACAO'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NUMERO'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Text[T]
      
      table.date(/*Name*/'DT_NASC'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Date[T]
      table.string(/*Name*/'NIF'/*Name*/,/*Size*/9/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ALCUNHA'/*Name*/,/*Size*/75/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NOME_PAI'/*Name*/,/*Size*/128/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'NOME_MAE'/*Name*/,/*Size*/128/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ENDERECO'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ENDERECO_COORD'/*Name*/,/*Size*/50/*Size*/) //data-schema  [T]Text[T]
      
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')

    })
  }

  down () {
    this.drop('sgigjpessoa')
  }

}

module.exports = SgigjpessoaSchema