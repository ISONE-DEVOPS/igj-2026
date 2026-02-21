"use strict";

const controller = "Sgigjprocessoexclusao";
let Database = require("../../utils/DatabaseAuditoria");
Database = new Database();
const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);
const functionsDatabase = require("../functionsDatabase");
const pdfCreater = require("./pdfCreater");
const Env = use("Env");
var pdf = require("html-pdf");
const moment = require("moment");
const ModelInterveniente = use("App/Models/Sgigjrelinterveniente");
const DatabaseDB = use("Database");
const GlbnotificacaoFunctions = require("./GlbnotificacaoFunctions");

class entity {
  async store({ request, response }) {
    let allowedMethod = false;
    const tipo_req = request.only(["TIPO"]).TIPO;

    if (tipo_req == "C") {
      allowedMethod = await functionsDatabase.allowed(
        table,
        "Criar_C",
        request.userID,
        ""
      );
    }

    if (tipo_req == "N") {
      allowedMethod = await functionsDatabase.allowed(
        table,
        "Criar_N",
        request.userID,
        ""
      );
    }

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [
        "REL_PESSOA_ENTIDADE_REGISTO_ID",
        "URL_DOC_GERADO",
      ]);

      let data = request.only(extractRequest);

      data.ID = await functionsDatabase.createID(table);
      data.DT_REGISTO = functionsDatabase.createDateNow(table);
      data.ESTADO = "1";
      data.CRIADO_POR = request.userID;
      data.REF = await functionsDatabase.createREF("sgigjprocessoexclusao");

      if (list.other.includes("CODIGO") === true)
        data.CODIGO = await functionsDatabase.createCODIGO(table);

      const validation = await functionsDatabase.validation(
        list,
        data,
        extractRequest,
        table
      );

