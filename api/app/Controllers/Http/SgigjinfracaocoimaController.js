'use strict'

const controller = "Sgigjinfracaocoima";



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
      const extractRequest = functionsDatabase.extractRequest(list, [])

      let data = request.only(extractRequest)

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);

      if (validation.status === 'ok') {
        const coima = await Database
          .table('sgigjinfracaocoima')
          .where('PR_INFRACAO_TP_ID', data.PR_INFRACAO_TP_ID)
          .andWhere('ESTADO', '<>', '0')
          .first()
        const startDate = new Date(data.DT_INICIO)
        const endDate = new Date(data.DT_FIM)

        if (parseInt(data.VALOR_MINIMO) > parseInt(data.VALOR_MAXIMO)) {
          return response
            .status(400)
            .json({
              status: "fail",
              entity: "",
              message: "O valor inserido no campo valor máximo tem que ser superior ao do campo valor mínimo",
              code: "564564",
            });
        }
        if (data.DT_FIM) {
          if (startDate > endDate) {
            return response
              .status(400)
              .json({
                status: "fail",
                entity: "",
                message: "Data de término não pode ser menor que a data de início",
                code: "564564",
              });
          }
        }
        if (coima) {
          if (coima.DT_FIM) {
            const endDateOlder = new Date(coima.DT_FIM);
            const startDateNewer = new Date(data.DT_INICIO);
            if (startDateNewer < endDateOlder) {
              return response.status(400).json({ status: "fail", entity: "", message: "Já existe uma infracão nesse intervalo de data", code: "" })
            }
          } else {
            return response.status(400).json({ status: "fail", entity: "", message: "Já existe esta infracão válida e sem data de término definido. Por favor, atualize a data de término antes de novo registo.", code: "" })
          }
        }
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











  async update({ params, request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "update", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {

        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, [])

        let data = request.only(extractRequest)
        const coimaObj = await Model.findBy('ID', params.id)
        data.ESTADO = coimaObj.ESTADO

        const validation = await functionsDatabase.validation(list, data, extractRequest, table);


        if (validation.status === 'ok') {

          const coima = await Database
            .table('sgigjinfracaocoima')
            .where('PR_INFRACAO_TP_ID', data.PR_INFRACAO_TP_ID)
            .first()
          const startDate = new Date(data.DT_INICIO)
          const endDate = new Date(data.DT_FIM)
          if (parseInt(data.VALOR_MINIMO) > parseInt(data.VALOR_MAXIMO)) {
            return response
              .status(400)
              .json({
                status: "fail",
                entity: "",
                message: "O valor inserido no campo valor máximo tem que ser superior ao do campo valor mínimo",
                code: "564564",
              });
          }
          if (data.DT_FIM) {
            if (startDate > endDate) {
              return response
                .status(400)
                .json({
                  status: "fail",
                  entity: "",
                  message: "Data de término não pode ser menor que data de início",
                  code: "564564",
                });
            }
          }
          // if (coima) {
          //   if (coima.DT_FIM) {
          //     const endDateOlder = new Date(coima.DT_FIM);
          //     const startDateNewer = new Date(data.DT_INICIO);
          //     if (startDateNewer < endDateOlder) {
          //       return response.status(400).json({ status: "fail", entity: "", message: "Já existe uma infracão nesse intervalo de data", code: "" })
          //     }
          //   } else {
          //     return response.status(400).json({ status: "fail", entity: "", message: "Já existe uma infracão sem data de término definido. Por favor atualize a data de término.", code: "" })
          //   }
          // }

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

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })

  }









  async destroy({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "delete", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {
        const newE = await Database.table(table).userID(request.userID).update({ 'ESTADO': '0', "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table) }).where('id', params.id)
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
        .with('sgigjprinfracaotp')
        .where(function () {
          this.where(data)
          this.andWhere('ESTADO', '<>', '0')
        })
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
          .with('sgigjprinfracaotp')
          .where('ID', '' + params.id)
          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }

}

module.exports = entity
