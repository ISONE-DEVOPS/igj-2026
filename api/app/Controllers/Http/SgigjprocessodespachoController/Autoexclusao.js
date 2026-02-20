'use strict'

const controller = "Sgigjprocessodespacho";



let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const Sgigjrelpessoaentidade = use('App/Models/Sgigjrelpessoaentidade');
const User = use('App/Models/Glbuser');


const { find } = require('@adonisjs/framework/src/Route/Store');
const functionsDatabase = require('../../functionsDatabase');
const GlbnotificacaoFunctions = require('../GlbnotificacaoFunctions');

const pdfCreater = require('../pdfCreater');

const Env = use('Env')


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
      name: 'DATA',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: true
    },
    {
      name: 'DATA_INICIO',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: true
    },
    {
      name: 'DATA_FIM',
      size: 1.7976931348623157e+308,
      type: 'Date',
      notNullable: true
    },
    {
      name: 'TIPO',
      size: "64000",
      type: 'Text',
      notNullable: true
    },


  ],

  key: [


    {
      name: 'PR_DECISAO_TP_ID',
      table: 'sgigjprdecisaotp',
      notNullable: true
    },
    {
      name: 'PR_EXCLUSAO_PERIODO_ID',
      table: 'sgigjprexclusaoperiodo',
      notNullable: true
    }

  ],

  other: ['CODIGO']

}








