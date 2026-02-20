'use strict'

const controller = "Glbperfilmenu";



let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
let DatabaseDB = use("Database")


const functionsDatabase = require('../functionsDatabase');








class entity {






  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed("glbperfilmenus", "atribuir", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])

      let data = request.only(extractRequest)

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);



      if (validation.status === 'ok') {

        /*const lastelementx = await Database
        .table("glbperfilmenu")
        .where('ID', '0a15f964ffbd40893da52916e76e425d6724',)
        .limit(1)
        */




        const newE = await Database
          .table(table)
          .insert(data)



        if (newE[0] === 0) {
          return (data)
        }

        else return response.status(405).json({ status: "fail", entity: "", message: "", code: "" })

      } else return response.status(405).json(validation)


    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "create not allwed", code: "4051" })

  }











  async update({ params, request, response }) {

    const allowedMethod = await functionsDatabase.allowed("glbperfilmenus", "atribuir", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {




        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, [])

        let data = request.only(extractRequest)
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);



        if (validation.status === 'ok') {

          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)


          if (newE === 1) {
            return (data)
          }

          else return response.status(405).json({ status: "fail", entity: "", message: "", code: "" })

        } else return response.status(405).json(validation)


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allwed", code: "4052" })

  }









  async destroy({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed("glbperfilmenus", "atribuir", request.userID, params.id);

    if (allowedMethod) {

      // Aceitar apenas os campos válidos da tabela para o where
      const { PERFIL_ID, MENUS_ID } = request.only(['PERFIL_ID', 'MENUS_ID'])

      if (!PERFIL_ID || !MENUS_ID) {
        return response.status(400).json({ status: "erro", entity: table, message: "PERFIL_ID and MENUS_ID are required", code: "4060" })
      }

      const newE = await DatabaseDB
                .table(table)
                .where({ PERFIL_ID, MENUS_ID })
                .delete()

      if (newE >= 1) {
        return { status: "ok", entity: table + "." + params.id, message: "deleted", code: "888" }
      }

      else return response.status(400).json({ status: "fail", entity: table, message: "record not found", code: "4061" })

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "delete not allowed", code: "4053" })

  }














  async index({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed("glbperfilmenus", "atribuir", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').where(data).where('ESTADO', 1).fetch()


      return result

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })


  }









  async show({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed("glbperfilmenus", "atribuir", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {

        return await Model
          .query()
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .where('ID', '' + params.id)
          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4053" })

  }

}

module.exports = entity
