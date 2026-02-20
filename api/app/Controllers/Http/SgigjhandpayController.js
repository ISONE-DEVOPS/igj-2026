"use strict";

const controller = "Sgigjhandpay";

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use("App/Models/" + controller);
const moment = require("moment");
var pdf = require('html-pdf');

const functionsDatabase = require("../functionsDatabase");
const pdfCreater = async (data) => {

  let promise = new Promise((resolve, reject) => {

    pdf.create(data, { "format": "A4", "border": "0", "type": "pdf" }).toBuffer(function (err, buffer) {
      if (err) {
        reject(err)
      }
      resolve(buffer)

    })


  })
  return promise
}

class entity {
  async store({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      table,
      "create",
      request.userID,
      ""
    );

    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [
        "REL_PESSOA_ENTIDADE_REGISTO_ID",
      ]);

      let data = request.only(extractRequest);

      data.ID = await functionsDatabase.createID(table);
      data.DT_REGISTO = functionsDatabase.createDateNow(table);
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID
      data.REF = await functionsDatabase.createREF("sgigjhandpay");

      if (list.other.includes("CODIGO") === true)
        data.CODIGO = await functionsDatabase.createCODIGO(table);

      const validation = await functionsDatabase.validation(
        list,
        data,
        extractRequest,
        table
      );

