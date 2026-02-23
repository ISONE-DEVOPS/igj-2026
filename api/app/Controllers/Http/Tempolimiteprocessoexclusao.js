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

    // Query para contra-ordenações com prazo
    const prazocontraordenacao = await Model.query()
    .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
      .where('TIPO', 'C')
      .where('ESTADO', 1)
      .whereHas("sgigjprocessodespacho", (builder) => {
        builder.where("DATA", ">", dataagora);
      })
      .whereHas(
        "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao",
        (builder) => {
          builder.whereNull("RELATORIO_FINAL");
        }
      )
      .with("sgigjprocessodespacho")
      .with("sgigjpessoa")
      .orderBy("DT_REGISTO", "desc")
      .fetch();

    // Enviar notificações para processos com prazo a expirar
    const hoje = moment().tz(Env.get("GMT", ""));
    const hojeStr = hoje.format("YYYY-MM-DD");

    // Função auxiliar para enviar notificações de prazo
    async function enviarNotificacaoPrazo(processo, url, titulo) {
      if (processo.sgigjprocessodespacho && processo.sgigjprocessodespacho.length > 0) {
        const despacho = processo.sgigjprocessodespacho[0];
        if (despacho.DATA && despacho.PRAZO) {
          const dataDespacho = moment(despacho.DATA);
          const prazoFim = dataDespacho.clone().add(despacho.PRAZO, "days");
          const diasRestantes = prazoFim.diff(hoje, "days");

          if (diasRestantes >= 0 && diasRestantes <= 10) {
            const jaNotificado = await DatabaseDB
              .table("glbnotificacao")
              .where("URL", url)
              .where("TITULO", titulo)
              .whereRaw("MSG LIKE ?", [`%${processo.CODIGO}%`])
              .whereRaw("DATE(DT_REGISTO) = ?", [hojeStr])
              .limit(1);

            if (jaNotificado.length === 0) {
              const msg = `O processo (Código: ${processo.CODIGO}) tem ${diasRestantes} dia(s) restante(s) para conclusão.`;

              GlbnotificacaoFunctions.storeToPerfil({
                request,
                PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
                MSG: msg,
                TITULO: titulo,
                PESSOA_ID: null,
                URL: url
              });

              GlbnotificacaoFunctions.storeToPerfil({
                request,
                PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
                MSG: msg,
                TITULO: titulo,
                PESSOA_ID: null,
                URL: url
              });
            }
          }
        }
      }
    }

    // Notificações para exclusão interdição
    const prazolimiteJSON = prazolimite.toJSON();
    for (const processo of prazolimiteJSON) {
      await enviarNotificacaoPrazo(processo, "/processos/exclusaointerdicao", "Prazo do Processo");
    }

    // Notificações para contra-ordenação
    const prazocontraordenacaoJSON = prazocontraordenacao.toJSON();
    for (const processo of prazocontraordenacaoJSON) {
      await enviarNotificacaoPrazo(processo, "/processos/contraordenacao", "Prazo da Contra-Ordenação");
    }

    return {
      prazolimite,
      prazovisado,
      prazocontraordenacao,
    };

    //}

    //else return response.status(403).json({status:"403Error",entity:table,message:"index not allwed",code:"4054"})
  }
}

module.exports = entity;
