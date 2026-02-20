'use strict'

const controller = "Glbuser";

const Hash = use('Hash')

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/'+controller);


const functionsDatabase = require('../functionsDatabase');








class entity {







    
  async index ({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed(table,"index",request.userID,"");

    if(allowedMethod){

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list,[])
      const data = functionsDatabase.indexconfig(request,extractRequest,['DT_REGISTO'])

      console.log(" request.connectedsocket")
      console.log( request.connectedsocket)

      let newarray = Object.entries(request.connectedsocket)

      let userconnected = []

      for (let index = 0; index < newarray.length; index++) {

        userconnected.push(newarray[index][0])
        
      }





      var result = await Model
          .query()
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .where('ESTADO', 1)
          .fetch()

        console.log(result.rows.length)




        for (let index = 0; index < result.rows.length; index++) {

          if(userconnected.includes(result.rows[index].$attributes.ID)==false) {

            result.rows[index].newstatus=true

          } else  result.rows[index].newstatus=false
          
        }


        var result = result.rows.filter(function (el) {
          return el.newstatus != true;
        });
  
            

      return  result

    }

    else return response.status(403).json({status:"403Error",entity:table,message:"index not allwed",code:"4054"})


  }





}

module.exports = entity
