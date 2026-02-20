'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateAuditoriaSchema extends Schema {

  up () {
    this.create('create_auditorias', (table) => {
      table.string('ID', 36).primary()
      table.string(/*Name*/'User_ID'/*Name*/,36).references('ID').inTable(/*Table*/'glbuser'/*Table*/).onUpdate('CASCADE').onDelete('CASCADE') //key-schema
      table.string(/*Name*/'Accao'/*Name*/,250) //data-schema  [T]Text[T] 
      table.string(/*Name*/'Model'/*Name*/,250) //data-schema  [T]Text[T] 
      table.string(/*Name*/'Mode_ID'/*Name*/,250) //data-schema  [T]Text[T] 
      table.string(/*Name*/'Text_Accao'/*Name*/,250) //data-schema  [T]Text[T] 
      table.string(/*Name*/'Text_Modulo'/*Name*/,250) //data-schema  [T]Text[T] 
      table.string(/*Name*/'Text_Detalhe'/*Name*/,500) //data-schema  [T]Text[T] 
      table.json(/*Name*/'Original'/*Name*/,500) //data-schema  [T]Text[T] 
      table.json(/*Name*/'Alterado'/*Name*/,500) //data-schema  [T]Text[T] 
      table.timestamp('Created_At').notNullable()
    })
  }

  down () {
    this.drop('create_auditorias')
  }
}

module.exports = CreateAuditoriaSchema
