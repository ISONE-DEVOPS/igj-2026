"use strict";

const DatabaseDB = use("Database");
let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = "sgigjprocessoexclusao";

const functionsDatabase = require("../../functionsDatabase");
const GlbnotificacaoFunctions = require('../GlbnotificacaoFunctions');

const pdfCreater = require("../pdfCreater");
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
        content: `
          <div style="width: 100%; height: 100%; zoom: ${Env.get("ZOOM_PDF", "")};">
            <div style="margin-bottom: 96px;">
              <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 40px;">
            </div>
            <div style="min-height: 1190px; padding-right: 96px; padding-left: 96px;">
              ${body.DESPACHO}
            </div>
            <div>
              <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">_______________________________________________________________________________________</p>
              <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">
                <span style="font-size: 12px;">Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span>
              </p>
            </div>
          </div>`,
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
