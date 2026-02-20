'use strict'

const controller = "Sgigjrelenteventodecisao";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');


class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, ["REL_PESSOA_ENTIDADE_ID"])

      let data = request.only(extractRequest)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);



      if (validation.status === 'ok') {

        data.REL_PESSOA_ENTIDADE_ID = request.userID


        const newE = await Database
          .table(table)
          .insert(data)



        if (newE[0] === 0) {
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      } else return response.status(400).json(validation)


    }

    else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

  }

}

module.exports = entity
