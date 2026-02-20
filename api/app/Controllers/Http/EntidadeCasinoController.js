"use strict";

const controller = "Sgigjentidade";

const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);

const functionsDatabase = require("../functionsDatabase");

class entity {
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
