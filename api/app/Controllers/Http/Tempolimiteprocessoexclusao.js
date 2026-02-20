"use strict";

const controller = "Sgigjprocessoexclusao";

const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);

const functionsDatabase = require("../functionsDatabase");

const moment = require("moment-timezone");
const Env = use("Env");

class entity {
  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    //if(allowedMethod){

    let dataagora = moment()
      .tz(Env.get("GMT", ""))

    if(!dataagora){
     return
    }

    dataagora = dataagora.subtract(10, "days")
    .format("YYYY-MM-DD");

    const prazolimite = await Model.query()
    .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
      .whereHas("sgigjprocessodespacho", (builder) => {
        builder.where("DATA", ">", dataagora);
      })
      .whereHas(
        "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao",
        (builder) => {
          builder.whereNull("RELATORIO_FINAL");
        }
      )
      .where('ESTADO', 1)
      .with("sgigjprocessodespacho")
      .with("sgigjpessoa")
      .orderBy("DT_REGISTO", "desc")
      .fetch();

    const prazovisado = await Model.query()
    .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
      .whereHas(
        "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao.sgigjrelinstrutorpeca",
        (builder) => {
          builder
            .where("DT_REGISTO", ">", dataagora)
            .where(
              "PR_PECAS_PROCESSUAIS_ID",
              "=",
              Env.get("PECAPROCESSUAL_RECLAMACAOVISADO_ID", "")
            );
        }
      )
      .whereHas(
        "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao",
        (builder) => {
          builder.whereNull("RELATORIO_FINAL");
        }
      )
      .with(
        "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao.sgigjrelinstrutorpeca"
      )
      .where('ESTADO', 1)
      .with("sgigjpessoa")
      .orderBy("DT_REGISTO", "desc")
      .fetch();

    return {
      prazolimite,
      prazovisado,
    };

    //}

    //else return response.status(403).json({status:"403Error",entity:table,message:"index not allwed",code:"4054"})
  }
}

module.exports = entity;
