'use strict'

const controller = "Sgigjreleventoparecer";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const Sgigjentidadeevento = use('App/Models/Sgigjentidadeevento');
const Glbuser = use('App/Models/Glbuser');
const functionsDatabase = require('../functionsDatabase');
const pdfCreater = require('./pdfCreater');
const GlbnotificacaoFunctions = require('../Http/GlbnotificacaoFunctions');
const Env = use('Env')
class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "Atriubuirparecer", request.userID, "");
    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [
        "PR_PARECER_TP_ID",
        "PARECER",
        "DATA",
        "DT_ATRIBUICAO",
        "STATUS",
        "REL_EVENTO_DESPACHO_ID"
      ])

      let data = request.only(extractRequest)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID
      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.DT_ATRIBUICAO = functionsDatabase.createDateNow(table)
      data.STATUS = "atribuido"

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);

      if (validation.status === 'ok') {
        if (data.REL_EVENTO_DESPACHO_ID == request.userID) return response.status(400).json({ status: "erro", entity: "Sgigjreleventoparecer." + data.REL_EVENTO_DESPACHO_ID, message: "userID is equal as REL_EVENTO_DESPACHO_ID", code: 1000 })
        else {
          var data2 = request.only("ENTIDADE_EVENTO_ID")
          if (data2.hasOwnProperty("ENTIDADE_EVENTO_ID") === false) return response.status(400).json({ status: "erro", entity: "ENTIDADE_EVENTO_ID", message: "is required", code: 1000 })
          else {
            const lastelementx20 = await Database
              .table("sgigjentidadeevento")
              .where('ID', data2.ENTIDADE_EVENTO_ID)
              .limit(1)

            if (lastelementx20.length < 1) return response.status(400).json({ status: "erro", entity: "sgigjentidadeevento." + data2.ENTIDADE_EVENTO_ID, message: "doesn't exist", code: 1000 })
            else {
              const lastelementx = await Database
                .table("sgigjreleventodespacho")
                .where('ENTIDADE_EVENTO_ID', data2.ENTIDADE_EVENTO_ID)
                .limit(1)

              if (lastelementx.length > 0) {
                const lastelementx10 = await Database
                  .table("sgigjreleventoparecer")
                  .where('REL_EVENTO_DESPACHO_ID', lastelementx[0].ID)
                  .orderBy('DT_ATRIBUICAO', 'asc')

                if (lastelementx10.length > 0) {
                  if (lastelementx10[lastelementx10.length - 1].STATUS == "finalizado") {
                    data.REL_EVENTO_DESPACHO_ID = lastelementx[0].ID
                    data.DATA = lastelementx10[lastelementx10.length - 1].DATA
                    data.PARECER = lastelementx10[lastelementx10.length - 1].PARECER
                    // data.PR_DECISAO_TP_ID = lastelementx10[lastelementx10.length - 1].PR_DECISAO_TP_ID

                    const newE = await Database
                      .table(table)
                      .insert(data)

                    if (newE[0] === 0) {
                      const Pessoa_noti_id = await functionsDatabase.userIDToPessoaID(request.userID)
                      const user_noti_id = await functionsDatabase.pessoaentidadeIDToUserID(data.REL_PESSOA_ENTIDADE_ID)
                      if (user_noti_id != "") {
                        GlbnotificacaoFunctions.storeToUser({
                          request,
                          USER_ID: "" + user_noti_id,
                          MSG: "Lhe escolheu como inspector de um evento.",
                          TITULO: null,
                          PESSOA_ID: Pessoa_noti_id,
                          URL: "/eventos/eventospedidos"
                        })

                      }
                      return (data)
                    }

                    else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
                  }
                  else return response.status(400).json({ status: "fail", entity: "sgigjreleventoparecer." + data2.ENTIDADE_EVENTO_ID, message: "the last REL_EVENTO_PARECER isn't finalizado", code: "8414" })
                } else {
                  data.REL_EVENTO_DESPACHO_ID = lastelementx[0].ID
                  const newE = await Database
                    .table(table)
                    .insert(data)
                  const Pessoa_noti_id = await functionsDatabase.userIDToPessoaID(request.userID)
                  const user_noti_id = await functionsDatabase.pessoaentidadeIDToUserID(data.REL_PESSOA_ENTIDADE_ID)

                  if (user_noti_id != "") {
                    GlbnotificacaoFunctions.storeToUser({
                      request,
                      USER_ID: "" + user_noti_id,
                      MSG: "Lhe escolheu como inspector de um evento",
                      TITULO: null,
                      PESSOA_ID: Pessoa_noti_id,
                      URL: "/eventos/eventospedidos"
                    })

                  }

                  if (newE[0] === 0) {
                    return (data)
                  }
                  else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
                }
              }
              else {
                const newuser = await Database
                  .table('glbuser')
                  .where('ID', request.userID)
                  .limit(1)

                data2.ID = await functionsDatabase.createID("sgigjreleventodespacho")
                data2.DT_REGISTO = functionsDatabase.createDateNow("sgigjreleventodespacho")
                data2.CODIGO = await functionsDatabase.createCODIGO("sgigjreleventodespacho")
                data2.REL_PESSOA_ENTIDADE_ID = newuser[0].REL_PESSOA_ENTIDADE_ID
                data2.ESTADO = "1"

                const newE2 = await Database
                  .table("sgigjreleventodespacho")
                  .insert(data2)
                if (newE2[0] === 0) {
                  data.REL_EVENTO_DESPACHO_ID = data2.ID
                  const newE = await Database
                    .table(table)
                    .insert(data)
                  if (newE[0] === 0) {
                    const Pessoa_noti_id = await functionsDatabase.userIDToPessoaID(request.userID)
                    const user_noti_id = await functionsDatabase.pessoaentidadeIDToUserID(data.REL_PESSOA_ENTIDADE_ID)
                    if (user_noti_id != "") {

                      GlbnotificacaoFunctions.storeToUser({
                        request,
                        USER_ID: "" + user_noti_id,
                        MSG: "Lhe escolheu como inspector de um evento.",
                        TITULO: null,
                        PESSOA_ID: Pessoa_noti_id,
                        URL: "/eventos/eventospedidos"
                      })
                    }
                    return (data)
                  }
                  else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
                }
                else return response.status(400).json({ status: "fail", entity: "sgigjreleventodespacho", message: "", code: "" })
              }
            }
          }
        }
      } else return response.status(400).json(validation)
    }
    else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })
  }

  async update({ params, request, response }) {

    const request_status = request.only(['STATUS'])

    const entidadeevento_id = request.input('entidadeevento_id')

    const entidadeevento_maker = await Sgigjentidadeevento
      .query()
      .with('sgigjreleventodespacho', (builder) => {
        builder.with('sgigjreleventoparecer', (builder) => {
          builder.orderBy('DT_ATRIBUICAO', 'asc')
        })
      })
      .where('ID', entidadeevento_id)
      .fetch()

    const rel_evento_despacho = entidadeevento_maker.rows[0].$relations.sgigjreleventodespacho.rows[0].$attributes
    const rel_evento_parecer = entidadeevento_maker.rows[0].$relations.sgigjreleventodespacho.rows[0].$relations.sgigjreleventoparecer.rows[entidadeevento_maker.rows[0].$relations.sgigjreleventodespacho.rows[0].$relations.sgigjreleventoparecer.rows.length - 1].$attributes


    const allowedMethod = await functionsDatabase.allowed(table, "Parecer", request.userID, params.id); //

    if (allowedMethod == true && request_status.STATUS == "atualizar" && rel_evento_parecer.STATUS == "aceite") {



      const newuser = await Database
        .table('glbuser')
        .where('ID', request.userID)
        .limit(1)

      if (newuser[0].REL_PESSOA_ENTIDADE_ID != rel_evento_parecer.REL_PESSOA_ENTIDADE_ID) {

        return response.status(400).json({ status: "fail", entity: "", message: "", code: "8588" })

      }



      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, ['REL_EVENTO_DESPACHO_ID', 'REL_PESSOA_ENTIDADE_ID', 'DT_ATRIBUICAO', 'ESTADO', 'STATUS'])

      let data = request.only(extractRequest)
      const validation = await functionsDatabase.validation(list, data, extractRequest, table);

      if (rel_evento_parecer.STATUS == 'aceite') {

        data.DT_ATRIBUICAO = functionsDatabase.createDateNow("sgigjreleventoparecer")


        const data2 = request.only(["DATA", "PR_PARECER_TP_ID", "PARECER"])

        const newE = await Database
          .table(table)
          .where('ID', '' + rel_evento_parecer.ID)
          .update(data2)


        if (newE === 1) {
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      } else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })




    }











    const allowedMethod2 = await functionsDatabase.allowed(table, "Parecer", request.userID, params.id); //    

    if (allowedMethod2 == true && request_status.STATUS == "finalizado") {



      if (rel_evento_parecer.STATUS == "aceite") {
        var newuser_Glbuser = await Glbuser
          .query()
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .where('ID', request.userID)
          .fetch()


        const pessoa_nome = newuser_Glbuser.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjpessoa.$attributes.NOME

        const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-5196577213986346-AssinaturaInspetorGeral1removebgpreview.png?alt=media&token=0"
        const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
        const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"

        let data_parecer = ""



        if (rel_evento_parecer.DATA != null) {

          data_parecer = rel_evento_parecer.DATA ? (new Date(rel_evento_parecer.DATA)).toISOString().substring(0, 10) : null

        }

        let pareceContent = rel_evento_parecer?.PARECER

        if(pareceContent){
          pareceContent = pareceContent.replace(/font-size: \d*\w*;/gm, "font-size: 12pt;")
          pareceContent = pareceContent.replace(/font-family:.*?sans-serif;/gm, "font-family: 'Times New Roman';")
        }

        const pdftxt = {
          content:
            `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
              <div style="margin-bottom: 30px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
              </div>
              <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center;">PARECER</h1>
                <p style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6; margin-top: 30px;">${pareceContent}</p>
                <p style="margin-top: 30px; font-family: 'Times New Roman', serif; font-size: 12pt;">
                  Praia, IGJ,
                  ${functionsDatabase.convertDateToPT(data_parecer)?.dia}
                  de ${functionsDatabase.convertDateToPT(data_parecer)?.mes}
                  de ${functionsDatabase.convertDateToPT(data_parecer)?.ano}
                </p>
              </div>
              <div style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; margin-top: 40px; position: relative;">
                <p>Inspetor(a)</p>
                ${(function () {
                  if(newuser_Glbuser[0].ASSINATURA_URL){
                    return \`<img src="\${newuser_Glbuser[0].ASSINATURA_URL}?alt=media&token=0" width="250" height="100" style="position: absolute;top: -30px;left: 35%;">\`
                  }
                  return ''
                })()}
                <p>_________________________________</p>
                <p>${pessoa_nome}</p>
              </div>
              <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                  Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                </p>
              </div>
              <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height:100%">
              <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
            </div>`,
          tipo: "parecerEvento.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)

        let data = {
          STATUS: "finalizado",
          URL_DOC_GERADO: pdfcreated?.url
        }


        const newE = await Database
          .table(table)
          .where('ID', '' + rel_evento_parecer.ID)
          .userID(request.userID)
          .update(data)


        if (newE === 1) {

          rel_evento_parecer.STATUS

          const Pessoa_not_id = await functionsDatabase.pessoaentidadeIDToPessoaID(rel_evento_parecer.REL_PESSOA_ENTIDADE_ID)

          GlbnotificacaoFunctions.storeToEntidade({
            request,
            ENTIDADE_ID: "" + Env.get('IDJ_ID', ""),
            MSG: "Deu o parecer de um pedido.",
            TITULO: null,
            PESSOA_ID: Pessoa_not_id,
            URL: "/eventos/eventospedidos"
          })


          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })





      }

    }

    const allowedMethod3 = await functionsDatabase.allowed(table, "Aceitar", request.userID, params.id); //    

    if (allowedMethod3 == true && request_status.STATUS == "aceite") {

      let data = {
        STATUS: "aceite"
      }

      console.log(rel_evento_parecer)

      if (rel_evento_parecer.STATUS == "atribuido") {

        const newuser = await Database
          .table('glbuser')
          .where('ID', request.userID)
          .limit(1)

        if (newuser[0].REL_PESSOA_ENTIDADE_ID != rel_evento_parecer.REL_PESSOA_ENTIDADE_ID) {

          return response.status(400).json({ status: "fail", entity: "", message: "", code: "8589" })

        }



        const newE = await Database
          .table(table)
          .where('ID', '' + rel_evento_parecer.ID)
          .userID(request.userID)
          .update(data)


        if (newE === 1) {
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })


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
  
  
  
  
  
  
  
  
  
  
  
  
  
      
    async index ({ request, response }) {
  
  
      const allowedMethod = await functionsDatabase.allowed(table,"index",request.userID,"");
  
      if(allowedMethod){
  
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list,[])
        const data = functionsDatabase.indexconfig(request,extractRequest,['DT_REGISTO'])
  
        var result = await Model.query().where(data).orderBy('DT_REGISTO','desc').fetch()
  
  
        return result
  
      }
  
      else return response.status(403).json({status:"403Error",entity:table,message:"index not allwed",code:"4054"})
  
  
    }
  
  
  
  
  
  
  
  
  
    async show ({ params,  response, request }) {
  
      const allowedMethod = await functionsDatabase.allowed(table,"show",request.userID,params.id);
  
      if(allowedMethod){
  
        const element = await functionsDatabase.existelement(table,params.id)
  
        if(element===false) return response.status(400).json({status:"erro",entity:table,message:"doesnt exist",code:999}) 
        
        else{
  
          return await Model
            .query()
            .where('ID', ''+params.id)
            .fetch()
          
       
        }
  
      }
  
      else return response.status(403).json({status:"403Error",entity:table,message:"show not allwed",code:"4056"})
  
    }
  
  
  
    */



}

module.exports = entity
