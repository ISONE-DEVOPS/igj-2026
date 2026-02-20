"use strict";

const controller = "Sgigjdespachofinal";
const DatabaseDB = use("Database");
let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);

const functionsDatabase = require("../../functionsDatabase");
const GlbnotificacaoFunctions = use('App/Controllers/Http/GlbnotificacaoFunctions');

const pdfCreater = require("../pdfCreater");

const Env = use("Env");
const moment = require("moment");

const newlist = {
  data: [
    {
      name: "DESPACHO",
      size: "64000",
      type: "Text",
      notNullable: false,
    },

    {
      name: "OBS",
      size: "64000",
      type: "Text",
      notNullable: false,
    },

    {
      name: "REFERENCIA",
      size: "15",
      type: "Text",
      notNullable: true,
    },

    {
      name: "PRAZO",
      size: "11",
      type: "Text",
      notNullable: false,
    },

    {
      name: "DATA",
      size: 1.7976931348623157e308,
      type: "Date",
      notNullable: true,
    },

    {
      name: "COIMA",
      size: 11,
      type: "Number",
      notNullable: false,
    },
  ],

  key: [
    {
      name: "PR_DECISAO_TP_ID",
      table: "sgigjprdecisaotp",
      notNullable: true,
    },

    {
      name: "INFRACAO_COIMA_ID",
      table: "sgigjinfracaocoima",
      notNullable: false,
    },
  ],

  other: ["CODIGO"],
};

const store = async ({ params, request, response }) => {
  const allowedMethod = await functionsDatabase.allowed(
    "sgigjprocessoexclusao",
    "DespachoFinal",
    request.userID,
    ""
  );

  if (allowedMethod) {
    const list = await functionsDatabase.DBMaker(table);

    const extractRequest = functionsDatabase.extractRequest(newlist, []);

    let data = request.only(extractRequest);

    const existelement = await functionsDatabase.existelement(
      "sgigjprocessoexclusao",
      params.id
    );

    if (!existelement)
      return response
        .status(400)
        .json({
          status: "error",
          entity: "sgigjprocessoexclusao",
          message: "doesnt exist." + params.id,
          code: 6756,
        });

    const validation = await functionsDatabase.validation(
      newlist,
      data,
      extractRequest,
      table
    );

    if (validation.status === "ok") {
      data.ESTADO = "1";
      data.PROCESSO_EXCLUSAO_ID = params.id;
      data.CRIADO_POR = request.userID

      const request_TIPO = request.only(["TIPO"]).TIPO;

      if (request_TIPO == "CONCLUIR") {
        const pdftxt = {
          content: `
            <div style="width: 100%; height: 100%; zoom: ${Env.get(
            "ZOOM_PDF",
            ""
          )};">
    
                <div style=" margin-bottom: 96px; ">
        
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="Paris" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 40px;">

                </div>    


                <div style=" min-height: 1190px; padding-right: 96px; padding-left: 96px;">              
                  ${data?.DESPACHO}  
                </div>


              <div >

                  <p class="MsoNormal" align="center" style=" margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">_______________________________________________________________________________________</p><p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 12px;">Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                  - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span></p>
                  
              </div>
          
          </div>
              
            `,
          tipo: "despacho_despachofinal.pdf",
        };

        const pdfcreated = await pdfCreater(pdftxt);

        if (pdfcreated?.status == true) data.URL_DOC_GERADO = pdfcreated?.url;

        console.log(data);
      }

      const newuser = await DatabaseDB.table("glbuser")
        .where("ID", request.userID)
        .limit(1);

      data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID;

      const newitem = await DatabaseDB.table("sgigjdespachofinal")
        .where("PROCESSO_EXCLUSAO_ID", data.PROCESSO_EXCLUSAO_ID)
        .limit(1);

      if (newitem.length > 0) {
        delete data.PROCESSO_EXCLUSAO_ID;

        const newE = await Database.table("sgigjdespachofinal")
          .where("ID", "" + newitem[0].ID)
          .userID(request.userID)
          .update(data);

        if (newE === 1) {
          if (request_TIPO == "CONCLUIR") {
            const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
            const dataHoje = moment().format("DD/MM/YYYY HH:mm")

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
              MSG: `${nomeUtilizador} atualizou o despacho final do processo (Código: ${newitem[0].CODIGO}) em ${dataHoje}. Referência: ${data.REFERENCIA || ''}.`,
              TITULO: "Despacho Final",
              PESSOA_ID: null,
              URL: `/processos/exclusaointerdicao`
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request,
              PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
              MSG: `${nomeUtilizador} atualizou o despacho final do processo (Código: ${newitem[0].CODIGO}) em ${dataHoje}. Referência: ${data.REFERENCIA || ''}.`,
              TITULO: "Despacho Final",
              PESSOA_ID: null,
              URL: `/processos/exclusaointerdicao`
            })
          }
          return data;
        } else
          return response
            .status(400)
            .json({ status: "fail", entity: "", message: "", code: "" });
      }

      data.ID = await functionsDatabase.createID(table);
      data.DT_REGISTO = functionsDatabase.createDateNow(table);

      if (list.other.includes("CODIGO") === true)
        data.CODIGO = await functionsDatabase.createCODIGO(table);

      
      const newE = await DatabaseDB.table(table).insert(data);

      if (newE && newE[0] === 0) {
        if (request_TIPO == "CONCLUIR") {
          const nomeUtilizador2 = await functionsDatabase.userIDToNome(request.userID)
          const dataHoje2 = moment().format("DD/MM/YYYY HH:mm")

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR_GERAL", "85c24ffab0137705617aa94b250866471dc2"),
            MSG: `${nomeUtilizador2} registrou um despacho final no processo (Código: ${data.CODIGO}) em ${dataHoje2}. Referência: ${data.REFERENCIA || ''}.`,
            TITULO: "Despacho Final",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: Env.get("PERFIL_INSPECTOR", "f8382845e6dad3fb2d2e14aa45b14f0f85de"),
            MSG: `${nomeUtilizador2} registrou um despacho final no processo (Código: ${data.CODIGO}) em ${dataHoje2}. Referência: ${data.REFERENCIA || ''}.`,
            TITULO: "Despacho Final",
            PESSOA_ID: null,
            URL: `/processos/exclusaointerdicao`
          })
        }
        return data;
      } else
        return response
          .status(400)
          .json({ status: "fail", entity: "", message: "", code: "" });
    } else return response.status(400).json(validation);
  } else
    return response
      .status(400)
      .json({
        status: "405Error",
        entity: table,
        message: "create not allwed",
        code: "4051",
      });
};

module.exports = store;
