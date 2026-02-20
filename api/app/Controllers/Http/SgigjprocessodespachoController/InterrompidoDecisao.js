'use strict'

const controller = "Sgigjprocessodespacho";



let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const GlbnotificacaoFunctions = use('App/Controllers/Http/GlbnotificacaoFunctions');


const functionsDatabase = require('../../functionsDatabase');

const pdfCreater = require('../pdfCreater');

const Env = use('Env')
const moment = require("moment");

const newlist = {

  data: [
    {
      name: 'APLICAR',
      size: '1',
      type: 'Text',
      notNullable: true
    },

    {

      name: 'OBS_IG',
      size: '64000',
      type: 'Text',
      notNullable: true
    }

  ],
  key: [],
  other: ['CODIGO']

}

const store = async ({ params, request, response }) => {

  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Interromper", request.userID, "");

  if (allowedMethod) {


    const extractRequest = functionsDatabase.extractRequest(newlist, [])

    let data = request.only(extractRequest)
    data.ESTADO = "1"
    data.CRIADO_POR = request.userID

    const existelement = await functionsDatabase.existelement("sgigjrelprocessoinstrucao", params.id)

    if (!existelement) return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrucao", message: "doesnt exist." + params.id, code: 6756 })

    const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);

    if (validation.status === 'ok') {
      data.REL_PROCESSO_INSTRUCAO_ID = params.id

      const newitem = await Database
        .table("sgigjdespachointerrompido")
        .where('REL_PROCESSO_INSTRUCAO_ID', data.REL_PROCESSO_INSTRUCAO_ID)
        .limit(1)

      if (newitem.length > 0) {

        if (data.APLICAR == "S") {
          let newdata = {}
          if (newitem[0].TIPO == "A0") newdata.TIPO = "A"
          if (newitem[0].TIPO == "P0") newdata.TIPO = "P"

          const newE = await Database
            .table("sgigjdespachointerrompido")
            .where('REL_PROCESSO_INSTRUCAO_ID', data.REL_PROCESSO_INSTRUCAO_ID)
            .update(newdata)

          if (newE === 1) {
            const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
            const dataHoje = moment().format("DD/MM/YYYY HH:mm")

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: `${nomeUtilizador} aplicou a interrupção do processo (Código: ${newitem[0].CODIGO}) em ${dataHoje}.`,
              TITULO: "Interrupção Aplicada",
              PESSOA_ID: null,
              URL: `/processos/exclusaointerdicao`
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector
              MSG: `${nomeUtilizador} aplicou a interrupção do processo (Código: ${newitem[0].CODIGO}) em ${dataHoje}.`,
              TITULO: "Interrupção Aplicada",
              PESSOA_ID: null,
              URL: `/processos/exclusaointerdicao`
            })

            return (newdata)
          }

        }

        if (data.APLICAR == "N") {
          const newE = await Database
            .table("sgigjdespachointerrompido")
            .userID(request.userID)
            .where('REL_PROCESSO_INSTRUCAO_ID', data.REL_PROCESSO_INSTRUCAO_ID)
            .update({
              "ESTADO": 0,
              "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow("sgigjdespachointerrompido")
            })
          if (newE === 1) {
            const nomeUtilizador2 = await functionsDatabase.userIDToNome(request.userID)
            const dataHoje2 = moment().format("DD/MM/YYYY HH:mm")

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: `${nomeUtilizador2} rejeitou a interrupção do processo (Código: ${newitem[0].CODIGO}) em ${dataHoje2}.`,
              TITULO: "Interrupção Rejeitada",
              PESSOA_ID: null,
              URL: `/processos/exclusaointerdicao`
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector
              MSG: `${nomeUtilizador2} rejeitou a interrupção do processo (Código: ${newitem[0].CODIGO}) em ${dataHoje2}.`,
              TITULO: "Interrupção Rejeitada",
              PESSOA_ID: null,
              URL: `/processos/exclusaointerdicao`
            })
            return { status: "ok", entity: "sgigjdespachointerrompido", message: "deleted", code: "8848" }
          }
        }

      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

    } else return response.status(400).json(validation)

  }

  else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

}






module.exports = store
