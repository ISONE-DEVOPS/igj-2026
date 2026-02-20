'use strict'

const controller = "Sgigjrelinstrutorpeca";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');
const pdfCreater = require('./pdfCreater');
const Sgigjrelprocessoinstrucao = use('App/Models/Sgigjrelprocessoinstrucao');
const Env = use('Env')
const GlbnotificacaoFunctions = use('App/Controllers/Http/GlbnotificacaoFunctions');

class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])

      let data = request.only(extractRequest)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

        
      const validation = await functionsDatabase.validation(list, data, extractRequest, table);
      
      // const find_processoisntrucao = await Sgigjrelprocessoinstrucao
      // .query()
      // .with('sgigjrelinstrutorpeca.sgigjprpecasprocessual')
      // .where('ID', '' + data.REL_PROCESSO_INSTRUCAO_ID)
      // .fetch()
      // return find_processoisntrucao

      if (validation.status === 'ok') {


        



        const find_processoisntrucao = await Sgigjrelprocessoinstrucao
          .query()
          .with('sgigjrelinstrutorpeca.sgigjprpecasprocessual')
          .with('sgigjprocessodespacho')
          .where('ID', '' + data.REL_PROCESSO_INSTRUCAO_ID)
          .fetch()

        const instrucaopecas = find_processoisntrucao.rows[0].$relations.sgigjrelinstrutorpeca.rows

        /*
        
                if(data.PR_PECAS_PROCESSUAIS_ID==Env.get('PECAPROCESSUAL_RELATORIOFINAL_ID',"")) {
        
                  const newdata = request.only(['PR_DECISAO_TP_ID'])
                  
        
                  if(!newdata.hasOwnProperty('PR_DECISAO_TP_ID')) {
        
        
                    return response.status(400).json({status:"error",entity:"Sgigjrelinstrutorpeca",message:"PR_DECISAO_TP_ID is required ",code:"64564"})
                  
        
                  } 
        
                  data.PR_DECISAO_TP_ID = newdata.PR_DECISAO_TP_ID
        
                }
        */



        if (data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "")) {

          if (data.hasOwnProperty('FLAG_NOTA_COMUNICACAO')) {

            if (data.FLAG_NOTA_COMUNICACAO != "1" && data.FLAG_NOTA_COMUNICACAO != "2" && data.FLAG_NOTA_COMUNICACAO != "3") {

              return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "FLAG_NOTA_COMUNICACAO is required ('1','2','3') ", code: "43534534901211" })

            }

          } else return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "FLAG_NOTA_COMUNICACAO is required", code: "43534534901211" })


        }





        for (let index = 0; index < instrucaopecas.length; index++) {

          const element = instrucaopecas[index];
          const peca = element.$relations.sgigjprpecasprocessual.$attributes;
          const instrucao_peca = element.$attributes;


          if (peca.ID == Env.get('PECAPROCESSUAL_RELATORIOFINAL_ID', "") && data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_RELATORIOFINAL_ID', "")) {

            return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "this instrucao already has RELATORIOFINAL", code: "4353454441211" })

          }



          if (peca.ID == Env.get('PECAPROCESSUAL_RECLAMACAOVISADO_ID', "") && data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_RECLAMACAOVISADO_ID', "")) {


            return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "this instrucao already has RECLAMACAOVISADO", code: "4352224901211" })

          }


          if (peca.ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "") && data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "")) {

            if (instrucao_peca.FLAG_NOTA_COMUNICACAO == data.FLAG_NOTA_COMUNICACAO) {

              return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "this instrucao already has NOTACOMUNICACAO." + data.FLAG_NOTA_COMUNICACAO, code: "4224534901211" })

            }


          }


        }





        const newE = await Database
          .table(table)
          .insert(data)



        if (newE[0] === 0) {
          if (data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "")) {

            let CODIGO = find_processoisntrucao.rows[0].$relations.sgigjprocessodespacho.rows[0]?.CODIGO || ''
            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: `Uma nota de comunicação foi emitida do processo com o codigo ${CODIGO}, tens 10 dias para concluir a instrução`,
              TITULO: "Nota de comunicação",
              PESSOA_ID: null,
              URL: ``
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector
              MSG: `Uma nota de comunicação foi emitida do processo com o codigo ${CODIGO}, tens 10 dias para concluir a instrução`,
              TITULO: "Nota de comunicação",
              PESSOA_ID: null,
              URL: ``
            })
          }

          if (data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_RELATORIOFINAL_ID', "")) {

            let CODIGO = find_processoisntrucao.rows[0].$relations.sgigjprocessodespacho.rows[0]?.CODIGO || ''
            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: `Introdução do Relatório Final pela Instrutora do Processo`,
              TITULO: "Relatório Final",
              PESSOA_ID: null,
              URL: ``
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector
              MSG: `Introdução do Relatório Final pela Instrutora do Processo`,
              TITULO: "Relatório Final",
              PESSOA_ID: null,
              URL: ``
            })
          }
          
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      } else return response.status(400).json(validation)


    }

    else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

  }

  async update({ params, request, response }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {





        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, [])

        let data = request.only(extractRequest)
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);



        if (validation.status === 'ok') {


          const find_processoisntrucao = await Sgigjrelprocessoinstrucao
            .query()
            .with('sgigjrelinstrutorpeca.sgigjprpecasprocessual')
            .where('ID', '' + data.REL_PROCESSO_INSTRUCAO_ID)
            .fetch()

          const instrucaopecas = find_processoisntrucao.rows[0].$relations.sgigjrelinstrutorpeca.rows

          if (find_processoisntrucao.rows[0].$attributes.RELATORIO_FINAL != null) {


            return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "this instrucao is closed", code: "43534534901211" })


          }



          delete data.REL_PROCESSO_INSTRUCAO_ID
          delete data.PR_PECAS_PROCESSUAIS_ID




          for (let index = 0; index < instrucaopecas.length; index++) {

            const element = instrucaopecas[index];
            const peca = element.$relations.sgigjprpecasprocessual.$attributes;
            const instrucao_peca = element.$attributes;




            if (data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "")) {

              if (data.hasOwnProperty('FLAG_NOTA_COMUNICACAO')) {

                if (data.FLAG_NOTA_COMUNICACAO != "1" && data.FLAG_NOTA_COMUNICACAO != "2" && data.FLAG_NOTA_COMUNICACAO != "3") {

                  return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "FLAG_NOTA_COMUNICACAO is required ('1','2','3') ", code: "43534534901211" })

                }

              } else return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "FLAG_NOTA_COMUNICACAO is required", code: "43534534901211" })


            }




            /*
                      if(data.PR_PECAS_PROCESSUAIS_ID==Env.get('PECAPROCESSUAL_RELATORIOFINAL_ID',"")) {
            
                        const newdata = request.only(['PR_DECISAO_TP_ID'])
                      
            
                        if(!newdata.hasOwnProperty('PR_DECISAO_TP_ID')) {
              
              
                          return response.status(400).json({status:"error",entity:"Sgigjrelinstrutorpeca",message:"PR_DECISAO_TP_ID is required ",code:"64564"})
                        
              
                        } 
              
                        data.PR_DECISAO_TP_ID = newdata.PR_DECISAO_TP_ID
            
                        
              
              
                      }
            
            */


            if (peca.ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "") && data.PR_PECAS_PROCESSUAIS_ID == Env.get('PECAPROCESSUAL_NOTACOMUNICACAO_ID', "")) {

              if (instrucao_peca.FLAG_NOTA_COMUNICACAO == data.FLAG_NOTA_COMUNICACAO) {

                if (params.id != instrucao_peca.ID) {

                  return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "this instrucao already has NOTACOMUNICACAO." + data.FLAG_NOTA_COMUNICACAO, code: "4224534901211" })

                }

              }


            }


          }




          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)


          if (newE === 1) {
            return (data)
          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

        } else return response.status(400).json(validation)


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })

  }

  async destroy({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        const newE = await Database
          .table(table)
          .where('ID', '' + params.id)
          .update({
            "ESTADO": 0,
            "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table)
          })


        if (newE === 1) {
          return { status: "ok", entity: table + "." + params.id, message: "deleted", code: "888" }
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "delete not allwed", code: "4053" })

  }

  async index({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model
        .query()
        .with("sgigjprpecasprocessual")
        .with('sgigjreldocumento.sgigjprdocumentotp')
        .where(data)
        .where('ESTADO', 1)
        .orderBy('DT_REGISTO', 'desc')
        .fetch()


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
          .with("sgigjprpecasprocessual")
          .with('sgigjreldocumento.sgigjprdocumentotp')
          .where('ID', '' + params.id)
          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }

  async pdf({ params, request, response }) {

    const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {



        var find_instrucaopecas = await Model
          .query()
          .with("sgigjrelprocessoinstrucao")
          .where({
            ID: "" + params.id
          })
          .fetch()


        const instrucaopecas = find_instrucaopecas.rows[0].$attributes
        const instrucao = find_instrucaopecas.rows[0].$relations.sgigjrelprocessoinstrucao.$attributes



        if (instrucao.RELATORIO_FINAL != null) {

          return response.status(400).json({ status: "error", entity: "Sgigjrelinstrutorpeca", message: "this instrucao is closed", code: "43534534901211" })

        }





        let data = {}



        const pdftxt = {
          content:
            `
            <div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', "")};">
    
                <div style=" margin-bottom: 96px; ">
        
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="Paris" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 40px;">

                </div>    


                <div style=" min-height: 1190px; padding-right: 96px; padding-left: 96px;">              
                  ${instrucaopecas?.OBS}  
                </div>


              <div >

                  <p class="MsoNormal" align="center" style=" margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">_______________________________________________________________________________________</p><p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 12px;">Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                  - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span></p>
                  
              </div>
          
          </div>
              
            `,
          tipo: "pecasinstrucao.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)

        if (pdfcreated?.status == true) data.URL_DOC = pdfcreated?.url
        else {

          response.status(400).json({ status: "fail", entity: "", message: "creating pdf", code: "" })

        }












        const newE = await Database
          .table(table)
          .where('ID', '' + params.id)
          .userID(request.userID)
          .update(data)


        if (newE === 1) {
          data.ID = params.id
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })



      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })

  }

}


module.exports = entity
