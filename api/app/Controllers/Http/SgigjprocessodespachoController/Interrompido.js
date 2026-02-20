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
      name: 'OBS',
      size: '64000',
      type: 'Text',
      notNullable: false
    },

    {
      name: 'TIPO',
      size: '2',
      type: 'Text',
      notNullable: true
    },


  ],

  key: [],

  other: ['CODIGO']

}

const store = async ({ params, request, response }) => {
  let tableDocument = "sgigjreldocumento"
  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

  if (allowedMethod) {

    const list = await functionsDatabase.DBMaker(table);

    const extractRequest = functionsDatabase.extractRequest(newlist, [])
    const listDocuments = await functionsDatabase.DBMaker(tableDocument);
    const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])

    let documentos = request.input("documentos");

    let data = request.only(extractRequest)
    data.ESTADO = "1"
    data.CRIADO_POR = request.userID

    if (!documentos) {
          return { status: "fail", entity: "", message: "documentos is required", code: "" }
      }

    const existelement = await functionsDatabase.existelement("sgigjrelprocessoinstrucao", params.id)

    if (!existelement) return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrucao", message: "doesnt exist." + params.id, code: 6756 })

    const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);

    if (validation.status === 'ok') {
      if (data.TIPO != "A" && data.TIPO != "P") return response.status(400).json({ status: "405Error", entity: table, message: "TIPO should be A or P", code: "34534534455" })
      /*
              const find_instrucao = await Sgigjrelprocessoinstrucao
              .query()
              .with('sgigjrelprocessoinstrutor.sgigjprocessodespacho.sgigjprocessoexclusao')
              .where('ID', ''+params.id)
              .fetch()
      
              const processo = find_instrucao.rows[0].$relations.sgigjrelprocessoinstrutor.$relations.sgigjprocessodespacho.$relations.sgigjprocessoexclusao.$attributes
      
      
      */
      data.REL_PROCESSO_INSTRUCAO_ID = params.id
      const newitem = await Database
        .table("sgigjdespachointerrompido")
        .where('REL_PROCESSO_INSTRUCAO_ID', data.REL_PROCESSO_INSTRUCAO_ID)
        .limit(1)
      if (newitem.length > 0) return response.status(400).json({ status: "405Error", entity: table, message: "this processo is INTERROMPIDO", code: "345345355" })

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)

      console.log(data)

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      data.TIPO = data.TIPO + "0"


      const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
      const dataHoje = moment().format("DD/MM/YYYY HH:mm")

      GlbnotificacaoFunctions.storeToPerfil({
        request,
        PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
        MSG: `${nomeUtilizador} solicitou a interrupção de um processo (Código: ${data.CODIGO}) em ${dataHoje}. Observação: ${data.OBS || ''}`,
        TITULO: "Processo - Pedido de Interrupção",
        PESSOA_ID: null,
        URL: `/processos/exclusaointerdicao`
      })

      const newE = await Database
        .table("sgigjdespachointerrompido")
        .insert(data)

      if (newE[0] === 0) {

        data.documentos = []
        for (let index = 0; index < documentos.length; index++) {
            let element = documentos[index];
            element.DESPACHO_INTERROMPIDO_ID = data.ID
            element.ID = await functionsDatabase.createID(tableDocument)
            element.DT_REGISTO = data.DT_REGISTO
            element.ESTADO = 1
            const validationDocuments = await functionsDatabase.validation(listDocuments, element, extractRequestDocument, tableDocument);
            if (validationDocuments.status === 'ok') {
                const newE = await Database
                    .table(tableDocument)
                    .insert(element)
                if (newE[0] === 0) {
                    data.documentos.push(element)
                }
                else return { status: "fail", entity: "", message: "", code: "" }


            } else {
                return validationDocuments
            }

        }

        GlbnotificacaoFunctions.storeToPerfil({
          request,
          PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
          MSG: `${nomeUtilizador} registrou a interrupção de um processo (Código: ${data.CODIGO}) em ${dataHoje}. Observação: ${data.OBS || ''}`,
          TITULO: "Processo Interrompido",
          PESSOA_ID: null,
          URL: `/processos/exclusaointerdicao`
        })

        GlbnotificacaoFunctions.storeToPerfil({
          request,
          PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector
          MSG: `${nomeUtilizador} registrou a interrupção de um processo (Código: ${data.CODIGO}) em ${dataHoje}. Observação: ${data.OBS || ''}`,
          TITULO: "Processo Interrompido",
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
