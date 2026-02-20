'use strict'

const controller = "Glbuser";

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');

const bcrypt = require('bcryptjs');

class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, ['ULTIMO_LOGIN'])

      let data = request.only(extractRequest)

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);



      if (validation.status === 'ok') {

        data.PASSWORD = await bcrypt.hash(data.PASSWORD, 10)

        data.ULTIMO_LOGIN = await functionsDatabase.createDateNow(table)

        const newE = await Database
          .table(table)
          .insert(data)




        if (newE[0] === 0) {
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      } else return response.status(400).json(validation)


    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "create not allwed", code: "4051" })

  }

  async update({ params, request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "update", request.userID, params.id);
    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, ['PASSWORD', 'ULTIMO_LOGIN', 'ESTADO'])

        let data = request.only(extractRequest)
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);


        if (validation.status === 'ok') {


          if (Object.keys(request.only('ESTADO')).length != 0) {

            data.ESTADO = request.only('ESTADO').ESTADO

          }
          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)


          if (newE === 1) {
            return (data)
          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

        } else return response.status(400).json(validation)
      }
    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allwed", code: "4052" })

  }

  async destroy({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "delete", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        const newE = await Database
          .table(table)
          .where('ID', '' + params.id)
          .userID(request.userID)
          .update({
            "ESTADO": 0,
            "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table)
          })


        if (newE === 1) {
          return { status: "ok", entity: table + "." + params.id, message: "deleted", code: "888" }
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "delete not allwed", code: "4053" })

  }

  async index({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model
        .query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('glbperfil')
        .where(data)
        .where('ESTADO', '<>', '0')
        .orderBy('DT_REGISTO', 'desc')
        .fetch()



      return result

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })


  }

  async show({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "show", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        return await Model
          .query()
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .with('glbperfil')
          .where('ID', '' + params.id)
          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4053" })

  }

  async changePassword({ request, response }) {
    let PASSWORD = request.all().PASSWORD

    if (!PASSWORD || PASSWORD.trim() === '') {
      return response.status(400).json({ status: "erro", entity: table, message: "PASSWORD is required", code: "4060" })
    }

    let data = {}
    data.PASSWORD_DT_ALTERACAO = functionsDatabase.createDateNow(table)
    data.PASSWORD = await bcrypt.hash(PASSWORD, 10)
    const newE = await Database
      .table(table)
      .where('ID', '' + request.userID)
      .userID(request.userID)
      .update(data)

    if (newE === 1) {
      return ({ status: "done" })
    }
    else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
  }

  async updateOwn({ request, response }) {

      const element = await functionsDatabase.existelement(table, request.userID)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {
        // Campos que o utilizador pode alterar sobre si próprio (apenas foto e dados básicos)
        const allowedFields = ['URL_FOTO']
        let data = request.only(allowedFields)

        if (Object.keys(data).length === 0) {
          return response.status(400).json({ status: "erro", entity: table, message: "no valid fields to update", code: "4060" })
        }

        const newE = await Database
          .table(table)
          .where('ID', '' + request.userID)
          .userID(request.userID)
          .update(data)


        if (newE === 1) {
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
      }

  }
}

module.exports = entity
