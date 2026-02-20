'use strict'



const controller = "Glbpredefinicao";



let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/'+controller);


const functionsDatabase = require('../functionsDatabase');



const Glbuser = use('App/Models/Glbuser');




class GlbpredefinicaoController {


  async update ({ params, request, response }) {


    let allowed = false
    const iduser  = request.userID

    const user = await Glbuser 
    .query()
    .with('glbperfil',(builder) => {
      builder.with('glbmenu')
    })
    .where('ID', ''+iduser )
    .fetch()

    if(user?.rows?.length>0) {

        if(user.rows[0].$relations.glbperfil.$relations.glbmenu.rows.length>0) {

            const newmenu = user.rows[0].$relations.glbperfil.$relations.glbmenu.rows

            for (let index = 0; index < newmenu.length; index++) {


                
                const element = newmenu[index].$attributes;

                if( element.URL == "/configuracao/predefinicoes/tempolimitedecisao" ) allowed = true
                
            }

        }

    }










    if(allowed){



        if(params.id=="dialimitefinalizacao")  {
          console.log()
          console.log(params.id)
          console.log(request.only(['DIA']).DIA)


          if(request.only(['DIA']).DIA!=null&&request.only(['DIA']).DIA!="")

            if(!isNaN(request.only(['DIA']).DIA)){

              try {
              const newE = await Database
              .table("Glbpredefinicao")
              .where('NOME', ''+params.id)
              .update({
                DADOS:request.only(['DIA']).DIA
              })



              if(newE===1){
                return (request.only(['DIA']))
              }

              else return  response.status(400).json({status:"fail",entity:"",message:"",code:""})

            } catch(e){
              console.log(e)
            }



            }   else return  response.status(400).json({status:"fail",entity:"DIA is not a number",message:"",code:"4565675"})


          else response.status(400).json({status:"fail",entity:"DIA can not be null",message:"",code:"4565675"})



        }

    }


  }




  async index ({ request, response }) {


    let allowed = false
    const iduser  = request.userID

    const user = await Glbuser 
    .query()
    .with('glbperfil',(builder) => {
      builder.with('glbmenu')
    })
    .where('ID', ''+iduser )
    .where('ESTADO', 1)
    .fetch()

    if(user?.rows?.length>0) {

        if(user.rows[0].$relations.glbperfil.$relations.glbmenu.rows.length>0) {

            const newmenu = user.rows[0].$relations.glbperfil.$relations.glbmenu.rows

            for (let index = 0; index < newmenu.length; index++) {


                
                const element = newmenu[index].$attributes;

                if( element.URL == "/configuracao/predefinicoes/tempolimitedecisao" ) allowed = true
                
            }

        }

    }










    if(allowed){

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list,[])
      const data = functionsDatabase.indexconfig(request,extractRequest,['DT_REGISTO'])

      var result = await Model
        .query()
        .where(data)
        .orderBy('DT_REGISTO','desc')
        .fetch()


      return result

    }

    else return response.status(403).json({status:"403Error",entity:table,message:"index not allwed",code:"4054"})


  }









  async show ({ params, response, request }) {


    let allowed = false
    const iduser  = request.userID

    const user = await Glbuser 
    .query()
    .with('glbperfil',(builder) => {
      builder.with('glbmenu')
    })
    .where('ID', ''+iduser )
    .fetch()

    if(user?.rows?.length>0) {

        if(user.rows[0].$relations.glbperfil.$relations.glbmenu.rows.length>0) {

            const newmenu = user.rows[0].$relations.glbperfil.$relations.glbmenu.rows

            for (let index = 0; index < newmenu.length; index++) {


                
                const element = newmenu[index].$attributes;

                if( element.URL == "/configuracao/predefinicoes/tempolimitedecisao" ) allowed = true
                
            }

        }

    }










    if(allowed){

        return await Model
          .query()
          .where('NOME', ''+params.id)
          .fetch()
        
    

    }

    else return response.status(403).json({status:"403Error",entity:table,message:"show not allwed",code:"4056"})

  }


}

module.exports = GlbpredefinicaoController
