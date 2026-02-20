"use strict";

const controller = "Sgigjprocessoexclusao";

const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);

const functionsDatabase = require("../functionsDatabase");
const GlbnotificacaoFunctions = require('./GlbnotificacaoFunctions');

const moment = require("moment-timezone");
const Env = use("Env");
const DatabaseDB = use("Database");

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

    // Enviar notificações para processos com prazo a expirar
    const prazolimiteJSON = prazolimite.toJSON();
    const hoje = moment().tz(Env.get("GMT", ""));

    for (const processo of prazolimiteJSON) {
      if (processo.sgigjprocessodespacho && processo.sgigjprocessodespacho.length > 0) {
        const despacho = processo.sgigjprocessodespacho[0];
        if (despacho.DATA && despacho.PRAZO) {
          const dataDespacho = moment(despacho.DATA);
          const prazoFim = dataDespacho.clone().add(despacho.PRAZO, "days");
          const diasRestantes = prazoFim.diff(hoje, "days");

          if (diasRestantes >= 0 && diasRestantes <= 10) {
            // Verificar se já foi enviada notificação hoje para este processo
            const hojeStr = hoje.format("YYYY-MM-DD");
            const jaNotificado = await DatabaseDB
              .table("glbnotificacao")
              .where("URL", "/processos/exclusaointerdicao")
              .where("TITULO", "Prazo do Processo")
              .whereRaw("MSG LIKE ?", [`%${processo.CODIGO}%`])
              .whereRaw("DATE(DT_REGISTO) = ?", [hojeStr])
              .limit(1);

            if (jaNotificado.length === 0) {
              const msg = `O processo (Código: ${processo.CODIGO}) tem ${diasRestantes} dia(s) restante(s) para conclusão.`;

              GlbnotificacaoFunctions.storeToPerfil({
                request,
                PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
                MSG: msg,
                TITULO: "Prazo do Processo",
                PESSOA_ID: null,
                URL: "/processos/exclusaointerdicao"
              });

              GlbnotificacaoFunctions.storeToPerfil({
                request,
                PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
                MSG: msg,
                TITULO: "Prazo do Processo",
                PESSOA_ID: null,
                URL: "/processos/exclusaointerdicao"
              });
            }
          }
        }
      }
    }

    return {
      prazolimite,
      prazovisado,
    };

    //}

    //else return response.status(403).json({status:"403Error",entity:table,message:"index not allwed",code:"4054"})
  }
}

module.exports = entity;
