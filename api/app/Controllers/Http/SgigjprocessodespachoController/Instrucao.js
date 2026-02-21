'use strict'

const controller = "Sgigjprocessodespacho";



let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const GlbnotificacaoFunctions = use('App/Controllers/Http/GlbnotificacaoFunctions');
const Sgigjrelprocessoinstrucao = use('App/Models/Sgigjrelprocessoinstrucao');
const functionsDatabase = require('../../functionsDatabase');

const pdfCreater = require('../pdfCreater');

const Env = use('Env')
const moment = require("moment");

const newlist = {

  data: [

    {
      name: 'DESPACHO',
      size: '64000',
      type: 'Text',
      notNullable: false
    },

    {
      name: 'DATA',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: true
    },

    {
      name: 'DATA_INICIO',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: false
    },

    {
      name: 'DATA_FIM',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: false
    },


  ],

  key: [


    {
      name: 'PR_DECISAO_TP_ID',
      table: 'sgigjprdecisaotp',
      notNullable: false
    },

    {
      name: 'PR_EXCLUSAO_PERIODO_ID',
      table: 'sgigjprexclusaoperiodo',
      notNullable: false
    }

  ],

  other: ['CODIGO']

}








const store = async ({ params, request, response }) => {

  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

  if (allowedMethod) {

    const list = await functionsDatabase.DBMaker(table);

    const extractRequest = functionsDatabase.extractRequest(newlist, [])

    let data = request.only(extractRequest)
    data.ESTADO = "1"
    data.CRIADO_POR = request.userID

    const existelement = await functionsDatabase.existelement("sgigjrelprocessoinstrucao", params.id)

    if (!existelement) return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrucao", message: "doesnt exist." + params.id, code: 6756 })

    const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);

    if (validation.status === 'ok') {

      const find_instrucao = await Sgigjrelprocessoinstrucao
        .query()
        .with('sgigjrelprocessoinstrutor.sgigjprocessodespacho.sgigjprocessoexclusao')
        .where('ID', '' + params.id)
        .fetch()

      const processo = find_instrucao.rows[0].$relations.sgigjrelprocessoinstrutor.$relations.sgigjprocessodespacho.$relations.sgigjprocessoexclusao.$attributes

      // if (!(processo.TIPO == "I" || processo.TIPO == "A")) {

      //   return response.status(400).json({ status: "405Error", entity: table, message: "this processo isnt TIPO A or I", code: "464564051" })

      // }

      data.ESTADO = "0"
      data.REL_PROCESSO_INSTRUCAO_ID = params.id


      const request_TIPO = request.only(['TIPO']).TIPO

      if (request_TIPO == "CONCLUIR") {

        const pdftxt = {
          content:
            `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
              <div style="margin-bottom: 30px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
              </div>
              <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                ${data?.DESPACHO}
              </div>
              <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                  Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                </p>
              </div>
            </div>`,
          tipo: "despachofinalInstrucao.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)

        if (pdfcreated?.status == true) data.URL_DOC_GERADO = pdfcreated?.url

      }


      const newuser = await Database
        .table("glbuser")
        .where('ID', request.userID)
        .limit(1)

      data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID

      const newitem = await Database
        .table("sgigjprocessodespacho")
        .where('REL_PROCESSO_INSTRUCAO_ID', data.REL_PROCESSO_INSTRUCAO_ID)
        .limit(1)


      if (newitem.length > 0) {

        delete data.PROCESSO_EXCLUSAO_ID


        const newE = await Database
          .table("sgigjprocessodespacho")
          .where('ID', '' + newitem[0].ID)
          .userID(request.userID)
          .update(data)



        if (newE === 1) {
          const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
          const dataHoje = moment().format("DD/MM/YYYY HH:mm")

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
            MSG: `${nomeUtilizador} atualizou a instrução do processo (Código: ${data?.CODIGO}) em ${dataHoje}.`,
            TITULO: "Instrução no Processo",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
            MSG: `${nomeUtilizador} atualizou a instrução do processo (Código: ${data?.CODIGO}) em ${dataHoje}.`,
            TITULO: "Instrução no Processo",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })

          return (data)

        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      }

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const newE = await Database
        .table(table)
        .insert(data)

      if (newE[0] === 0) {
        const nomeUtilizador2 = await functionsDatabase.userIDToNome(request.userID)
        const dataHoje2 = moment().format("DD/MM/YYYY HH:mm")

        GlbnotificacaoFunctions.storeToPerfil({
          request,
          PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
          MSG: `${nomeUtilizador2} registrou uma instrução no processo (Código: ${data.CODIGO}) em ${dataHoje2}.`,
          TITULO: "Instrução no Processo",
          PESSOA_ID: null,
          URL: `/processos/exclusaointerdicao`
        })

        GlbnotificacaoFunctions.storeToPerfil({
          request,
          PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
          MSG: `${nomeUtilizador2} registrou uma instrução no processo (Código: ${data.CODIGO}) em ${dataHoje2}.`,
          TITULO: "Instrução no Processo",
          PESSOA_ID: null,
          URL: `/processos/exclusaointerdicao`
        })
        return (data)
      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

    } else return response.status(400).json(validation)


  }

  else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

}






module.exports = store
