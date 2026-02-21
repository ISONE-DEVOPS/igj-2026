"use strict";

const controller = "Sgigjprocessoautoexclusao";

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);
const GlbnotificacaoFunctions = require('./GlbnotificacaoFunctions');
const User = use('App/Models/Glbuser');
const Sgigjrelpessoaentidade = use('App/Models/Sgigjrelpessoaentidade');
const moment = require("moment");

const functionsDatabase = require("../functionsDatabase");
var pdf = require('html-pdf');
const pdfCreater = async (data) => {

  let promise = new Promise((resolve, reject) => {

    pdf.create(data, { "format": "A4", "border": { "top": "15mm", "right": "15mm", "bottom": "15mm", "left": "15mm" }, "type": "pdf" }).toBuffer(function (err, buffer) {
      if (err) {
        reject(err)
      }
      resolve(buffer)

    })


  })
  return promise
}



class entity {
  async store({ request, response, auth }) {
    const allowedMethod =  functionsDatabase.allowed(
      table,
      "create",
      request.userID,
      ""
    );

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      let extractRequest = functionsDatabase.extractRequest(list, [
        "REL_PESSOA_ENTIDADE_REGISTO_ID",
      ]);
      extractRequest.push("ENTIDADE_ID")
      let data = request.only(extractRequest);

      data.ID = await functionsDatabase.createID(table);
      data.DT_REGISTO = functionsDatabase.createDateNow(table);
      data.REF = await functionsDatabase.createREF("sgigjprocessoautoexclusao");
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID



      if (list.other.includes("CODIGO") === true)
        data.CODIGO = await functionsDatabase.createCODIGO(table);
      const validation = await functionsDatabase.validation(
        list,
        data,
        extractRequest,
        table
      );

      if (validation.status === "ok") {
        const newuser = await Database.table("glbuser")
          .where("ID", request.userID)
          .limit(1);

        data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID;
        data.ESTADO = "1"

        let dateFim = moment(data.DT_FIM);
        let dateNow = moment(data.DT_INICIO)
        let numberDay = dateFim.diff(dateNow, 'days')
        numberDay = numberDay > -1 ? numberDay : -1;

        data.NUM_DIAS = numberDay

        const newE = await Database.table(table).insert(data);

        if (newE[0] === 0) {

          let user = await User.query().where("glbuser.ID", auth._ctx.request.userID).first()
          let idUserPessoa = ""
          let nome = ""
          if (user) {
            let Pessoa = await Sgigjrelpessoaentidade.query().with("sgigjpessoa").where("sgigjrelpessoaentidade.ID", user.REL_PESSOA_ENTIDADE_ID).first()
            idUserPessoa = Pessoa ? Pessoa.$relations.sgigjpessoa.$attributes.ID : ""
            nome = Pessoa ? Pessoa.$relations.sgigjpessoa.$attributes.NOME : ""
          }


          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
            MSG: nome ? `O(A) utilizador(a) ${nome}  efetuou o registo de um novo processo de autoexclusão que aguarda Despacho.` : "Foi efectuado  o registo de um novo processo de autoexclusão que aguarda Despacho.",
            TITULO: "Registo de nova Autoexclusão",
            PESSOA_ID: idUserPessoa,
            URL: "/processos/autoexclusao",
            EXTRA: JSON.stringify({
              IdAutoexclusao: data.ID
            })
          })

          GlbnotificacaoFunctions.storeToPerfil({
            request,
            PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector Normal
            MSG: nome ? `O(A) utilizador(a) ${nome}  efetuou o registo de um novo processo de autoexclusão que aguarda Despacho.` : "Foi efectuado  o registo de um novo processo de autoexclusão que aguarda Despacho.",
            TITULO: "Registo de nova Autoexclusão",
            PESSOA_ID: idUserPessoa,
            URL: "/processos/autoexclusao",
            EXTRA: JSON.stringify({
              IdAutoexclusao: data.ID
            })
          })
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
  }

  async update({ params, request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "update",
      request.userID,
      params.id
    );

    if (allowedMethod) {
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
        ]);

