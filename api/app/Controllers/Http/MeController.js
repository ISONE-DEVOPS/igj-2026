'use strict'

const controller = "Glbuser";

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);


const functionsDatabase = require('../functionsDatabase');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../../../config/jwt')


const crypt = require('crypto');
const bcrypt = require('bcryptjs');


class entity {










  async update({ request, response }) {




    const authHeadear = request.request.headers.authorization;


    if (!authHeadear) {
      return response.status(401).json({ status: "401Error", message: "unauthorized" });
    }

    const [, token] = authHeadear.split(' ');

    try {


      const decoded = await promisify(jwt.verify)(token, authConfig.secret);



      //----------------------------------


      const lastelement = await Database
        .table("glbuser")
        .where('ID', decoded.id)
        .limit(1)


      if (lastelement.length >= 1) {

        if (lastelement[0].ESTADO == 0) return response.status(401).json({ status: "401Error", message: "unauthorized" });

      } else { return response.status(401).json({ status: "401Error", message: "unauthorized" }); }



      const tipo = request.only(['TIPO'])


      if (tipo.TIPO == "password") {

        const pass = request.only(['PASSWORD'])

        if (Object.keys(pass).length == 0) return response.status(400).json({ status: "400Error", entity: "user", message: "PASSWORD required", code: "6051" })

        // Buscar utilizador para verificar password actual
        const lastelementX = await Database
          .table("glbuser")
          .where({ ID: decoded.id })
          .limit(1)

        if (lastelementX.length < 1) return response.status(400).json({ status: "400Error", entity: "user", message: "user not found", code: "6056" })

        // Verificar password actual (suporta SHA1 legado e bcrypt)
        const storedPassword = lastelementX[0].PASSWORD
        let passwordValid = false

        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
          passwordValid = await bcrypt.compare(pass.PASSWORD, storedPassword)
        } else {
          const sha1Hash = crypt.createHash('sha1').update(pass.PASSWORD).digest('hex')
          passwordValid = (sha1Hash === storedPassword)
        }

        if (passwordValid) {

          const newpass = request.only(['NEWPASSWORD'])

          if (Object.keys(newpass).length == 0) return response.status(400).json({ status: "400Error", entity: "user", message: "NEWPASSWORD required", code: "6054" })

          if (newpass.NEWPASSWORD == "" || newpass.NEWPASSWORD == null) return response.status(400).json({ status: "400Error", entity: "user", message: "NEWPASSWORD cannot be null or empty", code: "6051" })

          const NEWPASSWORD = await bcrypt.hash(newpass.NEWPASSWORD, 10)

          const newE = await Database
            .table(table)
            .where('ID', '' + decoded.id)
            .update({ PASSWORD: NEWPASSWORD, PASSWORD_DT_ALTERACAO: functionsDatabase.createDateNow(table) })


          if (newE === 1) return ({ status: "done" })
          else return ({ status: "405Error", entity: "user", message: "fail", code: "6039" })

        } else return response.status(400).json({ status: "400Error", entity: "user", message: "incorrect password", code: "6056" })

      }




      if (tipo.TIPO == "dados") {


        let data = request.only(['ENDERECO', 'NOME'])

        const pessoaentidade = await Model
          .query()
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .where('ID', '' + decoded.id)
          .fetch()

        const newE = await Database
          .table("sgigjpessoa")
          .where('ID', '' + pessoaentidade.rows[0].$relations.sgigjrelpessoaentidade.$attributes.ID)
          .userID(request.userID)
                       .update(data)

        if (newE === 1) return ({ status: "done" })
        else return ({ status: "405Error", entity: "user", message: "fail", code: "6039" })



      }


      if (tipo.TIPO == "contacto") {

        const ENDERECO = request.only(['DADOS'])?.DADOS

        if (ENDERECO.length > 0) {

          for (let i = 0; i < ENDERECO.length; i++) {

            const newE = await Database
              .table("sgigjrelcontacto")
              .where({
                ID: '' + ENDERECO[i].idContact,
                PESSOA_ID: '' + decoded.id,
              })
              .update('CONTACTO', '' + ENDERECO[i].value)

          }

          return ({ status: "done" })


        }

      }





      if (tipo.TIPO == "foto") {

        const foto = request.only(['DADOS'])?.DADOS


        const newE = await Database
          .table(table)
          .where({
            ID: '' + decoded.id,
          })
          .update('URL_FOTO', '' + foto)



        if (newE === 1) return ({ status: "done" })





      }








    } catch (err) {
      return response.status(401).json({ status: "401Error", message: "invalid or expired token" });
    }



  }
















  async show({ request, response }) {




    const authHeadear = request.request.headers.authorization;


    if (!authHeadear) {
      return response.status(401).json({ status: "401Error", message: "unauthorized" });
    }

    const [, token] = authHeadear.split(' ');
    

    try {

      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      const element = await functionsDatabase.existelement(table, decoded.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {


        const lastelement = await Database
          .table("glbuser")
          .where('ID', decoded.id)
          .limit(1)


        if (lastelement.length >= 1) {

          if (lastelement[0].ESTADO == 0) return response.status(401).json({ status: "401Error", message: "unauthorized" });

        } else { return response.status(401).json({ status: "401Error", message: "unauthorized" }); }




        return await Model
          .query()
          .with('sgigjrelpessoaentidade.sgigjentidade.sgigjprentidadetp')
          .with('sgigjrelpessoaentidade.sgigjpessoa', (builder) => {
            builder.with('sgigjprgenero').with('sgigjrelcontacto.sgigjprcontactotp')
          })
          .with('glbperfil', (builder) => {
            builder.with('glbmenu', (builder) => {
              builder.with('glbmenu_self').orderBy('ORDEM', 'asc')
            })
          })
          .where('ID', '' + decoded.id)
          .fetch()


      }




    } catch (err) {
      return response.status(401).json({ status: "401Error", message: "invalid or expired token" });
    }







  }















  /*
  
   
    async store ({ request, response }) {
  
      const allowedMethod = await functionsDatabase.allowed(table,"create",request.userID,"");
  
      if(allowedMethod){
  
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list,[])
        
        let data = request.only(extractRequest) 
  data.ESTADO = "1"
  data.CRIADO_POR = request.userID
  
        data.ID = await functionsDatabase.createID(table)
        data.DT_REGISTO = functionsDatabase.createDateNow(table)
        
        if(list.other.includes('CODIGO')===true) data.CODIGO = await functionsDatabase.createCODIGO(table)
        
        const validation = await functionsDatabase.validation(list,data,extractRequest,table);
  
  
  
        if (validation.status==='ok') {
  
          data.PASSWORD = await Hash.make(data.PASSWORD)
         
          const newE = await Database
          .table(table)
          .insert(data)
  
  
      
        
          if(newE[0]===0){
            return (data)
          } 
  
          else return {status:"fail",entity:"",message:"",code:""}
      
        } else return validation
  
        
      }
  
      else return response.status(403).json({status:"403Error",entity:table,message:"create not allwed",code:"4051"})
  
    }
  
    
  
  */










}

module.exports = entity
