'use strict'

const controller = "Sgigjprocessodespacho";



let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const Sgigjpessoa = use('App/Models/Sgigjpessoa');
const DatabaseDB = use("Database");

const functionsDatabase = require('../../functionsDatabase');
const pdfCreater = require('../pdfCreater');
const Env = use('Env')
const GlbnotificacaoFunctions = require('../GlbnotificacaoFunctions');
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
      name: 'REFERENCIA',
      size: '15',
      type: 'Text',
      notNullable: true
    },
    {
      name: 'OBS',
      size: '64000',
      type: 'Text',
      notNullable: false
    },

    {
      name: 'TIPO_PROCESSO_EXCLUSAO',
      size: '1',
      type: 'Text',
      notNullable: true
    },

    {
      name: 'PRAZO',
      size: '11',
      type: 'Number',
      notNullable: false
    },

    {
      name: 'DATA',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: true
    },


  ],

  key: [
    {
      name: 'INSTRUTOR',
      table: 'sgigjpessoa',
      notNullable: false
    },

    {
      name: 'INFRACAO_COIMA_ID',
      table: 'sgigjinfracaocoima',
      notNullable: false
    },
  ],

  other: ['CODIGO']

}


const store = async ({ params, request, response }) => {

  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "DespachoInicial", request.userID, "");

  if (allowedMethod) {

    const list = await functionsDatabase.DBMaker(table);
    const extractRequest = functionsDatabase.extractRequest(newlist, [])
    let data = request.only(extractRequest)
    data.ESTADO = "1"
    data.CRIADO_POR = request.userID

    const existelement = await functionsDatabase.existelement("sgigjprocessoexclusao", params.id)
    if (!existelement) return response.status(400).json({ status: "error", entity: "sgigjprocessoexclusao", message: "doesnt exist." + params.id, code: 6756 })

    const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);
    if (validation.status === 'ok') {
      var find_relpessoaentidade = await Sgigjpessoa
        .query()
        .with('sgigjrelpessoaentidade.sgigjentidade')
        .where('ID', '' + data.INSTRUTOR)
        .fetch()

      if (find_relpessoaentidade.rows.length == 0) {

        return response.status(400).json({ status: "error", entity: "sgigjpessoa", message: "the pessoa on processo is invalid", code: "978456" })

      }
      const rel_entidade = find_relpessoaentidade.rows[0].$relations.sgigjrelpessoaentidade.rows[0].$relations.sgigjentidade.$attributes

      if (Env.get('IDJ_ID', "") != rel_entidade.ID) {

        return response.status(400).json({ status: "error", entity: "sgigjpessoa", message: "the pessoa on processo isnt IGJ colaborador", code: "978456" })

      }

      if (!(data.TIPO_PROCESSO_EXCLUSAO == 'I' || data.TIPO_PROCESSO_EXCLUSAO == 'D' || data.TIPO_PROCESSO_EXCLUSAO == 'A' || data.TIPO_PROCESSO_EXCLUSAO == 'C')) {

        return response.status(400).json({ status: "error", entity: "sgigjprocessodespacho", message: "TIPO_PROCESSO_EXCLUSAO should be A, D, I or C", code: "5345" })

      }

      if (data.TIPO_PROCESSO_EXCLUSAO == 'I') {

        data.PRAZO = Env.get('PRAZO_EXCLUSAO', "")

      }

      data.ESTADO = "1"
      data.PESSOA_ID_TEMP = data.INSTRUTOR
      data.PROCESSO_EXCLUSAO_ID = params.id

      delete data.INSTRUTOR

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
          tipo: "despachoExclusao.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)

        if (pdfcreated?.status == true) data.URL_DOC_GERADO = pdfcreated?.url


        console.log(data)


      }

      const newuser = await Database
        .table("glbuser")
        .where('ID', request.userID)
        .limit(1)

      data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID

      const newitem = await Database
        .table("sgigjprocessodespacho")
        .where('PROCESSO_EXCLUSAO_ID', data.PROCESSO_EXCLUSAO_ID)
        .limit(1)

      if (newitem.length > 0) {

        data.PROCESSO_EXCLUSAO_ID = newitem[0].PROCESSO_EXCLUSAO_ID

      }

      if (data.TIPO_PROCESSO_EXCLUSAO == 'C') {

        const data_INFRACAO_COIMA = request.only(['INFRACAO_COIMA_ID'])


        // if (!data_INFRACAO_COIMA.hasOwnProperty('INFRACAO_COIMA_ID')) {

        //   return response.status(400).json({ status: "error", entity: "sgigjprocessodespacho", message: "INFRACAO_COIMA_ID is require", code: "5345" })

        // }

        let INFRACAO_COIMA_ID = null
        if(data_INFRACAO_COIMA){
          INFRACAO_COIMA_ID = data_INFRACAO_COIMA.INFRACAO_COIMA_ID
        }
        const contraordenacaoID = await functionsDatabase.createID("sgigjrelcontraordenacaoinfracao")
        
        const newINFRACAO = await Database
          .table("sgigjrelcontraordenacaoinfracao")
          .where('PROCESSO_EXCLUSAO_ID', data.PROCESSO_EXCLUSAO_ID)
          .limit(1)



        if (newINFRACAO.length == 0 && INFRACAO_COIMA_ID) {



          const newE2 = await Database
            .table("sgigjrelcontraordenacaoinfracao")
            .insert({
              ID: contraordenacaoID,
              INFRACAO_COIMA_ID,
              PROCESSO_EXCLUSAO_ID: data.PROCESSO_EXCLUSAO_ID,
            })


        }

        if (newINFRACAO.length > 0 && INFRACAO_COIMA_ID) {


          const newE2 = await Database
            .table("sgigjrelcontraordenacaoinfracao")
            .where('PROCESSO_EXCLUSAO_ID', data.PROCESSO_EXCLUSAO_ID)
            .update({
              INFRACAO_COIMA_ID,
            })


        }

        delete data.INFRACAO_COIMA_ID
      }

      if (newitem.length > 0) {

        if (newitem[0].URL_DOC_GERADO != null) {

          return response.status(400).json({ status: "error", entity: "sgigjprocessodespacho", message: "it already has URL_DOC_GERADO, its FINALIZADO", code: "5345" })

        }

        data.PRAZO = data.PRAZO == "" || data.PRAZO == " " ? null : data.PRAZO
        const newE = await Database
          .table("sgigjprocessodespacho")
          .where('ID', '' + newitem[0].ID)
          .userID(request.userID)
          .update(data)

        if (newE === 1) {
          const Pessoa_noti_id = await functionsDatabase.userIDToPessoaID(request.userID)
          const user_noti_id = await functionsDatabase.pessoaIDToUserID(data.PESSOA_ID_TEMP)
          const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
          const dataHoje = moment().format("DD/MM/YYYY HH:mm")

          if (user_noti_id != "") {

            GlbnotificacaoFunctions.storeToUser({
              request,
              USER_ID: "" + user_noti_id,
              MSG: `${nomeUtilizador} escolheu-lhe como instrutor de um processo em ${dataHoje}.`,
              TITULO: "Despacho Inicial - Instrutor Designado",
              PESSOA_ID: Pessoa_noti_id,
              URL: "/processos/exclusaointerdicao"
            })

          }

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
            MSG: `${nomeUtilizador} atualizou o despacho inicial de um processo em ${dataHoje}. Referência: ${data.REFERENCIA || ''}.`,
            TITULO: "Despacho Inicial",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
            MSG: `${nomeUtilizador} atualizou o despacho inicial de um processo em ${dataHoje}. Referência: ${data.REFERENCIA || ''}.`,
            TITULO: "Despacho Inicial",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })

          const newDelete = await DatabaseDB
            .table("sgigjdespachofinal")
            .where('PROCESSO_EXCLUSAO_ID', '' + data.PROCESSO_EXCLUSAO_ID)
            .whereNull('URL_DOC_GERADO')
            .delete()

          return (data)

        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      }

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      data.PRAZO = data.PRAZO == "" || data.PRAZO == " " ? null : data.PRAZO
      const newE = await Database
        .table(table)
        .insert(data)



      if (newE[0] === 0) {


        if (request_TIPO == "CONCLUIR") {



          const Pessoa_noti_id = await functionsDatabase.userIDToPessoaID(request.userID)
          const user_noti_id = await functionsDatabase.pessoaIDToUserID(data.PESSOA_ID_TEMP)
          const nomeUtilizador2 = await functionsDatabase.userIDToNome(request.userID)
          const dataHoje2 = moment().format("DD/MM/YYYY HH:mm")

          if (user_noti_id != "") {

            GlbnotificacaoFunctions.storeToUser({
              request,
              USER_ID: "" + user_noti_id,
              MSG: `${nomeUtilizador2} escolheu-lhe como instrutor de um processo (Código: ${data.CODIGO}) em ${dataHoje2}.`,
              TITULO: "Despacho Inicial - Instrutor Designado",
              PESSOA_ID: Pessoa_noti_id,
              URL: "/processos/exclusaointerdicao"
            })

          }

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
            MSG: `${nomeUtilizador2} registrou um despacho inicial no processo (Código: ${data.CODIGO}) em ${dataHoje2}. Referência: ${data.REFERENCIA || ''}.`,
            TITULO: "Despacho Inicial",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
            MSG: `${nomeUtilizador2} registrou um despacho inicial no processo (Código: ${data.CODIGO}) em ${dataHoje2}. Referência: ${data.REFERENCIA || ''}.`,
            TITULO: "Despacho Inicial",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })


        }

        const newDelete = await DatabaseDB
          .table("sgigjdespachofinal")
          .where('PROCESSO_EXCLUSAO_ID', '' + data.PROCESSO_EXCLUSAO_ID)
          .whereNull('URL_DOC_GERADO')
          .delete()


        return (data)
      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

    } else return response.status(400).json(validation)


  }

  else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

}






module.exports = store
