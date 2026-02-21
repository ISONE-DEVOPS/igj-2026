'use strict'

const controller = "Sgigjentidadeevento";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
var pdf = require('html-pdf');
const functionsDatabase = require('../functionsDatabase');
const GlbnotificacaoFunctions = require('../Http/GlbnotificacaoFunctions');
const Env = use('Env')
const moment = require("moment");
let DatabaseDB = use("Database")




class entity {

  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");
    if (allowedMethod) {
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, ["REL_PESSOA_ENTIDADE_REGISTO_ID"])

      let data = request.only(extractRequest)
      let premios = request.input("premios")
      let eventoData = request.input("data")

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);
      if (validation.status === 'ok') {
        const newuser = await Database.table("glbuser")
          .where("ID", request.userID)
          .limit(1);

        data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID;
        const newE = await Database
          .table(table)
          .insert(data)

        if (newE[0] === 0) {

          if (premios) {
            data["premios"] = [];
            const tablePremios = "eventopremios"
            for (let index = 0; index < premios.length; index++) {
              const premio = premios[index];
              premio.ID = await functionsDatabase.createID(tablePremios)
              premio.DT_REGISTO = functionsDatabase.createDateNow(tablePremios)
              premio.ESTADO = 1
              premio.ENTIDADE_EVENTO_ID = data.ID
              premio.CRIADO_POR = request.userID

              const listPremios = await functionsDatabase.DBMaker(tablePremios);
              const extractRequestPremio = functionsDatabase.extractRequest(listPremios, [])
              const validationPremios = await functionsDatabase.validation(listPremios, premio, extractRequestPremio, tablePremios);
              if (validationPremios.status === 'ok') {
                await Database
                  .table(tablePremios)
                  .insert(premio)

                  data["premios"].push(premio)
              }
              else return validationPremios
            }
          }

          if (eventoData) {
            
            const tableData = "eventodata"
            eventoData.ID = await functionsDatabase.createID(tableData)
            eventoData.DT_REGISTO = functionsDatabase.createDateNow(tableData)
            eventoData.ESTADO = 1
            eventoData.ENTIDADE_EVENTO_ID = data.ID
            eventoData.CRIADO_POR = request.userID

            const listData = await functionsDatabase.DBMaker(tableData);
            const extractRequestData = functionsDatabase.extractRequest(listData, [])
            const validationData = await functionsDatabase.validation(listData, eventoData, extractRequestData, tableData);
            if (validationData.status === 'ok') {
              await Database
                .table(tableData)
                .insert(eventoData)
                data["data"] = eventoData
            }
            else return validationData
          }


          const Pessoa_not_id = await functionsDatabase.userIDToPessoaID(request.userID)
          GlbnotificacaoFunctions.storeToEntidade({
            request,
            ENTIDADE_ID: "" + Env.get('IDJ_ID', ""),
            MSG: "Criou um pedido de um evento.",
            TITULO: null,
            PESSOA_ID: Pessoa_not_id,
            URL: "/eventos/eventospedidos"
          })
          
          return (data)
        }
        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
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
        const extractRequest = functionsDatabase.extractRequest(list, ["REL_PESSOA_ENTIDADE_REGISTO_ID","ESTADO"])

        let data = request.only(extractRequest)
        let premios = request.input("premios")
        let eventoData = request.input("data")
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);

        if (validation.status === 'ok') {

          delete data.REL_PESSOA_ENTIDADE_REGISTO_ID;

          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)


          if (newE === 1) {
            if (premios) {
              data["premios"] = [];
              const tablePremios = "eventopremios"
              await DatabaseDB
                .table(tablePremios)
                .where('ENTIDADE_EVENTO_ID', '' + params.id)
                .userID(request.userID)
                .delete()

              for (let index = 0; index < premios.length; index++) {
                const premio = premios[index];
                premio.ID = await functionsDatabase.createID(tablePremios)
                premio.DT_REGISTO = functionsDatabase.createDateNow(tablePremios)
                premio.ESTADO = 1
                premio.ENTIDADE_EVENTO_ID = params.id
                premio.CRIADO_POR = request.userID

                const listPremios = await functionsDatabase.DBMaker(tablePremios);
                const extractRequestPremio = functionsDatabase.extractRequest(listPremios, [])
                const validationPremios = await functionsDatabase.validation(listPremios, premio, extractRequestPremio, tablePremios);
                if (validationPremios.status === 'ok') {
                  await Database
                    .table(tablePremios)
                    .insert(premio)
                    data["premios"].push(premio)
                }
                else return validationPremios
              }
            }

            if (eventoData) {
              const tableData = "eventodata"
              await DatabaseDB
                .table(tableData)
                .where('ENTIDADE_EVENTO_ID', '' + params.id)
                .userID(request.userID)
                .delete()

              eventoData.ID = await functionsDatabase.createID(tableData)
              eventoData.DT_REGISTO = functionsDatabase.createDateNow(tableData)
              eventoData.ESTADO = "1"
              eventoData.ENTIDADE_EVENTO_ID = params.id
              eventoData.CRIADO_POR = request.userID


              const listData = await functionsDatabase.DBMaker(tableData);
              const extractRequestData = functionsDatabase.extractRequest(listData, [])
              const validationData = await functionsDatabase.validation(listData, eventoData, extractRequestData, tableData);
              if (validationData.status === 'ok') {
                await Database
                  .table(tableData)
                  .insert(eventoData)
                  data["data"] = eventoData
              }
              else return validationData
            }

            return (data)
          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

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

      let params = request.get()
      let dateStart = params["date-start"]
      let dateEnd = params["date-end"]
      let ANO = request.get().ANO

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = Model
        .query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('premios')
        .with('data')
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


      // if (dateStart && dateEnd) {
      //   result.whereBetween("DT_INICIO", [dateStart, dateEnd])

      // }

      if(ANO){
        result = result.whereRaw("YEAR(DT_REGISTO) = ? ",[ANO])
      }

      result = await result.orderBy("DT_REGISTO", "desc").fetch()


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
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with('premios')
          .with('data')
          .where('ID', '' + params.id)
          .with('sgigjpreventotp')
          .with('sgigjreldocumento.sgigjprdocumentotp')
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .with('sgigjentidade', (builder) => {
            builder.with('sgigjprentidadetp').with('sgigjrelcontacto.sgigjprcontactotp')
          })
          .with('sgigjreleventodespacho', (builder) => {
            builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
              .with('sgigjreleventoparecer', (builder) => {
                builder.with('parecer').with('sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_ATRIBUICAO', 'asc')
              })
          })
          .fetch()


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

      let params = request.get()
      let dateStart = params["date-start"]
      let dateEnd = params["date-end"]

      var result = Model
        .query()
        .with('sgigjpreventotp')
        .with('sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjreleventodespacho', (builder) => {
          builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
            .with('sgigjreleventoparecer', (builder) => {
              builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_ATRIBUICAO', 'asc')
            })
        })
        .where(data)
        .where('ESTADO', 1)


      if (dateStart && dateEnd) {
        result.whereBetween("DT_INICIO", [dateStart, dateEnd])

      }

      let textFilter = ""
      if (dateStart && dateEnd) {
        textFilter = moment(dateStart).format('DD-MM-Y') + " - " + moment(dateEnd).format('DD-MM-Y')
      }

      result = await result.orderBy("DT_REGISTO", "desc").fetch()

      result = result.toJSON()

      let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

      const content = `<div >
        <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
            <div style=" margin-bottom: 40px; margin-left: -20px;">
                <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
            </div>
            <h2 style="font-size: 12pt !important">Eventos Aprovados ${textFilter}</h2>

            <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
              <thead style="background-color:#2b7fb9;color:#fff">
                <tr>
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

                ${(() => {
          let tbody = ""
          for (let index = 0; index < result.length; index++) {
            const element = result[index];

            tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
        <td > ${element.sgigjentidade.DESIG}</tb>
        <td > ${element.DESIG}</tb>
        <td > ${element.NUM_SORTEIO_NOITE}</tb>
        <td > ${element.sgigjrelpessoaentidade.sgigjpessoa.NOME}</tb>
        <td > ${element.DESCR}</tb>
        <td > ${this.formatCurrency(element.PREMIO)}</tb>
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
      response.header('Content-Disposition', 'attachment; filename="evento.pdf"')
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

      let params = request.get()
      let dateStart = params["date-start"]
      let dateEnd = params["date-end"]

      var result = Model
        .query()
        .with('sgigjpreventotp')
        .with('sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjreleventodespacho', (builder) => {
          builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa')
            .with('sgigjreleventoparecer', (builder) => {
              builder.with('sgigjprdecisaotp').with('sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_ATRIBUICAO', 'asc')
            })
        })
        .where(data)
        .where('ESTADO', 1)


      if (dateStart && dateEnd) {
        result.whereBetween("DT_INICIO", [dateStart, dateEnd])

      }

      result = await result.orderBy("DT_REGISTO", "desc").fetch()

      result = result.toJSON()

      let dataResult = []
      for (let index = 0; index < result.length; index++) {
        let element = result[index];
        dataResult.push({
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
      response.header('Content-Disposition', 'attachment; filename="evento.csv"')
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

module.exports = entity
