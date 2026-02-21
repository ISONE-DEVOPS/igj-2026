'use strict'

const controller = "Sgigjrelpessoaentidade";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');
const Pessoa = use('App/Models/Sgigjpessoa');
var pdf = require('html-pdf');
const moment = require("moment");

class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])

      let data = request.only(extractRequest)

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);



      if (validation.status === 'ok') {





        const p = await Pessoa
          .query()
          .with('sgigjrelpessoaentidade')
          .where('ID', '' + data.PESSOA_ID)
          .fetch()

        if (p.rows[0].$relations.sgigjrelpessoaentidade.rows.length > 0) {

          return response.status(400).json({ status: "fail", entity: "sgigjpessoa", message: "already exist", code: "476" })

        } else {

          const newE = await Database
            .table(table)
            .insert(data)

          if (newE[0] === 0) {
            return (data)
          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

        }




      } else return response.status(400).json(validation)


    }

    else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

  }

  async update({ params, request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "update", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {
        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, ["PESSOA_ID"])

        let data = request.only(extractRequest)
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);

        if (validation.status === 'ok') {


          const pessoalist = request.only(['PESSOA_ID'])


          if (typeof pessoalist.PESSOA_ID != "undefined") {


            const p = await Pessoa
              .query()
              .with('sgigjrelpessoaentidade')
              .where('ID', '' + pessoalist.PESSOA_ID)
              .fetch()

            if (p.rows[0].$relations.sgigjrelpessoaentidade.rows.length > 0) {

              return response.status(400).json({ status: "fail", entity: "sgigjpessoa", message: "already exist", code: "476" })

            } else {

              data.PESSOA_ID = pessoalist.PESSOA_ID

              const newE = await Database
                .table(table)
                .where('ID', '' + params.id)
                .userID(request.userID)
                .update(data)


              if (newE === 1) {
                return (data)
              }

              else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })



            }


          } else {



            const newE = await Database
              .table(table)
              .where('ID', '' + params.id)
              .userID(request.userID)
              .update(data)


            if (newE === 1) {
              return (data)
            }

            else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })




          }







        } else return response.status(400).json(validation)


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })

  }

  async destroy({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "delete", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

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
          return { status: "ok", entity: table + "." + params.id, message: "deleted", code: "888" }
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "delete not allwed", code: "4053" })

  }

  async index({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model
        .query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjentidade')
        .with('sgigjpessoa')
        .with('sgigjprcategoriaprofissional')
        .with('sgigjprnivelescolaridade')
        .with('glbuser.glbperfil')
        .where(data)
        .where('ESTADO', 1)
        .orderBy('DT_REGISTO', 'desc')
        .fetch()


      return result

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })


  }

  async show({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "show", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        return await Model
          .query()
          .with('sgigjentidade')
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with('sgigjpessoa', (builder) => {
            builder
              .with('sgigjprestadocivil')
              .with('sgigjprgenero')
              .with('nacionalidade')
              .with('localidade')
              .with('sgigjreldocumento.sgigjprdocumentotp')
              .with('sgigjrelcontacto.sgigjprcontactotp')
          })
          .with('sgigjprcategoriaprofissional')
          .with('sgigjprnivelescolaridade')
          .with('sgigjrelpessoaentidadelingua', (builder) => {
            builder.with('sgigjprlingua').with('sgigjprnivellinguistico')
          })
          .where('ID', '' + params.id)
          .fetch()

        //sgigjprnivellinguistico
      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }

  async exportPdf({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "export-pdf", request.userID, "");
    if (allowedMethod || true) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model
        .query()
        .with('sgigjentidade')
        .with('sgigjpessoa')
        .with('sgigjprcategoriaprofissional')
        .with('sgigjprnivelescolaridade')
        .with('glbuser.glbperfil')
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
            <h2 style="font-size: 12pt !important">Pessoa</h2>

            <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
              <thead style="background-color:#2b7fb9;color:#fff">
                <tr>
                   <th style="text-align: center;">Código</th>
                   <th style="text-align: center;">Nome</th>
                   <th style="text-align: center;">Categoria Profissional</th>
                   <th style="text-align: center;">Nível de Escolaridade</th>
                   <th style="text-align: center;">Data Início</th>
                   <th style="text-align: center;">Data Fim</th>
                </tr>
              </thead>
              
              <tbody>

                ${(function () {
          let tbody = ""
          for (let index = 0; index < result.length; index++) {
            const element = result[index];

            tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
        <td > ${element.sgigjpessoa.CODIGO}</tb>
        <td > ${element.sgigjpessoa.NOME}</tb>
        <td > ${element.sgigjprcategoriaprofissional.DESIG}</tb>
        <td > ${element.sgigjprnivelescolaridade.DESIG}</tb>
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
      response.header('Content-Disposition', 'attachment; filename="pessoa.pdf"')
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

      var result = await Model
        .query()
        .with('sgigjentidade')
        .with('sgigjpessoa')
        .with('sgigjprcategoriaprofissional')
        .with('sgigjprnivelescolaridade')
        .with('glbuser.glbperfil')
        .where(data)
        .where('ESTADO', 1)
        .orderBy('DT_REGISTO', 'desc')
        .fetch()

      result = result.toJSON()

      let dataResult = []
      for (let index = 0; index < result.length; index++) {
        let element = result[index];
        dataResult.push({
          "Código": element.sgigjpessoa.CODIGO,
          "Nome": element.sgigjpessoa.NOME,
          "Categoria Profissional": element.sgigjprcategoriaprofissional.DESIG,
          "Nível de Escolaridade": element.sgigjprnivelescolaridade.DESIG,
          "Data Início": moment(element.DT_INICIO).format('DD-MM-Y'),
          "Data Fim": moment(element.DT_FIM).format('DD-MM-Y'),
        })
      }

      let dataCsv = this.toCsv(dataResult)

      await Database
        .table(table)
        .userID(request.userID)
        .registerExport("CSV")
      response.header('Content-type', 'text/csv')
      response.header('Content-Disposition', 'attachment; filename="pessoa.csv"')
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
        pdf.create(data, { "format": "A4", "border": { "top": "15mm", "right": "15mm", "bottom": "15mm", "left": "15mm" }, "type": "pdf" }).toBuffer(function (err, buffer) {
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
}

module.exports = entity
