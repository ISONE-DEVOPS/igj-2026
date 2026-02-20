'use strict'

const controller = "Sgigjentidadeevento";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');
const Sgigjreleventodespacho = use('App/Models/Sgigjreleventodespacho');
const Sgigjreleventoparecer = use('App/Models/Sgigjreleventoparecer');
var pdf = require('html-pdf');
const moment = require("moment");

class entity {

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");
    if (allowedMethod) {

      let ANO = request.get().ANO
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, ['REL_PESSOA_ENTIDADE_REGISTO_ID','ESTADO'])
      const data = functionsDatabase.indexconfig(request, extractRequest, [])
      

      
      const newuser = await Database
        .table('glbuser')
        .where('ID', request.userID)
        .where('ESTADO', 1)
        .limit(1)

      var result =  Model
        .query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('premios')
        .with('data')

        // .whereHas('sgigjreleventodespacho',(builder) => {
        //   builder.whereHas('sgigjreleventoparecer',(builder) => {
        //     builder.where('REL_PESSOA_ENTIDADE_ID', newuser[0].REL_PESSOA_ENTIDADE_ID)
        //   })
        // })
        .with('sgigjpreventotp')
        .with('sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjreleventodespacho', (builder) => {
          builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
            .with('sgigjreleventoparecer', (builder) => {
              builder.with('parecer').with('sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_ATRIBUICAO', 'asc')
            })
        })

        .where('ESTADO', 1)
        .where(data)
        .orderBy('DT_REGISTO', 'desc')

        if(ANO){
          result = result.whereRaw("YEAR(DT_REGISTO) = ? ",[ANO])
        }
        result = await result.fetch()

      console.log(request.userID)

      return result

    }
    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })
  }

  async exportPdf({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "export-pdf", request.userID, "");
    if (allowedMethod || true) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      const newuser = await Database
        .table('glbuser')
        .where('ID', request.userID)
        .limit(1)

      var result = await Model
        .query()

        // .whereHas('sgigjreleventodespacho',(builder) => {
        //   builder.whereHas('sgigjreleventoparecer',(builder) => {
        //     builder.where('REL_PESSOA_ENTIDADE_ID', newuser[0].REL_PESSOA_ENTIDADE_ID)
        //   })
        // })
        .with('sgigjpreventotp')
        .with('sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjreleventodespacho', (builder) => {
          builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
            .with('sgigjreleventoparecer', (builder) => {
              builder.with('parecer').with('sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_ATRIBUICAO', 'asc')
            })
        })

        .where(data)
        .where('ESTADO', 1)
        .orderBy('DT_REGISTO', 'desc')
        .fetch()

      result = result.toJSON()

      let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

      const content = `<div >
        <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
            <div style=" margin-bottom: 40px; margin-left: -20px;">
                <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
            </div>
            <h2 style="font-size: 12pt !important">Eventos</h2>

            <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
              <thead style="background-color:#2b7fb9;color:#fff">
                <tr>
                  <th style="text-align: center;">Estado</th>
                  <th style="text-align: center;">ENTIDADES</th>
                  <th style="text-align: center;">DESIGNAÇÃO</th>
                  <th style="text-align: center;">Nº SORTEIO</th>
                  <th style="text-align: center;">PESSOA RESPONSÁVEL</th>
                  <th style="text-align: center;">TIPO DE EVENTO</th>
                  <th style="text-align: center;">PRÊMIO</th>
                  <th style="text-align: center;">DATA INÍCIO/th>
                  <th style="text-align: center;">DATA FIM</th>
                  
                </tr>
              </thead>
              
              <tbody>

                ${(function () {
          let tbody = ""
          for (let index = 0; index < result.length; index++) {
            const element = result[index];

            tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
        <td > ${element.sgigjreleventodespacho.length > 0 ? '<span style="background: yellow; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: grey; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
        <td > ${element.sgigjentidade.DESIG}</tb>
        <td > ${element.DESIG}</tb>
        <td > ${element.NUM_SORTEIO_NOITE}</tb>
        <td > ${element.sgigjrelpessoaentidade.sgigjpessoa.NOME}</tb>
        <td > ${element.DESCR}</tb>
        <td > ${element.PREMIO}</tb>
        <td > ${moment(element.DT_INICIO).format('DD-MM-Y')}</tb>
        <td > ${moment(element.DT_FIM).format('DD-MM-Y')}</tb>
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
      response.header('Content-type', 'application/pdf')
      response.header('Content-Disposition', 'attachment; filename="evento_parecer.pdf"')
      return response.send(await this.toPdf(content))

    }
    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })
  }

  async exportCsv({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "export-pdf", request.userID, "");
    if (allowedMethod || true) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      const newuser = await Database
        .table('glbuser')
        .where('ID', request.userID)
        .limit(1)

      var result = await Model
        .query()

        // .whereHas('sgigjreleventodespacho',(builder) => {
        //   builder.whereHas('sgigjreleventoparecer',(builder) => {
        //     builder.where('REL_PESSOA_ENTIDADE_ID', newuser[0].REL_PESSOA_ENTIDADE_ID)
        //   })
        // })
        .with('sgigjpreventotp')
        .with('sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjreleventodespacho', (builder) => {
          builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
            .with('sgigjreleventoparecer', (builder) => {
              builder.with('parecer').with('sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_ATRIBUICAO', 'asc')
            })
        })

        .where(data)
        .where('ESTADO', 1)
        .orderBy('DT_REGISTO', 'desc')
        .fetch()

      result = result.toJSON()

      let dataResult = []
      for (let index = 0; index < result.length; index++) {
        let element = result[index];
        dataResult.push({
          "Estado": element.sgigjreleventodespacho.length > 0 ? "Despacho" : "",
          "ENTIDADES": element.sgigjentidade.DESIG,
          "DESIGNAÇÃO": element.DESIG,
          "Nº SORTEIO": element.NUM_SORTEIO_NOITE,
          "PESSOA RESPONSÁVEL": element.sgigjrelpessoaentidade.sgigjpessoa.NOME,
          "TIPO DE EVENTO": element.DESCR,
          "PRÊMIO": element.PREMIO,
          "DATA INÍCIO": moment(element.DT_INICIO).format('DD-MM-Y'),
          "DATA FIM": moment(element.DT_FIM).format('DD-MM-Y')
        })
      }

      let dataCsv = this.toCsv(dataResult)

      await Database
      .table(table)
      .userID(request.userID)
      .registerExport("CSV")
      response.header('Content-type', 'text/csv')
      response.header('Content-Disposition', 'attachment; filename="evento_parecer.csv"')
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

  async toPdf(content) {

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
    let buffer = await pdfCreater(content)
    return buffer
  }

  async show({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "show", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        return await Model
          .query()
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with('premios')
          .with('data')
          .where('ID', '' + params.id)
          .with('sgigjpreventotp')
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .with('sgigjentidade', (builder) => {
            builder.with('sgigjprentidadetp').with('sgigjrelcontacto.sgigjprcontactotp')
          })
          .with('sgigjreleventodespacho', (builder) => {
            builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
              .with('sgigjreleventoparecer', (builder) => {
                builder.with('parecer').with('sgigjrelpessoaentidade.sgigjpessoa')
              })
          })

          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }

}

module.exports = entity