const store = async ({ params, request, response, auth }) => {

  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoautoexclusao", "Despacho", request.userID, "");

  let user = await User.query().where("glbuser.ID", request.userID).first()
  let nameUser = ""
  if (user) {
    let Pessoa = await Sgigjrelpessoaentidade.query().with("sgigjpessoa").where("sgigjrelpessoaentidade.ID", user.REL_PESSOA_ENTIDADE_ID).first()
    nameUser = Pessoa ? Pessoa.$relations.sgigjpessoa.$attributes.NOME : ""
  }


  if (allowedMethod) {

    const list = await functionsDatabase.DBMaker(table);

    const extractRequest = functionsDatabase.extractRequest(newlist, [])

    let data = request.only(extractRequest)
    data.CRIADO_POR = request.userID




    //      const existelement = await functionsDatabase.existelement("sgigjprocessoexclusao",params.id)
    const existelement = await functionsDatabase.existelement("sgigjprocessoautoexclusao", params.id)

    // if(!existelement)  return  response.status(400).json({status:"error",entity:"sgigjprocessoexclusao",message:"doesnt exist."+params.id,code:6756})
    if (!existelement) return response.status(400).json({ status: "error", entity: "sgigjprocessoautoexclusao", message: "doesnt exist." + params.id, code: 6756 })







    const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);



    if (validation.status === 'ok') {


      data.ESTADO = "1"
      data.PROCESSO_AUTOEXCLUSAO_ID = params.id

      const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-5196577213986346-AssinaturaInspetorGeral1removebgpreview.png?alt=media&token=0"
      const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
      const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"
      const assinaturaIGJ = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/594080509403780-assinaturaIGJ1.png?alt=media&token=0"

      const request_TIPO = request.only(['TIPO']).TIPO

      if (request_TIPO == "CONCLUIR") {
        let despacho = data?.DESPACHO
        if (despacho) {
          despacho = despacho.replace(/font-size: 21px;/gm, "font-size: 9pt;")
          despacho = despacho.replace(/font-size: 13px;/gm, "font-size: 5pt;")
          despacho = despacho.replace(/font-size: 32px;/gm, "font-size: 15px;")
          despacho = despacho.replace(/&nbsp;&nbsp;&nbsp;/gm, "")
          despacho = despacho.replace(/text-indent: -24px;/gm, "text-indent: -12px;")
          despacho = despacho.replace(/text-indent: -20px;/gm, "text-indent: -17px;")
          despacho = despacho.replace(/margin: 0in 0in 0in 65px;/gm, "margin: 0in 0in 0in 35px;")
          despacho = despacho.replace(/margin: 0in 17px 0in 0in;/gm, "margin: 0in 0px 0in 0in;")
        }


        const pdftxt = {
          content:
            `<div>
            <div style="width: 95%;">
                <div style="padding-right: 40px; padding-left: 40px;padding-top: 20px;">
    
                    <div style=" margin-bottom: 40px; ">
    
                        <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"
                            alt="Paris" style="width: 100%;">
    
                    </div>
    
    
                    <div style="font-size:5px !important;text-align: justify !important;font-family: 'Times New Roman&quot' !important;">
                        ${despacho}
                    </div>
                </div>
    
            </div>
    
            <div
                style="font-size: 9pt; line-height: 106%; font-family: 'Times New Roman';text-align: center;margin-top: 50px;position: relative;">
                <span>
                    <p>Inspetor Geral</p>
                    ${(function () {
                      if(user && user.ASSINATURA_URL){
                        return `<img src="${user.ASSINATURA_URL}?alt=media&token=0" width="250" height="100" style="position: absolute;top: -30px;left: 35%;">`
                      }
                      return ''
                    })()}
                    <p>_________________________________</p>
                    <p>${nameUser}</p>
                    <img src="${assinaturaIGJ}" width="100" height="100">
                </span>
            </div>
    

            <div style="position: absolute;left: 28px;width: 90%;bottom: 0px;">
        
                <p class="MsoNormal" align="center"
                    style="font-size: 7px; font-family: Calibri, sans-serif; text-align: center;background-color: #5B9BD5;padding: 4px 5px;color: white;font-style: italic;">
                    <span>Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                        - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span>
                </p>

            </div>
    
            <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height:100%">
            <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
        </div>`,
          tipo: "despachoAutoExclusao.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)

        if (pdfcreated?.status == true) data.URL_DOC_GERADO = pdfcreated?.url




      }

      let autoExclusao = await Database.table("sgigjprocessoautoexclusao").where('ID', data.PROCESSO_AUTOEXCLUSAO_ID)
        .limit(1)
      let userIdRegister = null
      let idUserPessoa = null



      //let user = await User.query().where("glbuser.ID", auth._ctx.request.userID).first()
      if (user) {
        let Pessoa = await Sgigjrelpessoaentidade.query().with("sgigjpessoa").where("sgigjrelpessoaentidade.ID", user.REL_PESSOA_ENTIDADE_ID).first()
        idUserPessoa = Pessoa ? Pessoa.$relations.sgigjpessoa.$attributes.ID : null
      }

      if (autoExclusao.length > 0) {

        let userRegster = await Database.table("glbuser").where('REL_PESSOA_ENTIDADE_ID', autoExclusao[0].REL_PESSOA_ENTIDADE_REGISTO_ID).limit(1)

        if (userRegster.length > 0) {
          userIdRegister = userRegster[0].ID
        }

      }

      const newuser = await Database
        .table("glbuser")
        .where('ID', request.userID)
        .limit(1)


      data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID


      const newitem = await Database
        .table("sgigjprocessodespacho")
        .where('PROCESSO_AUTOEXCLUSAO_ID', data.PROCESSO_AUTOEXCLUSAO_ID)
        .limit(1)


      if (newitem.length > 0) {

        delete data.PROCESSO_EXCLUSAO_ID


        const newE = await Database
          .table("sgigjprocessodespacho")
          .where('ID', '' + newitem[0].ID)
          .userID(request.userID)
          .update(data)



        if (newE === 1) {




          if (data.TIPO == "CONCLUIR") {
            GlbnotificacaoFunctions.storeToUser({
              request,
              USER_ID: userIdRegister,
              MSG: `Um processo de auto exclusão com o codigo ${autoExclusao[0].CODIGO} foi despachado`,
              TITULO: "Depacho de Auto Exclusão",
              PESSOA_ID: idUserPessoa,
              URL: "/processos/autoexclusao"
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: `Um processo de auto exclusão com o codigo ${autoExclusao[0].CODIGO} foi despachado`,
              TITULO: "Depacho de Auto Exclusão",
              PESSOA_ID: idUserPessoa,
              URL: "/processos/autoexclusao",
              EXTRA: JSON.stringify({
                IdAutoexclusao: params.id
              })
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector Normal
              MSG: `Um processo de auto exclusão com o codigo ${autoExclusao[0].CODIGO} foi despachado`,
              TITULO: "Depacho de Auto Exclusão",
              PESSOA_ID: idUserPessoa,
              URL: "/processos/autoexclusao",
              EXTRA: JSON.stringify({
                IdAutoexclusao: params.id
              })
            })
          }

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

        if (data.TIPO == "CONCLUIR") {
          GlbnotificacaoFunctions.storeToUser({
            request,
            USER_ID: userIdRegister,
            MSG: `Foi concluído o despacho do processo de autoexclusão com o código ${autoExclusao[0].CODIGO}`,
            TITULO: "Depacho de Autoexclusão",
            PESSOA_ID: idUserPessoa,
            URL: "/processos/autoexclusao"
          })
        }
        return (data)
      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

    } else return response.status(400).json(validation)


  }

  else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

}






module.exports = store
