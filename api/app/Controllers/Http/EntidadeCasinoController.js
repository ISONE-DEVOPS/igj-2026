"use strict";

const controller = "Sgigjentidade";

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
        .where('ESTADO', 1)
        .orderBy("DT_REGISTO", "desc")
        .fetch();

      result = result.toJSON()
      let dataResult = result.map(element => ({
        "Código": element.CODIGO || "",
        "Designação": element.DESIG || "",
        "Tipo de Entidade": element.sgigjprentidadetp ? element.sgigjprentidadetp.PRENTIDADE : "",
        "NIF": element.NIF || "",
        "Data Registo": element.DT_REGISTO ? element.DT_REGISTO.substring(0, 10) : "",
      }))

      let dataCsv = this.toCsv(dataResult)
      response.header('Content-type', 'text/csv')
      response.header('Content-Disposition', 'attachment; filename="casinos.csv"')
      return response.send(dataCsv)
    }
    return response.status(405).json({ status: "405Error", entity: table, message: "export not allowed", code: "4054" })
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
        .where(data)
        .where('ESTADO', 1)
        // .where('DESIG', 'casino')
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
}

module.exports = entity;