      if (validation.status === "ok") {
        if (!(data.TIPO == "C" || data.TIPO == "N")) {
          return response.status(400).json({
            status: "error",
            entity: "Sgigjprocessoexclusao",
            message: "TIPO should be 'C' or 'N'",
            code: "222342444",
          });
        }

        const data_PESSOAS = request.only(["PESSOAS"]);

        // if (!data_PESSOAS.hasOwnProperty('PESSOAS')) return response.status(400).json({ status: "error", entity: "Sgigjprocessoexclusao", message: "doesnt have PESSOAS", code: "53458834" })
        const PESSOAS = data_PESSOAS.PESSOAS;

        // if (PESSOAS.length < 1) return response.status(400).json({ status: "error", entity: "Sgigjprocessoexclusao", message: "doesnt have PESSOAS", code: "53458797834" })

        if (PESSOAS) {
          for (let index2 = 0; index2 < PESSOAS.length; index2++) {
            const element = PESSOAS[index2];
            const pessoa_exist = await functionsDatabase.existelement(
              "sgigjpessoa",
              element
            );
            if (!pessoa_exist)
              return response.status(400).json({
                status: "error",
                entity: "sgigjpessoa." + element,
                message: "doesnt exist",
                code: "534545645697834",
              });
          }
        }

        const newuser = await Database.table("glbuser")
          .where("ID", request.userID)
          .limit(1);

        data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID;
        if (data.hasOwnProperty("OBS")) {
          const pdftxt = {
            content: `
                <div style="width: 100%; height: 100%; zoom: ${Env.get("ZOOM_PDF", "")};">
                  <div style="margin-bottom: 30px;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
                  </div>
                  <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                    ${data?.OBS}
                  </div>
                  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                    <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                      Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                    </p>
                  </div>
                </div>
                `,
            tipo: "processoexclusao.pdf",
          };

          const pdfcreated = await pdfCreater(pdftxt);
          if (pdfcreated?.status == true) data.URL_DOC_GERADO = pdfcreated?.url;

        }

        const newE = await Database.table(table).insert(data);

        if (newE[0] === 0) {
          if (PESSOAS) {
            for (let index = 0; index < PESSOAS.length; index++) {
              const element = PESSOAS[index];
              let data2 = {
                PROCESSO_EXCLUSAO_ID: data.ID,
                PESSOA_ID: element,
                ESTADO: "1",
              };

              data2.ID = await functionsDatabase.createID(table);
              data2.DT_REGISTO = functionsDatabase.createDateNow(table);
              const newE2 = await Database.table(
                "sgigjrelinterveniente"
              ).insert(data2);
            }
          }

          if (data.ESTADO_DEPACHO_INICIAL && data.ESTADO_DEPACHO_INICIAL == "CONCLUIR") {
            const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID);
            const dataHoje = moment().format("DD/MM/YYYY HH:mm");
            const msgProcesso = `${nomeUtilizador} registrou um novo processo (Código: ${data.CODIGO}) em ${dataHoje}.${data.DESCR ? ` Descrição: ${data.DESCR}` : ''}`;

            const allPerfis = await DatabaseDB.table("glbperfil").where("ESTADO", 1);
            for (const perfil of allPerfis) {
              GlbnotificacaoFunctions.storeToPerfil({
                request,
                PERFIL_ID: perfil.ID,
                MSG: msgProcesso,
                TITULO: "Processo Registrado",
                PESSOA_ID: null,
                URL: `/processos/exclusaointerdicao`,
              });
            }
          }

          return data;
        } else
          return response
            .status(400)
            .json({ status: "fail", entity: "", message: "", code: "" });
      } else return response.status(400).json(validation);
    } else
      return response.status(400).json({
        status: "405Error",
        entity: table,
        message: "create not allwed",
        code: "4051",
      });
  }

  async update({ params, request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "update",
      request.userID,
      params.id
    );

    if (allowedMethod || true) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return {
          status: "erro",
          entity: table,
          message: "doesnt exist",
          code: 999,
        };
      else {
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, [
          "REL_PESSOA_ENTIDADE_REGISTO_ID",
          "URL_DOC_GERADO",
          "TIPO",
          "REF"
        ]);

        let data = request.only(extractRequest);
        const validation = await functionsDatabase.validation(
          list,
          data,
          extractRequest,
          table
        );

        if (validation.status === "ok") {
          const newE = await Database.table(table)
            .where("ID", "" + params.id)
            .userID(request.userID)
            .update(data);

          if (newE === 1) {
            if (data.ESTADO_DEPACHO_INICIAL && data.ESTADO_DEPACHO_INICIAL == "CONCLUIR") {
              const allPerfisUpd = await DatabaseDB.table("glbperfil").where("ESTADO", 1);
              for (const perfil of allPerfisUpd) {
                GlbnotificacaoFunctions.storeToPerfil({
                  request: null,
                  PERFIL_ID: perfil.ID,
                  MSG: `Foi registrado um processo com o código ${data.CODIGO}${data.DESCR ? ` e com a seguinte descrição: ${data.DESCR}` : ''}`,
                  TITULO: "Processo registrado",
                  PESSOA_ID: null,
                  URL: `entidades/entidades/detalhes/${data.ENTIDADE_ID}`,
                });
              }
            }

            return data;
          } else
            return response
              .status(400)
              .json({ status: "fail", entity: "", message: "", code: "" });
        } else return response.status(400).json(validation);
      }
    } else
      return response.status(405).json({
        status: "405 error",
        entity: table,
        message: "update not allowed",
        code: "4052",
      });
  }

  async destroy({ params, response, request }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "delete",
      request.userID,
      params.id
    );

    if (allowedMethod) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return response.status(400).json({
          status: "erro",
          entity: table,
          message: "doesnt exist",
          code: 999,
        });
      else {
        const newE = await Database.table(table)
          .where("ID", "" + params.id)
          .userID(request.userID)
          .update({
            ESTADO: 0,
            DELETADO_POR: request.userID,
            DELETADO_EM: functionsDatabase.createDateNow(table),
          });

        if (newE === 1) {
          return {
            status: "ok",
            entity: table + "." + params.id,
            message: "deleted",
            code: "888",
          };
        } else
          return response
            .status(400)
            .json({ status: "fail", entity: "", message: "", code: "" });
      }
    } else
      return response.status(405).json({
        status: "405Error",
        entity: table,
        message: "delete not allwed",
        code: "4053",
      });
  }

  async index({ request, response }) {
    try {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);

      var result = await Model.query()
        .select("sgigjprocessoexclusao.*")
        .with("criadoPor.sgigjrelpessoaentidade.sgigjpessoa")
        .with("sgigjentidade")
        .with("sgigjdespachofinal.sgigjprdecisaotp")
        .with("sgigjpessoa")
        .with("sgigjrelinterveniente.sgigjpessoa")
        .with(
          "sgigjrelcontraordenacaoinfracao.sgigjinfracaocoima.sgigjprinfracaotp"
        )
        .with("sgigjprorigemtp")
        .with("sgigjrelpessoaentidade", (builder) => {
          builder.with("sgigjpessoa").with("sgigjentidade");
        })
        .with("sgigjprocessodespacho.sgigjrelprocessoinstrutor", (builder) => {
          builder
            .with("sgigjrelpessoaentidade.sgigjpessoa")
            .with("sgigjrelprocessoinstrucao", (builder) => {
              builder
                .with("sgigjdespachointerrompido.sgigjreldocumento")
                .with("sgigjprocessodespacho.sgigjprexclusaoperiodo");
            });
        })
        .with("sgigjrelpessoaentidade", (builder) => {
          builder.with("sgigjpessoa").with("sgigjentidade");
        })
        .where(data)
        .where("ESTADO", 1)
        .orderBy("sgigjprocessoexclusao.DT_REGISTO", "desc")
        .fetch();

      return result;
    } else
      return response.status(405).json({
        status: "405Error",
        entity: table,
        message: "index not allwed",
        code: "4054",
      });
    } catch (err) {
      console.error("ERRO index sgigjprocessoexclusao:", err.message, err.stack);
      return response.status(500).json({ status: "error", message: err.message, code: err.code });
    }
  }

  async show({ params, response, request }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "show",
      request.userID,
      params.id
    );

    if (allowedMethod) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return response.status(400).json({
          status: "erro",
          entity: table,
          message: "doesnt exist",
          code: 999,
        });
      else {
        return await Model.query()
          .with("sgigjentidade")
          .with("criadoPor.sgigjrelpessoaentidade.sgigjpessoa")
          .with("sgigjdespachofinal.sgigjprdecisaotp")
          .with(
            "sgigjrelcontraordenacaoinfracao.sgigjinfracaocoima.sgigjprinfracaotp"
          )
          .with("sgigjrelinterveniente.sgigjpessoa.nacionalidade")
          .with("sgigjpessoa.nacionalidade")
          .with("sgigjprorigemtp")
          .with("sgigjrelpessoaentidade", (builder) => {
            builder.with("sgigjpessoa").with("sgigjentidade");
          })
          .with(
            "sgigjprocessodespacho.sgigjrelprocessoinstrutor",
            (builder) => {
              builder
                .with("sgigjrelpessoaentidade.sgigjpessoa")
                .with("sgigjrelprocessoinstrucao", (builder) => {
                  builder
                    .with("sgigjdespachointerrompido.sgigjreldocumento")
                    .with("sgigjprocessodespacho", (builder) => {
                      builder
                        .with("sgigjprdecisaotp")
                        .with("sgigjprexclusaoperiodo");
                    })
                    .with("sgigjrelinstrutorpeca", (builder) => {
                      builder
                        .with("sgigjprpecasprocessual")
                        .with("sgigjreldocumento.sgigjprdocumentotp");
                    });
                });
            }
          )
          .with("notificacao", (builder) => {
            builder
              .with("visados.sgigjrelinterveniente.sgigjpessoa")
              .with("sgigjreldocumento.sgigjprdocumentotp");
          })
          .with("decisaoTutelar.sgigjreldocumento.sgigjprdocumentotp")
          .with("decisaoTribunal.sgigjreldocumento.sgigjprdocumentotp")
          .where("ID", "" + params.id)
          .fetch();
      }
    } else
      return response.status(405).json({
        status: "405Error",
        entity: table,
        message: "show not allwed",
        code: "4056",
      });
  }

  async getInterveniente(params, response, request) {
    request = params.request;
    params = params.params;
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "show",
      request.userID,
      params.id
    );

    if (true) {
      const element = await functionsDatabase.existelement(table, params.id);

      if (element === false)
        return response.status(400).json({
          status: "erro",
          entity: table,
          message: "doesnt exist",
          code: 999,
        });
      else {
        return await ModelInterveniente.query()
          .with("sgigjpessoa.nacionalidade")
          .where("PROCESSO_EXCLUSAO_ID", "" + params.id)
          .fetch();
      }
    } else
      return response.status(405).json({
        status: "405Error",
        entity: table,
        message: "show not allwed",
        code: "4056",
      });
  }

  async exportPdf({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "export-pdf",
      request.userID,
      ""
    );
    if (allowedMethod || true) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);

      var result = await Model.query()
        .select("sgigjprocessoexclusao.*")
        .with("sgigjentidade")
        .with("sgigjdespachofinal.sgigjprdecisaotp")
        .with("sgigjpessoa")
        .with("sgigjrelinterveniente.sgigjpessoa")
        .with(
          "sgigjrelcontraordenacaoinfracao.sgigjinfracaocoima.sgigjprinfracaotp"
        )
        .with("sgigjprorigemtp")
        .with("sgigjrelpessoaentidade", (builder) => {
          builder.with("sgigjpessoa").with("sgigjentidade");
        })
        .with("sgigjprocessodespacho.sgigjrelprocessoinstrutor", (builder) => {
          builder
            .with("sgigjrelpessoaentidade.sgigjpessoa")
            .with("sgigjrelprocessoinstrucao", (builder) => {
              builder
                .with("sgigjdespachointerrompido.sgigjreldocumento")
                .with("sgigjprocessodespacho.sgigjprexclusaoperiodo");
            });
        })
        .with("sgigjrelpessoaentidade", (builder) => {
          builder.with("sgigjpessoa").with("sgigjentidade");
        })
        .where(data)
        .orderBy("sgigjprocessoexclusao.DT_REGISTO", "desc")
        .fetch();

      result = result.toJSON();

      let logo =
        "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0";

      const content = `<div style="width: 100%; font-family: 'Times New Roman', serif;">
            <div style="margin-bottom: 30px;">
                <img src="${logo}" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
            </div>
            <div style="padding: 0 40px;">
              <h2 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center;">Processo Exclusão</h2>

              <table style="border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 8pt; width: 100%;">
                <thead style="background-color:#2b7fb9;color:#fff">
                  <tr>
                     <th style="text-align: center; padding: 4px;">EST</th>
                     <th style="text-align: center; padding: 4px;">Código</th>
                     <th style="text-align: center; padding: 4px;">Despacho</th>
                     <th style="text-align: center; padding: 4px;">Entidade Decisora</th>
                     <th style="text-align: center; padding: 4px;">Pessoa</th>
                     <th style="text-align: center; padding: 4px;">Visado</th>
                     <th style="text-align: center; padding: 4px;">Data</th>
                  </tr>
                </thead>
                <tbody>
                  ${(function () {
                    let tbody = "";
                    for (let index = 0; index < result.length; index++) {
                      const element = result[index];
                      tbody =
                        tbody +
                        `<tr style="background-color:${index % 2 == 0 ? '#f5f5f5' : '#fff'};color:#000">
          <td style="padding: 3px;"> </td>
          <td style="padding: 3px;"> ${element.CODIGO}</td>
          <td style="padding: 3px;"> ${element.sgigjprocessodespacho.length > 0 ? element.sgigjprocessodespacho[0].DESIG : ""}</td>
          <td style="padding: 3px;"> ${element.sgigjentidade ? element.sgigjentidade.DESIG : ""}</td>
          <td style="padding: 3px;"> ${element.sgigjrelpessoaentidade ? element.sgigjrelpessoaentidade.sgigjpessoa.NOME : ""}</td>
          <td style="padding: 3px;"> ${element.FLAG_RECLAMACAO_VISADO}</td>
          <td style="padding: 3px;"> ${moment(element.DATA).format("DD-MM-Y")}</td>
          </tr>`;
                    }
                    return tbody;
                  })()}
                </tbody>
              </table>
            </div>
            <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
              <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
              </p>
            </div>
        </div>`;

      await Database.table(table).userID(request.userID).registerExport("PDF");
      response.header("Content-type", "application/pdf");
      response.header(
        "Content-Disposition",
        'attachment; filename="processo_autoexclusao.pdf"'
      );
      return response.send(await this.toPdf(content));
    } else
      return response.status(405).json({
        status: "405Error",
        entity: table,
        message: "index not allwed",
        code: "4054",
      });
  }

  async exportCsv({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "export-pdf",
      request.userID,
      ""
    );
    if (allowedMethod || true) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);

      var result = await Model.query()
        .select("sgigjprocessoexclusao.*")
        .with("sgigjentidade")
        .with("sgigjdespachofinal.sgigjprdecisaotp")
        .with("sgigjpessoa")
        .with("sgigjrelinterveniente.sgigjpessoa")
        .with(
          "sgigjrelcontraordenacaoinfracao.sgigjinfracaocoima.sgigjprinfracaotp"
        )
        .with("sgigjprorigemtp")
        .with("sgigjrelpessoaentidade", (builder) => {
          builder.with("sgigjpessoa").with("sgigjentidade");
        })
        .with("sgigjprocessodespacho.sgigjrelprocessoinstrutor", (builder) => {
          builder
            .with("sgigjrelpessoaentidade.sgigjpessoa")
            .with("sgigjrelprocessoinstrucao", (builder) => {
              builder
                .with("sgigjdespachointerrompido.sgigjreldocumento")
                .with("sgigjprocessodespacho.sgigjprexclusaoperiodo");
            });
        })
        .with("sgigjrelpessoaentidade", (builder) => {
          builder.with("sgigjpessoa").with("sgigjentidade");
        })
        .where(data)
        .orderBy("sgigjprocessoexclusao.DT_REGISTO", "desc")
        .fetch();

      result = result.toJSON();

      let dataResult = [];
      for (let index = 0; index < result.length; index++) {
        let element = result[index];
        dataResult.push({
          EST: "",
          Código: element.CODIGO,
          Despacho:
            element.sgigjprocessodespacho.length > 0
              ? element.sgigjprocessodespacho[0].DESIG
              : "",
          "Entidade Decisora": element.sgigjentidade
            ? element.sgigjentidade.DESIG
            : "",
          Pessoa: element.sgigjrelpessoaentidade.sgigjpessoa.NOME,
          Visado: element.FLAG_RECLAMACAO_VISADO,
          Data: moment(element.DATA).format("DD-MM-Y"),
        });
      }

      let dataCsv = this.toCsv(dataResult);

      await Database.table(table).userID(request.userID).registerExport("CSV");
      response.header("Content-type", "text/csv");
      response.header(
        "Content-Disposition",
        'attachment; filename="processo_autoexclusao.csv"'
      );
      return response.send(dataCsv);
    } else
      return response.status(405).json({
        status: "405Error",
        entity: table,
        message: "index not allwed",
        code: "4054",
      });
  }

  toCsv(data, hasHeader = true) {
    if (data.length == 0) {
      return "";
    }

    let header = hasHeader ? Object.keys(data[0]).join(",") + "\r\n" : "";
    let body = "";

    data.forEach((element) => {
      body += Object.values(element).join(",") + "\r\n";
    });

    return header + body;
  }

  async toPdf(content) {
    const pdfCreater = async (data) => {
      let promise = new Promise((resolve, reject) => {
        pdf
          .create(data, { format: "A4", border: "0", type: "pdf" })
          .toBuffer(function (err, buffer) {
            if (err) {
              reject(err);
            }
            resolve(buffer);
          });
      });
      return promise;
    };
    let buffer = await pdfCreater(content);
    return buffer;
  }
}

module.exports = entity;
