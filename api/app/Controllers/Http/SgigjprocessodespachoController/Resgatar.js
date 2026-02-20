"use strict";

const controller = "Sgigjdespachointerrompido";
let Database = require("../../../utils/DatabaseAuditoria");
Database = new Database();
const table = controller.toLowerCase();
const functionsDatabase = require("../../functionsDatabase");
const GlbnotificacaoFunctions = require('../GlbnotificacaoFunctions');
const Env = use('Env');
const moment = require("moment");

const Sgigjprocessodespacho = use("App/Models/Sgigjprocessodespacho");

const store = async ({ params, request, response }) => {
  const allowedMethod = await functionsDatabase.allowed(
    "sgigjprocessoexclusao",
    "Instrucao",
    request.userID,
    ""
  );

  if (allowedMethod || true) {
    let isSuccess = false;
    const existelement = await functionsDatabase.existelement(
      "sgigjprocessoexclusao",
      params.id
    );
    if (!existelement)
      return response.status(400).json({
        status: "error",
        entity: table,
        message: "doesnt exist." + params.id,
        code: 6756,
      });

    let despacho = (
      await Sgigjprocessodespacho.query()
        .with("sgigjrelprocessoinstrutor")
        .with("sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao")
        .where("PROCESSO_EXCLUSAO_ID", params.id)
        .fetch()
    ).toJSON();

    await Database.table("sgigjprocessodespacho")
        .userID(request.userID)
        .where("PROCESSO_EXCLUSAO_ID", params.id)
        .update({
          URL_DOC_GERADO: null,
        });

    let intrucao_ID =
      despacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]
        ?.ID;
    if (intrucao_ID) {
      const despachointerrompido = await Database.table(
        "sgigjdespachointerrompido"
      )
        .userID(request.userID)
        .where("REL_PROCESSO_INSTRUCAO_ID", intrucao_ID)
        .update({
          ESTADO: 0,
        });

      const instrucao = await Database.table("sgigjrelprocessoinstrucao")
        .userID(request.userID)
        .where("ID", intrucao_ID)
        .update({
          RELATORIO_FINAL: null,
        });

        console.log(instrucao,"instrucao",intrucao_ID)
      if (despachointerrompido === 1 || instrucao === 1) {
        isSuccess = true;
      }
    }

    const despachofinalExist = await Database.table("sgigjdespachofinal")
      .where("PROCESSO_EXCLUSAO_ID", params.id)
      .limit(1);

    if (despachofinalExist.length > 0) {
      const despachofinal = await Database.table("sgigjdespachofinal")
        .userID(request.userID)
        .where("PROCESSO_EXCLUSAO_ID", params.id)
        .update({
          ESTADO: 0,
        });

      if (despachofinal == 1) {
        isSuccess = true;
      }
    }
    if(isSuccess){
      const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
      const dataHoje = moment().format("DD/MM/YYYY HH:mm")

      // Notificar Inspector Geral
      GlbnotificacaoFunctions.storeToPerfil({
        request,
        PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
        MSG: `${nomeUtilizador} resgatou um processo em ${dataHoje}.`,
        TITULO: "Processo Resgatado",
        PESSOA_ID: null,
        URL: "/processos/exclusaointerdicao"
      });

      // Notificar Inspectores
      GlbnotificacaoFunctions.storeToPerfil({
        request,
        PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
        MSG: `${nomeUtilizador} resgatou um processo em ${dataHoje}.`,
        TITULO: "Processo Resgatado",
        PESSOA_ID: null,
        URL: "/processos/exclusaointerdicao"
      });

      return response.status(200).json({
        status: "sucess",
        entity: "",
        message: "Resgatado feito",
        code: "",
      });
    }else{
      return response.status(200).json({
        status: "error",
        entity: "",
        message: "Error em Regastar o processo",
        code: "",
      });
    }
    
  } else
    return response.status(400).json({
      status: "405Error",
      entity: table,
      message: "not allwed",
      code: "4051",
    });
};

module.exports = store;
