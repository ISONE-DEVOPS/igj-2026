'use strict'

const controller = "Sgigjreleventodespacho";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const moment = require('moment-timezone');
const functionsDatabase = require('../functionsDatabase');
const pdfCreater = require('./pdfCreater');
const Glbuser = use('App/Models/Glbuser');
const Env = use('Env')

class entity {

  async update({ params, request, response }) {

    // const allowedMethod = await functionsDatabase.allowed("sgigjrelenteventodecisao","Decisao",request.userID,params.id);

    // if(allowedMethod){
    const request_status = request.only(['STATUS'])
    const element = await functionsDatabase.existelement(table, params.id)
    if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }
    else {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, ["SELF_ID", "ENTIDADE_EVENTO_ID", "REL_PESSOA_ENTIDADE_ID", "URL_DOC_GERADO", "ESTADO", "STATUS"])

      let data = request.only(extractRequest)
      const validation = await functionsDatabase.validation(list, data, extractRequest, table);

      const lastelementx20 = await Database
        .table("sgigjreleventodespacho")
        .where('ID', params.id)
        .limit(1)


      if (lastelementx20.length < 1) response.status(400).json({ status: "fail", entity: "sgigjreleventodespacho." + params.id, message: "doesn't exist", code: 999 })

      else {
        if (lastelementx20[0].STATUS == "finalizado") {
          const dialimitefinalizacao = await Database
            .table("glbpredefinicao")
            .where('NOME', "dialimitefinalizacao")
            .limit(1)

          if (dialimitefinalizacao.length > 0) {

            if (!isNaN(dialimitefinalizacao[0].DADOS)) {
              const entidadeenvento = await Database
                .table("sgigjentidadeevento")
                .where('ID', lastelementx20[0].ENTIDADE_EVENTO_ID)
                .limit(1)

              const datainicio = moment(entidadeenvento[0].DT_INICIO).tz(Env.get('GMT', "")).subtract(dialimitefinalizacao[0].DADOS, 'days').valueOf()
              const dataagora = moment().tz(Env.get('GMT', "")).valueOf()
              if (dataagora > datainicio) return response.status(400).json({ status: "fail", entity: "", message: "tempo limite ultrapassado", code: "33343345" })
            }
          }
        }


        if (request_status.STATUS == "finalizado") {
          if (lastelementx20[0].PR_DECISAO_TP_ID == null) return response.status(400).json({ status: "fail", entity: "", message: "SET PR_DECISAO_TP_ID", code: "345345" })
          //if(lastelementx20[0].REL_PESSOA_ENTIDADE_ID!=userID) response.status(400).json({status:"fail",entity:""+userID,message:"isn't REL_PESSOA_ENTIDADE_ID",code:9489})
          //else{
          //if(lastelementx20[0].PR_DECISAO_TP_ID!=null) response.status(400).json({status:"fail",entity:"sgigjreleventodespacho."+params.id,message:"already have PR_DECISAO_TP_ID",code:9439})
          //else{

          var newuser_Glbuser = await Glbuser
            .query()
            .with('sgigjrelpessoaentidade.sgigjpessoa')
            .where('ID', request.userID)
            .fetch()
          const pessoa_nome = newuser_Glbuser.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjpessoa.$attributes.NOME
          const newintem = await Database
            .table("sgigjreleventodespacho")
            .where('ID', params.id)
            .limit(1)

          const newdata_despacho = newintem[0].DATA ? (new Date(newintem[0].DATA)).toISOString().substring(0, 10) : null
          const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-5196577213986346-AssinaturaInspetorGeral1removebgpreview.png?alt=media&token=0"
          const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
          const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"
          
          const pdftxt = {
            content:
              `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
                <div style="margin-bottom: 30px;">
                  <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
                </div>
                <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                  <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center;">AUTORIZAÇÃO N.º ${lastelementx20[0].REFERENCIA}/2024</h1>
                  <p style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6; margin-top: 30px;">${lastelementx20[0].DESPACHO}</p>
                  <p style="margin-top: 30px; font-family: 'Times New Roman', serif; font-size: 12pt;">
                    Praia, IGJ,
                    ${functionsDatabase.convertDateToPT(newdata_despacho)?.dia}
                    de ${functionsDatabase.convertDateToPT(newdata_despacho)?.mes}
                    de ${functionsDatabase.convertDateToPT(newdata_despacho)?.ano}
                  </p>
                </div>
                <div style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; margin-top: 40px; position: relative;">
                  <p>Inspetor Geral</p>
                  ${(function () {
                    if(newuser_Glbuser && newuser_Glbuser.rows[0].ASSINATURA_URL){
                      return `<img src="${newuser_Glbuser.rows[0].ASSINATURA_URL}?alt=media&token=0" width="250" height="100" style="position: absolute;top: -30px;left: 35%;">`
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
            tipo: "despachoEvento.pdf",
          }

          const pdfcreated = await pdfCreater(pdftxt)
          let data2 = {
            STATUS: "finalizado",
            URL_DOC_GERADO: pdfcreated?.url,
            REL_PESSOA_ENTIDADE_ID:newuser_Glbuser.rows[0].$relations.sgigjrelpessoaentidade.ID

          }

          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .update(data2)
          if (newE === 1) {
            return (data2)
          }
          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
          //}       
          //}
        }

        if (request_status.STATUS == "atualizar") {
          if (validation.status === 'ok') {
            const request_decisao = request.only(['PR_DECISAO_TP_ID'])

            if ((request_decisao.PR_DECISAO_TP_ID == "" || request_decisao.PR_DECISAO_TP_ID == null) && (lastelementx20[0].PR_DECISAO_TP_ID != null)) {
              return response.status(400).json({ status: "fail", entity: "", message: "SET PR_DECISAO_TP_ID", code: "345345" })
            }

            let data2 = {
              DATA: request.only(['DATA']).DATA,
              DESPACHO: request.only(['DESPACHO']).DESPACHO,
              PR_DECISAO_TP_ID: request.only(['PR_DECISAO_TP_ID']).PR_DECISAO_TP_ID,
              REFERENCIA: request.only(['REFERENCIA']).REFERENCIA,

            }

            const newE = await Database
              .table(table)
              .where('ID', '' + params.id)
              .update(data2)

            if (newE === 1) {
              return (data2)
            }

            else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
          } else return response.status(400).json(validation)
        }
      }
    }
    // }
    // else return response.status(405).json({status:"405 error",entity:table,message:"update not allowed",code:"4052"})
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
  
  
    
   
    async store ({ request, response }) {
  
      const allowedMethod = await functionsDatabase.allowed(table,"create",request.userID,"");
  
      if(allowedMethod){
  
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list,["PR_DECISAO_TP_ID","DATA","REFERENCIA","DESPACHO","URL_DOC_GERADO","SELF_ID","REL_PESSOA_ENTIDADE_ID"])
        
        let data = request.only(extractRequest) 
  data.ESTADO = "1"
  data.CRIADO_POR = request.userID
  
        data.ID = await functionsDatabase.createID(table)
        data.DT_REGISTO = functionsDatabase.createDateNow(table)
        
        if(list.other.includes('CODIGO')===true) data.CODIGO = await functionsDatabase.createCODIGO(table)
        
        const validation = await functionsDatabase.validation(list,data,extractRequest,table);
  
  
  
        if (validation.status==='ok') {
  
          const lastelementx = await Database
          .table("sgigjreleventodespacho")
          .where('ENTIDADE_EVENTO_ID', data.ENTIDADE_EVENTO_ID)
          .limit(1)
  
          if(lastelementx.length>0) return response.status(400).json({status:"fail",entity:"sgigjreleventodespacho."+data.ENTIDADE_EVENTO_ID,message:"already exist REL_EVENTO_DESPACHO for this EVENTO",code:"8414"})
  
          else{
  
            data.REL_PESSOA_ENTIDADE_ID=request.userID
  
              const newE = await Database
              .table(table)
              .insert(data)
      
          
            
              if(newE[0]===0){
  
  
  
                var data2 = request.only("") 
  
                data2.REL_EVENTO_DESPACHO_ID=data.ID
  
  
      
                return (data)
  
  
              } 
      
              else return response.status(400).json({status:"fail",entity:"",message:"",code:""})
            
          }
  
  
         
      
        } else return response.status(400).json(validation)
  
        
      }
  
      else return response.status(400).json({status:"405Error",entity:table,message:"create not allwed",code:"4051"})
  
    }*/




}

module.exports = entity
