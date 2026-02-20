'use strict'

const controller = "Sgigjprgenero";



let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();

const crpyto = require('../../../functions/crpyto');
const functionsDatabase = require('../functionsDatabase');







class entity {

  
  async index ({ request, response }) {


  }



 
  async store ({ request, response }) {
   
    const ID = await functionsDatabase.createID(table)

    const userId = await Database
      .table(table)
      .insert({
        ID: ID,
        CODIGO: '5',
        DESIG: '123',
        OBS: '456',
      })
  
    return(userId)

}

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = entity
