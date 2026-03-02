"use strict";

const controller = "Sgigjentidade";

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);

const functionsDatabase = require("../functionsDatabase");

class entity {

  toCsv(data, hasHeader = true) {
    if (data.length == 0) return ""
    const escapeCsvValue = (val) => {
      if (val === null || val === undefined) return ""
      const str = String(val)
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return '"' + str.replace(/"/g, '""') + '"'
      }
      return str
    }
    let header = hasHeader ? Object.keys(data[0]).map(escapeCsvValue).join(",") + "\r\n" : ""
    let body = ""
    data.forEach(element => {
      body += Object.values(element).map(escapeCsvValue).join(",") + "\r\n"
    });
    return "\uFEFF" + header + body
  }

  async exportCsv({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");
    if (allowedMethod) {
      var result = await Model.query()
        .with("sgigjprentidadetp")
        .with("glbgeografia")
        .where('ESTADO', 1)
        .orderBy("DT_REGISTO", "desc")
        .fetch();

      result = result.toJSON()
      let dataResult = result.map(element => ({
        "Código": element.CODIGO || "",
        "Designação": element.DESIG || "",
        "Tipo de Entidade": element.sgigjprentidadetp ? element.sgigjprentidadetp.PRENTIDADE : "",
        "NIF": element.NIF || "",
        "Localização": element.glbgeografia ? element.glbgeografia.DESIGNACAO : "",
        "Data Registo": element.DT_REGISTO ? element.DT_REGISTO.substring(0, 10) : "",
      }))

      let dataCsv = this.toCsv(dataResult)
      response.header('Content-type', 'text/csv')
      response.header('Content-Disposition', 'attachment; filename="entidades.csv"')
      return response.send(dataCsv)
    }
    return response.status(405).json({ status: "405Error", entity: table, message: "export not allowed", code: "4054" })
  }

  async store({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "create",
      request.userID,
      ""
    );

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);

      let data = request.only(extractRequest);

      data.ID = await functionsDatabase.createID(table);
      data.DT_REGISTO = functionsDatabase.createDateNow(table);
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes("CODIGO") === true)
        data.CODIGO = await functionsDatabase.createCODIGO(table);

      const validation = await functionsDatabase.validation(
        list,
        data,
        extractRequest,
        table
      );

      if (validation.status === "ok") {
        const newE = await Database.table(table).insert(data);

        if (newE[0] === 0) {
          return data;
        } else
          return response
            .status(400)
            .json({ status: "fail", entity: "", message: "", code: "" });
      } else return response.status(400).json(validation);
    } else
      return response
        .status(400)
        .json({
          status: "405Error",
          entity: table,
          message: "create not allwed",
          code: "4051",
        });
  }

  async update({ params, request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "update",
      request.userID,
      params.id
    );

    if (allowedMethod) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return {
          status: "erro",
          entity: table,
          message: "doesnt exist",
          code: 999,
        };
      else {
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, []);

        let data = request.only(extractRequest);
        const validation = await functionsDatabase.validation(
          list,
          data,
          extractRequest,
          table
        );

        if (validation.status === "ok") {
          const newE = await Database.table(table)
            .where("ID", "" + params.id)
            .userID(request.userID)
            .update(data);

          if (newE === 1) {
            return data;
          } else
            return response
              .status(400)
              .json({ status: "fail", entity: "", message: "", code: "" });
        } else return response.status(400).json(validation);
      }
    } else
      return response
        .status(405)
        .json({
          status: "405 error",
          entity: table,
          message: "update not allowed",
          code: "4052",
        });
  }

  async destroy({ params, response, request }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "delete",
      request.userID,
      params.id
    );

    if (allowedMethod) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return response
          .status(400)
          .json({
            status: "erro",
            entity: table,
            message: "doesnt exist",
            code: 999,
          });
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
          return {
            status: "ok",
            entity: table + "." + params.id,
            message: "deleted",
            code: "888",
          };
        } else
          return response
            .status(400)
            .json({ status: "fail", entity: "", message: "", code: "" });
      }
    } else
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "delete not allwed",
          code: "4053",
        });
  }

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);

      var result = await Model.query()
        .with("sgigjprentidadetp")
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with("glbgeografia")
        // .with("sgigjhandpay")
        .where(data)
        .where('ESTADO', 1)
        .orderBy("DT_REGISTO", "desc")
        .fetch();

      return result;
    } else
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "index not allwed",
          code: "4054",
        });
  }

  async show({ params, response, request }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "show",
      request.userID,
      params.id
    );

    if (allowedMethod) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return response
          .status(400)
          .json({
            status: "erro",
            entity: table,
            message: "doesnt exist",
            code: 999,
          });
      else {
        return await Model.query()
          .with("sgigjprentidadetp")
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with("glbgeografia")
          .with("sgigjentidademaquina.sgigjprmaquinatp")
          .with("sgigjentidadebanca.sgigjprbancatp")
          .with("sgigjentidadegrupo")
          .with("sgigjentidadeequipamento.sgigjprequipamentotp")
          .with("sgigjreldocumento.sgigjprdocumentotp")
          .with("sgigjrelcontacto.sgigjprcontactotp")
          // .with("sgigjhandpay")
          .with("sgigjrelpessoaentidade", (builder) => {
            builder
              .with("sgigjpessoa")
              .with("sgigjprcategoriaprofissional")
              .with("sgigjprnivelescolaridade")
              .with("sgigjrelpessoaentidadelingua", (builder) => {
                builder.with("sgigjprlingua").with("sgigjprnivellinguistico");
              });
          })
          .where("ID", "" + params.id)
          .fetch();
      }
    } else
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "show not allwed",
          code: "4056",
        });
  }
}

module.exports = entity;
