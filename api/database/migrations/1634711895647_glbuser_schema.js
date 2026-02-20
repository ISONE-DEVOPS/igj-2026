'use strict'

const Schema = use('Schema')

class GlbuserSchema extends Schema {

  up () {
    this.create('glbuser', (table) => {
      table.string('ID',36).primary()
      table.string(/*Name*/'PERFIL_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'glbperfil'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'REL_PESSOA_ENTIDADE_ID'/*Name*/,36).notNullable().references('ID').inTable(/*Table*/'sgigjrelpessoaentidade'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string('CODIGO',/*Size*/10/*Size*/).notNullable() //CODIGO-schema
      table.string(/*Name*/'USERNAME'/*Name*/,/*Size*/64/*Size*/).notNullable() //data-schema  [T]Text[T] 
      table.string(/*Name*/'ASSINATURA_URL'/*Name*/,/*Size*/64000/*Size*/) //data-schema  [T]Text[T] 
      table.string(/*Name*/'PASSWORD'/*Name*/,/*Size*/64/*Size*/).notNullable() //data-schema  [T]Text[T] 
      table.date(/*Name*/'PASSWORD_DT_ALTERACAO'/*Name*/,/*Size*/256/*Size*/) //data-schema  [T]Date[T]      
      table.date(/*Name*/'ULTIMO_LOGIN'/*Name*/,/*Size*/256/*Size*/).notNullable() //data-schema  [T]Date[T]
      table.string(/*Name*/'URL_FOTO'/*Name*/,/*Size*/64000/*Size*/).notNullable() //data-schema  [T]Text[T]       
      table.timestamp('DT_REGISTO').notNullable()      
      table.string(/*Name*/'FLAG_NOTIFICACAO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'ESTADO'/*Name*/,/*Size*/1/*Size*/) //data-schema  [T]Text[T]
      table.string(/*Name*/'CRIADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'DELETADO_POR'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.timestamp('DELETADO_EM')
    })
  }

  down () {
    this.drop('glbuser')
  }

}

module.exports = GlbuserSchema