        extractRequest.push("ENTIDADE_ID")
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
            return data;
          } else
            return response
              .status(400)
              .json({ status: "fail", entity: "", message: "", code: "" });
        } else return response.status(400).json(validation);
      }
    } else
      return response
        .status(405)
        .json({
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
        return response
          .status(400)
          .json({
            status: "erro",
            entity: table,
            message: "doesnt exist",
            code: 999,
          });
      else {
        const newE = await Database.table(table)
          .where("ID", "" + params.id)
          .userID(request.userID)
          .update({ "ESTADO": "0", "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table) });

        if (newE) {
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
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "delete not allwed",
          code: "4053",
        });
  }

  async index({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    let state = request.input('states')
    let filterName = request.input('name')
    let dispatch = request.input('dispatch')

    let params = request.get()
    let dateStart = params["DATA_INICIO"]
    let dateEnd = params["DATA_FIM"]
    let ANO = request.get().ANO

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);


      extractRequest.push("ENTIDADE_ID")
      var result = Model.query().select('sgigjprocessoautoexclusao.*')
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with("sgigjpessoa")
        .with("sgigjentidade")
        .with("sgigjprprofissao")
        .with("sgigjprexclusaoperiodo")
        .with("sgigjprmotivoesclusaotp")
        .with("sgigjprocessodespacho")
        .innerJoin("sgigjpessoa", 'sgigjpessoa.ID', 'PESSOA_ID')


      if (state) {
        if (state == "active") {
          result = result.where("NUM_DIAS", ">", "-1")
        }
        if (state == "inactive") {
          result = result.where("NUM_DIAS", "=", "-1")
        }
      }

      if (dispatch) {
        if (dispatch == "true") {
          result = result.whereNotNull(function (query) {
            query.select("PROCESSO_AUTOEXCLUSAO_ID").from("sgigjprocessodespacho").whereColumn("sgigjprocessoautoexclusao.ID", "PROCESSO_AUTOEXCLUSAO_ID")
          })
        } else {
          result = result.whereNull(function (query) {
            query.select("PROCESSO_AUTOEXCLUSAO_ID").from("sgigjprocessodespacho").whereColumn("sgigjprocessoautoexclusao.ID", "PROCESSO_AUTOEXCLUSAO_ID")
          })
        }
      }

      if (filterName) {

        result = result.where("sgigjpessoa.NOME", "like", "%" + filterName + "%")
      }
      result = result.where(data).where("sgigjprocessoautoexclusao.ESTADO", "1");


      if (ANO) {
        result = result.whereRaw("YEAR(DATA) = ? ", [ANO])
      }
      // if (dateStart && dateEnd) {
      //   result.whereBetween("sgigjprocessoautoexclusao.DT_INICIO", [dateStart, dateEnd])

      // }

      result = await result.orderBy("sgigjprocessoautoexclusao.CODIGO", "desc")
        .fetch()


      let alert = await Model.query()
        .with("sgigjpessoa")
        .with("sgigjentidade")
        .with("sgigjprprofissao")
        .with("sgigjprexclusaoperiodo")
        .with("sgigjprmotivoesclusaotp")
        .with("sgigjprocessodespacho")
        .whereIn("NUM_DIAS", [90, 30, 5, 0])
        .where("ESTADO", "1")
        .orderBy("sgigjprocessoautoexclusao.CODIGO", "desc")
        .fetch()




      return {
        "alert": alert ? alert : [],
        "data": result.toJSON(),
      };
    } else
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "index not allwed",
          code: "4054",
        });
  }

  async exportPdf({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    let state = request.input('states')
    let filterName = request.input('name')
    let dispatch = request.input('dispatch')

    let params = request.get()
    let dateStart = params["DATA_INICIO"]
    let dateEnd = params["DATA_FIM"]
    let ANO = request.get().ANO
    let textFilter = ""

    if (allowedMethod || true) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);


      // ebrailson gabriel
      extractRequest.push("ENTIDADE_ID")
      var result = Model.query()
        .with("sgigjpessoa")
        .with("sgigjentidade")
        .with("sgigjprprofissao")
        .with("sgigjprexclusaoperiodo")  
        .with("sgigjprmotivoesclusaotp")
        .with("sgigjprocessodespacho")
        .innerJoin("sgigjpessoa", 'PESSOA_ID', 'sgigjpessoa.ID')

      if (state) {
        if (state == "active") {
          result = result.where("NUM_DIAS", ">", "-1")
          textFilter = textFilter + " - " + "Activo"
        }
        if (state == "inactive") {
          result = result.where("NUM_DIAS", "=", "-1")
          textFilter = textFilter + " - " + "Inactivo"
        }
      }

      if (dispatch) {
        if (dispatch == "true") {
          result = result.whereNotNull(function (query) {
            query.select("PROCESSO_AUTOEXCLUSAO_ID").from("sgigjprocessodespacho").whereColumn("sgigjprocessoautoexclusao.ID", "PROCESSO_AUTOEXCLUSAO_ID")
          })
          textFilter = textFilter + " - " + "Despachado"
        } else {
          result = result.whereNull(function (query) {
            query.select("PROCESSO_AUTOEXCLUSAO_ID").from("sgigjprocessodespacho").whereColumn("sgigjprocessoautoexclusao.ID", "PROCESSO_AUTOEXCLUSAO_ID")
          })
          textFilter = textFilter + " - " + "Por Despachar"
        }
      }

      if (filterName) {

        result = result.where("sgigjpessoa.NOME", "like", "%" + filterName + "%")
        textFilter = textFilter + " - " + filterName
      }

      if (dateStart && dateEnd) {
        result.whereBetween("sgigjprocessoautoexclusao.DT_INICIO", [dateStart, dateEnd])
        textFilter = moment(dateStart).format('DD-MM-Y') + " - " + moment(dateEnd).format('DD-MM-Y')

      }


      if (ANO) {
        result = result.whereRaw("YEAR(DATA) = ? ", [ANO])
        textFilter = textFilter + " - " + ANO
      }

      result = await result.where(data).where("sgigjprocessoautoexclusao.ESTADO", "1")
        .orderBy("sgigjprocessoautoexclusao.CODIGO", "desc")
        .fetch();

      result = result.toJSON()
      let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"
      const content = `<div >
              <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                  <div style=" margin-bottom: 40px; margin-left: -20px;">
                      <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                  </div>
                  <h2 style="font-size: 12pt !important">Autoexclusão ${textFilter}</h2>

                  <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                    <thead style="background-color:#2b7fb9;color:#fff">
                      <tr>
                         <th style="text-align: center;">CODIGO</th>
                         <th style="text-align: center;">FREQUENTADOR</th>
                         <th style="text-align: center;">ENTIDADE</th>
                         <th style="text-align: center;">DATA PEDIDO</th>
                         <th style="text-align: center;">MOTIVO</th>
                         <th style="text-align: center;">PERÍODO</th>
                         <th style="text-align: center;">N DIAS</th>
                         <th style="text-align: center;">DATA ÍNICIO</th>
                         <th style="text-align: center;">DATA FIM</th>
                      </tr>
                    </thead>
                    
                    <tbody>

                      ${(function () {
          let tbody = ""
          for (let index = 0; index < result.length; index++) {
            const element = result[index];

            tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
              <td > ${element.CODIGO}</tb>
              <td > ${element.sgigjpessoa ? element.sgigjpessoa.NOME : ""}</tb>
              <td > ${element.sgigjentidade ? element.sgigjentidade.DESIG : ""}</tb>
              <td > ${element.DATA ? moment(element.DATA).format('DD-MM-Y') : ""}</tb>
              <td > ${element.sgigjprmotivoesclusaotp ? element.sgigjprmotivoesclusaotp.DESIG : ""}</tb>
              <td > ${element.sgigjprexclusaoperiodo ? element.sgigjprexclusaoperiodo.DESIG : ""}</tb>
              <td > ${element.NUM_DIAS != -1 ? element.NUM_DIAS : 0}</tb>
              <td > ${element.DT_INICIO ? moment(element.DT_INICIO).format('DD-MM-Y') : ""}</tb>
              <td > ${element.DT_FIM ? moment(element.DT_FIM).format('DD-MM-Y') : ""}</tb>
              </tr>`
          }
          return tbody
        })()}
                    </tbody>
                  </table>
              <div>`

      await Database
        .table(table)
        .userID(request.userID)
        .registerExport("PDF")
      let buffer = await pdfCreater(content)
      response.header('Content-type', 'application/pdf');

      // It will be called downloaded.pdf
      response.header("Content-Disposition", 'attachment')
      response.header('filename', 'downloaded.pdf');



      return response.send(buffer)




    } else
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "index not allwed",
          code: "4054",
        });
  }

  async exportCsv({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    let state = request.input('states')
    let filterName = request.input('name')
    let dispatch = request.input('dispatch')

    let params = request.get()
    let dateStart = params["date-start"]
    let dateEnd = params["date-end"]
    let ANO = request.get().ANO

    if (allowedMethod || true) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);


      extractRequest.push("ENTIDADE_ID")
      var result = Model.query()
        .with("sgigjpessoa")
        .with("sgigjentidade")
        .with("sgigjprprofissao")
        .with("sgigjprexclusaoperiodo")
        .with("sgigjprmotivoesclusaotp")
        .with("sgigjprocessodespacho")
        .innerJoin("sgigjpessoa", 'PESSOA_ID', 'sgigjpessoa.ID')

      if (state) {
        if (state == "active") {
          result = result.where("NUM_DIAS", ">", "-1")
        }
        if (state == "inactive") {
          result = result.where("NUM_DIAS", "=", "-1")
        }
      }

      if (dispatch) {
        if (dispatch == "true") {
          result = result.whereNotNull(function (query) {
            query.select("PROCESSO_AUTOEXCLUSAO_ID").from("sgigjprocessodespacho").whereColumn("sgigjprocessoautoexclusao.ID", "PROCESSO_AUTOEXCLUSAO_ID")
          })
        } else {
          result = result.whereNull(function (query) {
            query.select("PROCESSO_AUTOEXCLUSAO_ID").from("sgigjprocessodespacho").whereColumn("sgigjprocessoautoexclusao.ID", "PROCESSO_AUTOEXCLUSAO_ID")
          })
        }
      }

      if (filterName) {
        result = result.where("sgigjpessoa.NOME", "like", "%" + filterName + "%")
      }

      if (dateStart && dateEnd) {
        result.whereBetween("sgigjprocessoautoexclusao.DT_INICIO", [dateStart, dateEnd])

      }

      if (ANO) {
        result = result.whereRaw("YEAR(DATA) = ? ", [ANO])
      }

      result = await result.where(data).where("ESTADO", "1")
        .orderBy("sgigjprocessoautoexclusao.CODIGO", "desc")
        .fetch();

      result = result.toJSON()
      let dataResult = []
      for (let index = 0; index < result.length; index++) {
        let element = result[index];
        dataResult.push({
          "CODIGO": element.CODIGO,
          "FREQUENTADOR": element.sgigjpessoa ? element.sgigjpessoa.NOME : "",
          "ENTIDADE": element.sgigjentidade ? element.sgigjentidade.DESIG : "",
          "DATA PEDIDO": element.DATA ? moment(element.DATA).format('DD-MM-Y') : "",
          "MOTIVO": element.sgigjprmotivoesclusaotp ? element.sgigjprmotivoesclusaotp.DESIG : "",
          "PERÍODO": element.sgigjprexclusaoperiodo ? element.sgigjprexclusaoperiodo.DESIG : "",
          "N DIAS": element.NUM_DIAS != -1 ? element.NUM_DIAS : 0,
          "DATA ÍNICIO": element.DT_INICIO ? moment(element.DT_INICIO).format('DD-MM-Y') : "",
          "DATA FIM": element.DT_FIM ? moment(element.DT_FIM).format('DD-MM-Y') : ""
        })
      }


      let dataCsv = this.toCsv(dataResult)


      await Database
        .table(table)
        .userID(request.userID)
        .registerExport("CSV")
      response.header('Content-type', 'text/csv')
      response.header('Content-Disposition', 'attachment; filename="handplay.csv"')
      return response.send(dataCsv)

    }
    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })
  }

  toCsv(data, hasHeader = true) {
    if (data.length == 0) {
      return ""
    }

    let header = hasHeader ? Object.keys(data[0]).join(",") + "\r\n" : ""
    let body = ""

    data.forEach(element => {
      body += Object.values(element).join(",") + "\r\n"
    });

    return header + body

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
        return response
          .status(400)
          .json({
            status: "erro",
            entity: table,
            message: "doesnt exist",
            code: 999,
          });
      else {
        let data = await Model.query()
          .with("sgigjpessoa")
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with("sgigjreldocumento.sgigjprdocumentotp")
          .with("sgigjprprofissao")
          .with("sgigjprexclusaoperiodo")
          .with("sgigjprmotivoesclusaotp")
          .with("sgigjprocessodespacho")
          .with("sgigjentidade")
          .where("ID", "" + params.id)
          .fetch()
        data = data.toJSON();

        const user = await User.query()
          .with("sgigjrelpessoaentidade.sgigjpessoa")
          .where("REL_PESSOA_ENTIDADE_ID", data[0].REL_PESSOA_ENTIDADE_REGISTO_ID)
          .first();
        data[0]["criado_por"] = user

        return data
      }
    } else
      return response
        .status(405)
        .json({
          status: "405Error",
          entity: table,
          message: "show not allwed",
          code: "4056",
        });
  }
}

module.exports = entity;
