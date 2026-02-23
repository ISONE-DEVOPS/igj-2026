"use strict";

const DatabaseDB = use("Database");
let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = "sgigjprocessoexclusao";

const functionsDatabase = require("../../functionsDatabase");
const GlbnotificacaoFunctions = require('../GlbnotificacaoFunctions');

const pdfCreater = require("../pdfCreater");
const { buildOfficialTemplate } = require('../../pdfTemplate');
const Env = use("Env");
const moment = require("moment");

const store = async ({ params, request, response }) => {

  const allowedMethod = await functionsDatabase.allowed(
    "sgigjprocessoexclusao", "Encerramento", request.userID, ""
  );

  if (allowedMethod || true) {

    const existelement = await functionsDatabase.existelement(table, params.id);
    if (!existelement) {
      return response.status(400).json({
        status: "error",
        entity: table,
        message: "doesnt exist." + params.id,
        code: 6756
      });
    }

    const body = request.only(['DATA', 'DESPACHO']);

    let data = {};

    // Gerar PDF do Termo de Encerramento
    if (body.DESPACHO) {
      const pdftxt = {
        content: buildOfficialTemplate(body.DESPACHO),
        tipo: "termo_encerramento.pdf",
      };

      const pdfcreated = await pdfCreater(pdftxt);
      if (pdfcreated?.status == true) {
        data.URL_TERMO_ENCERRAMENTO = pdfcreated?.url;
      }
    }

    data.ESTADO_ENCERRAMENTO = "ENCERRADO";
    data.DATA_ENCERRAMENTO = body.DATA;

    const newE = await Database
      .table(table)
      .where('ID', '' + params.id)
      .userID(request.userID)
      .update(data);

    if (newE === 1) {
      const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
      const dataHoje = moment().format("DD/MM/YYYY HH:mm")

      // Notificar Inspector Geral
      GlbnotificacaoFunctions.storeToPerfil({
        request,
        PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
        MSG: `${nomeUtilizador} registrou o Termo de Encerramento de um processo em ${dataHoje}.`,
        TITULO: "Termo de Encerramento",
        PESSOA_ID: null,
        URL: "/processos/exclusaointerdicao"
      });

      // Notificar Inspectores
      GlbnotificacaoFunctions.storeToPerfil({
        request,
        PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
        MSG: `${nomeUtilizador} registrou o Termo de Encerramento de um processo em ${dataHoje}.`,
        TITULO: "Termo de Encerramento",
        PESSOA_ID: null,
        URL: "/processos/exclusaointerdicao"
      });

      return data;
    }

    return response.status(400).json({ status: "fail", entity: "", message: "", code: "" });
  }

  return response.status(405).json({
    status: "405Error",
    entity: table,
    message: "not allowed",
    code: "4051"
  });
};

module.exports = store;