      if (validation.status === "ok") {
        const newvalor = parseInt(data.VALOR);

        if (newvalor < 1000)
          return response
            .status(400)
            .json({
              status: "error",
              entity: table + ".VALOR",
              message: "valor deve ser superior a 1000€",
              code: "564564",
            });

        const newuser = await Database.table("glbuser")
          .where("ID", request.userID)
          .limit(1);

        data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID;

        const newE = await Database.table(table).insert(data);

        if (newE[0] === 0) {
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

        let data = request.only(extractRequest);
        const validation = await functionsDatabase.validation(
          list,
          data,
          extractRequest,
          table
        );

        if (validation.status === "ok") {
          const newvalor = parseInt(data.VALOR);

          if (newvalor < 1000)
            return response
              .status(400)
              .json({
                status: "error",
                entity: table + ".VALOR",
                message: "valor should be superior than 1000€",
                code: "564564",
              });

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
        const newE = await Database
          .table(table)
          .where('ID', '' + params.id)
          .userID(request.userID)
          .update({
            "ESTADO": 0,
            "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table)
          })

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

    if (allowedMethod) {

      let params = request.get()
      let dateStart = params["date-start"]
      let dateEnd = params["date-end"]
      let ANO = request.get().ANO

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);

      var result = Model.query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with("sgigjpessoa.nacionalidade")
        .with("sgigjentidade")
        .where(data)
        .where('ESTADO', 1);

      // if (dateStart && dateEnd) {
      //   result.whereBetween("DATA", [dateStart, dateEnd])

      // }
      if (ANO) {
        result = result.whereRaw("YEAR(DT_REGISTO) = ? ", [ANO])
      }

      result = await result.orderBy("CODIGO", "desc").fetch()

      return result;
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
        return await Model.query()
          .with("sgigjpessoa")
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with("sgigjreldocumento.sgigjprdocumentotp")
          .where("ID", "" + params.id)
          .fetch();
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
  async exportPdf({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(
      table,
      "index",
      request.userID,
      ""
    );

    if (allowedMethod || true) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, []);
      const data = functionsDatabase.indexconfig(request, extractRequest, [
        "DT_REGISTO",
      ]);

      let params = request.get()
      // let dateStart = params["date-start"]
      // let dateEnd = params["date-end"]
      let ANO = request.get().ANO
      let Nome = request.get().NOME
      let textFilter = ""


      var result = Model.query()
        .with("sgigjpessoa.nacionalidade")
        .with("sgigjentidade")
        .innerJoin('sgigjpessoa', 'sgigjhandpay.PESSOA_ID', 'sgigjpessoa.ID')
        .innerJoin('sgigjentidade', 'sgigjhandpay.ENTIDADE_ID', 'sgigjentidade.ID')
        .where(data)
        .where('sgigjhandpay.ESTADO', 1);

      if (ANO) {
        result = result.whereRaw("YEAR(sgigjhandpay.DT_REGISTO) = ? ", [ANO])
        textFilter = textFilter + " Ano: " + ANO
      }

      if (Nome) {
        result = result.whereRaw("sgigjpessoa.NOME like  ?", ["%" + Nome + "%"])
        result = result.orWhereRaw("sgigjentidade.DESIG like  ?", ["%" + Nome + "%"])
        textFilter = textFilter + " " + Nome
      }


      // if (dateStart && dateEnd) {
      //   result.whereBetween("DATA", [dateStart, dateEnd])

      // }


      result = await result.orderBy("sgigjhandpay.CODIGO", "desc").fetch()
      result = result.toJSON()
      let sum = 0

      let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"
      const content = `<div >
              <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                  <div style=" margin-bottom: 40px; margin-center: -20px;">
                      <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                  </div>
                  <h2 style="font-size: 12pt !important">Handpay ${textFilter}</h2>

                  <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                    <thead style="background-color:#2b7fb9;color:#fff">
                      <tr>
                         <th style="text-align: center;">CODIGO</th>
                         <th style="text-align: center;">PESSOA</th>
                         <th style="text-align: center;">ENTIDADE</th>
                         <th style="text-align: center;">NACIONALIDADE</th>
                         <th style="text-align: center;">VALOR</th>
                         <th style="text-align: center;">DATA</th>
                      </tr>
                    </thead>
                    
                    <tbody>

                      ${(() => {
          let tbody = ""
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            sum = sum + element.VALOR
            tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                             <td style="text-align: center;"> ${element.CODIGO}</tb>
                             <td style="text-align: center;"> ${element.sgigjpessoa.NOME}</tb>
                             <td style="text-align: center;"> ${element.sgigjentidade.DESIG}</tb>
                             <td style="text-align: center;"> ${element.sgigjpessoa.nacionalidade.NACIONALIDADE}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.VALOR)}</tb>
                             <td style="text-align: center;"> ${moment(element.DATA).format('DD-MM-Y')}</tb>
                    
                            </tr>`
          }
          return tbody
        })()}
        ${(() => {
          if (result.length > 0) {
            return `<tr style="background-color:#b9bdba;font-weight: bold">
                      <td  style="text-align: center;font-weight: bold">Total</tb>
                      <td ></tb>
                      <td ></tb>
                      <td ></tb>
                      <td  style="text-align: right;font-weight: bold">${this.formatCurrency(sum)}</tb>
                      <td ></tb>
                    </tr>`
          }
          return ''
        })()}
                    </tbody >
                  </table >
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
    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");
    if (allowedMethod || true) {

      let params = request.get()
      let dateStart = params["date-start"]
      let dateEnd = params["date-end"]

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])


      var result = Model.query()
        .with("sgigjpessoa.nacionalidade")
        .with("sgigjentidade")
        .where(data)
        .where('ESTADO', 1);

      if (dateStart && dateEnd) {
        result.whereBetween("DATA", [dateStart, dateEnd])

      }

      result = await result.orderBy("CODIGO", "desc").fetch()

      result = result.toJSON()
      let sum = 0
      let dataResult = []
      for (let index = 0; index < result.length; index++) {
        let element = result[index];
        sum = sum + element.VALOR
        dataResult.push({
          "CODIGO": element.CODIGO,
          "PESSOA": element.sgigjpessoa.NOME,
          "ENTIDADE": element.sgigjentidade.DESIG,
          "NACIONALIDADE": element.sgigjpessoa.nacionalidade.NACIONALIDADE,
          "VALOR": Math.round(element.VALOR),
          "Data": moment(element.DATA).format('DD-MM-Y')
        })
      }

      let dataCsv = this.toCsv(dataResult)


      if (dataResult.length > 0) {
        dataCsv = dataCsv + "\r\n"
        dataCsv = dataCsv + this.toCsv([
          {
            "CODIGO": "",
            "PESSOA": "",
            "ENTIDADE": "",
            "NACIONALIDADE": "",
            "VALOR": Math.round(sum),
            "Data": ""
          }
        ], false)
      }

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

  formatCurrency(value) {
    if (typeof value !== 'number') {
      return '0 CVE';
    }

    // Round the value to 2 decimal places, rounding half up
    const roundedValue = Math.round(value);

    // Split the number into integer and fractional parts
    const parts = roundedValue.toString().split('.');

    // Format the integer part with thousands separator
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Ensure there is a fractional part with two decimal places
    const fractionalPart = parts.length > 1 ? parts[1].padEnd(2, '0') : '00';

    // Combine the formatted parts with the currency symbol
    const formattedNumber = `${integerPart},${fractionalPart} CVE`;

    return formattedNumber;
  }
}

module.exports = entity;
