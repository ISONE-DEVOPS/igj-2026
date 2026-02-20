'use strict'

const controller = "Sgigjrelprocessoinstrucao";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');
const moment = require('moment-timezone');
const Sgigjpessoa = use('App/Models/Sgigjpessoa');
const Env = use('Env')
const GlbnotificacaoFunctions = require('../Http/GlbnotificacaoFunctions');

const newlist = {

  data: [
  ],

  key: [
    {
      name: 'PROCESSO_DESPACHO_ID',
      table: 'sgigjprocessodespacho',
      notNullable: true
    },
  ],
  other: ['CODIGO']
}


class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {



      let data = request.only(['PROCESSO_DESPACHO_ID'])

      const extractRequest = functionsDatabase.extractRequest(newlist, [])


      const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);

      data.ESTADO = "1"
      data.CRIADO_POR = request.userID


      if (validation.status === 'ok') {


        const find_despacho = await Database
          .table("sgigjprocessodespacho")
          .where('ID', data.PROCESSO_DESPACHO_ID)
          .limit(1)



        if (find_despacho[0].URL_DOC_GERADO == null) {

          return response.status(400).json({ status: "error", entity: "sgigjprocessodespacho", message: "this processo doesnt have URL_DOC_GERADO yet", code: "45645764564" })

        }

        if (find_despacho[0].PROCESSO_EXCLUSAO_ID == null) {

          return response.status(400).json({ status: "error", entity: "sgigjprocessodespacho", message: "this processo hasnt PROCESSO_EXCLUSAO_ID", code: "45645764564" })

        }


        if (find_despacho[0].PESSOA_ID_TEMP == null) {

          return response.status(400).json({ status: "error", entity: "sgigjprocessodespacho", message: "this processo hasnt PESSOA_ID_TEMP or PRAZO", code: "45645764564" })

        }






        var find_relpessoaentidade = await Sgigjpessoa
          .query()
          .with('sgigjrelpessoaentidade.sgigjentidade')
          .where('ID', '' + find_despacho[0].PESSOA_ID_TEMP)
          .fetch()


        if (find_relpessoaentidade.rows.length == 0) {

          return response.status(400).json({ status: "error", entity: "sgigjpessoa", message: "the pessoa on processo is invalid", code: "978456" })

        }




        const rel_pessoa_entidade = find_relpessoaentidade.rows[0].$relations.sgigjrelpessoaentidade.rows[0].$attributes
        const rel_entidade = find_relpessoaentidade.rows[0].$relations.sgigjrelpessoaentidade.rows[0].$relations.sgigjentidade.$attributes


        if (Env.get('IDJ_ID', "") != rel_entidade.ID) {

          return response.status(400).json({ status: "error", entity: "sgigjpessoa", message: "the pessoa on processo isnt IGJ colaborador", code: "978456" })

        }







        const find_instrutor = await Database
          .table("sgigjrelprocessoinstrutor")
          .where({
            REL_PESSOA_ENTIDADE_ID: rel_pessoa_entidade.ID,
            PROCESSO_DESPACHO_ID: find_despacho[0].ID,
          })
          .limit(1)

        let instrutor_ID = null


        if (find_instrutor.length == 0) {




          let data_create_instrutor = {
            REL_PESSOA_ENTIDADE_ID: rel_pessoa_entidade.ID,
            PROCESSO_DESPACHO_ID: find_despacho[0].ID,
            PRAZO: find_despacho[0].PRAZO,
            ESTADO: "1",
          }

          data_create_instrutor.ID = await functionsDatabase.createID("sgigjrelprocessoinstrutor")
          data_create_instrutor.DT_REGISTO = functionsDatabase.createDateNow("sgigjrelprocessoinstrutor")



          const create_instrutor = await Database
            .table("sgigjrelprocessoinstrutor")
            .insert(data_create_instrutor)

          if (create_instrutor[0] === 0) instrutor_ID = data_create_instrutor.ID
          else return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrutor", message: "create", code: "3453425" })




        } else instrutor_ID = find_instrutor[0].ID




        const find_instrucao = await Database
          .table("sgigjrelprocessoinstrucao")
          .where({
            REL_PROCESSO_INSTRUTOR_ID: instrutor_ID
          })
          .limit(1)


        if (find_instrucao.length > 0) return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrucao", message: "already exist", code: "3453425" })

        else {


          const newuser = await Database
            .table("glbuser")
            .where('ID', request.userID)
            .limit(1)



          const datainicio = moment(find_despacho[0].DATA).add(find_despacho[0].PRAZO, 'days').format()


          let data_create_instrucao = {
            REL_PROCESSO_INSTRUTOR_ID: instrutor_ID,
            DT_INICIO_INSTRUCAO: datainicio,
            ESTADO: "1",
          }

          data_create_instrucao.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID

          data_create_instrucao.ID = await functionsDatabase.createID("sgigjrelprocessoinstrucao")
          data_create_instrucao.DT_REGISTO = functionsDatabase.createDateNow("sgigjrelprocessoinstrucao")
          data_create_instrucao.CODIGO = await functionsDatabase.createCODIGO("sgigjrelprocessoinstrucao")



          const create_instrutor = await Database
            .table("sgigjrelprocessoinstrucao")
            .insert(data_create_instrucao)

          if (create_instrutor[0] === 0) {

            return (data_create_instrucao)

          }
          else return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrutor", message: "create", code: "3453425" })




        }

      } else return response.status(400).json(validation)


    }

    else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

  }

  async update({ params, request, response }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      if (request.only('TIPO').TIPO == "concluir") {

        // console.log(params.id)

        const find_processoisntrucao = await Model
          .query()
          .with('sgigjrelinstrutorpeca.sgigjprpecasprocessual')
          .where('ID', '' + params.id)
          .fetch()

        const instrucaopecas = find_processoisntrucao.rows[0].$relations.sgigjrelinstrutorpeca.rows

        let hasRELATORIOFINAL = null
        let PR_DECISAO_TP_ID = null
        let hasAUTODECLARACAO = false
        let countNOTACOMUNICACAO = 0

        for (let index = 0; index < instrucaopecas.length; index++) {

          const element = instrucaopecas[index];
          const rel_instrucao_peca = instrucaopecas[index].$attributes;
          const peca = element.$relations.sgigjprpecasprocessual.$attributes;

          if (peca.ID == Env.get('PECAPROCESSUAL_RELATORIOFINAL_ID', "")) {
            console.log("ssssssssss")
            if (rel_instrucao_peca.URL_DOC != null) {
              console.log("TTTTTTT")
              hasRELATORIOFINAL = rel_instrucao_peca.URL_DOC
            }

          }

          if (peca.ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "")) {
            if (rel_instrucao_peca.URL_DOC != null) 
              countNOTACOMUNICACAO++
          }

          if (peca.ID == Env.get('PECAPROCESSUAL_AUTODECLARACAO_ID', "")) {
            hasAUTODECLARACAO = true
          }

        }


        if ( hasRELATORIOFINAL != null) {

          let data = {
            RELATORIO_FINAL: hasRELATORIOFINAL,
          }

          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)


          if (newE === 1) {
            const Pessoa_not_id = await functionsDatabase.userIDToPessoaID(request.userID)
            GlbnotificacaoFunctions.storeToEntidade({
              request,
              ENTIDADE_ID: "" + Env.get('IDJ_ID', ""),
              MSG: "Concluiu uma instrução.",
              TITULO: null,
              PESSOA_ID: Pessoa_not_id,
              URL: "/processos/exclusaointerdicao"
            })
            return (data)
          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
        } else {
          return response.status(400).json({ status: "error", entity: "sgigjrelprocessoinstrucao", message: "to finish you need at least 1 RELATORIOFINAL", code: "567785636745684" })
        }

      } else {

        return response.status(400).json({ status: "fail", entity: "", message: "no type", code: "" })

      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })

  }

  /*
  
  
    async destroy ({ params,  response, request}) {
  
      const allowedMethod = await functionsDatabase.allowed(table,"delete",request.userID,params.id);
  
      if(allowedMethod){
  
        const element = await functionsDatabase.existelement(table,params.id)
  
        if(element===false) return response.status(400).json({status:"erro",entity:table,message:"doesnt exist",code:999}) 
        
        else{
  
          const newE = await Database
            .table(table)
            .where('ID', ''+params.id)
            .delete()
  
  
          if(newE===1){
            return {status:"ok",entity:table+"."+params.id,message:"deleted",code:"888"}
          }
  
          else return response.status(400).json({status:"fail",entity:"",message:"",code:""})  
  
          
        }
  
      }
  
      else return response.status(403).json({status:"403Error",entity:table,message:"delete not allwed",code:"4053"})
  
    }
  
  
  
  */










  async index({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').where(data).where('ESTADO', 1).orderBy('DT_REGISTO', 'desc').fetch()


      return result

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })


  }


  async show({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        return await Model
          .query()
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .where('ID', '' + params.id)
          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }

}

module.exports = entity
