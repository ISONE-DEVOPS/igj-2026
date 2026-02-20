'use strict'

const Schema = use('Schema')

class SgigjrelpessoaentidadeSchema extends Schema {

  up () {
    this.create('sgigjrelpessoaentidade', (table) => {
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      table.string('CODIGO',/*Size*/5/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PESSOA_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjpessoa'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_CATEGORIA_PROFISSIONAL_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprcategoriaprofissional'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'PR_NIVEL_ESCOLARIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjprnivelescolaridade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.date(/*Name*/'DT_INICIO'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Date[T]
      table.date(/*Name*/'DT_FIM'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Date[T]      
      table.string(/*Name*/'OBS'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]      
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('sgigjrelpessoaentidade')
  }

}

module.exports = SgigjrelpessoaentidadeSchema