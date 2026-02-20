'use strict'

const Schema = use('Schema')

class SgigjprgeneroSchema extends Schema {

  up () {
    this.create('sgigjprgenero', (table) => {


      //--+--
      table.string('ID',36).primary()
      table.timestamp('DT_REGISTO').notNullable()
      
      table.string('CODIGO',5).notNullable()

      table.string('DESIG',128).notNullable() //data
      table.string('OBS',64000).notNullable() //data
      //--+--
      

    })
  }

  down () {
    this.drop('sgigjprgenero')
  }

}

module.exports = SgigjprgeneroSchema