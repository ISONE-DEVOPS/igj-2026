'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Projeto');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const functionsDatabase = require('../functionsDatabase');

class ProjetoController extends GenericController {

    table = "projetos";
    Model = Model

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            // let exist = await Model
            //     .query()
            //     .where('ANO', '' + data.ANO)
            //     .where('ESTADO', 1).first()

            // if (exist) {
            //     return { status: "fail", entity: "", message: "This year exist", code: "" }
            // }

            data.ID = await functionsDatabase.createID(this.table)
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID
            data.ORCAMENTO_DISPONIVEL = data.ORCAMENTO_CORRIGIDO
            data.SALDO_DISPONIVEL = data.ORCAMENTO_DISPONIVEL
            data.USER_ID = request.userID

            if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(this.table)

            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);
            if (validation.status === 'ok') {
                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] === 0) {
                    return (data)
                }

                else return { status: "fail", entity: "", message: "", code: "" }

            } else return validation


        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "create not allwed", code: "4051" })
    }

    async update({ params, request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "update", request.userID, params.id);

        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }
            else {
                const list = await functionsDatabase.DBMaker(this.table);
                const extractRequest = functionsDatabase.extractRequest(list, ["ESTADO"])

                let data = request.only(extractRequest)
                data.ORCAMENTO_DISPONIVEL = data.ORCAMENTO_CORRIGIDO
                data.SALDO_DISPONIVEL = data.ORCAMENTO_DISPONIVEL
                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .where('ESTADO', 1)
                        .userID(request.userID)
                        .update(data)


                    if (newE === 1) {
                        return (data)
                    }

                    else return { status: "fail", entity: "", message: "", code: "" }

                } else return validation
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "update not allwed", code: "4052" })
    }

    async exportCsv({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

            let ORCAMENTO_INICIAL = 0
            let ORCAMENTO_CORRIGIDO = 0
            let ORCAMENTO_DISPONIVEL = 0
            let CABIMENTADO = 0
            let PAGO = 0
            let PAGO_PERCENT = 0
            let SALDO_DISPONIVEL = 0

            let dataResult = []


            let result = (await Model.query().orderBy('DT_REGISTO', 'desc').where('ESTADO', 1).where(data).fetch()).toJSON()
            if (result.length > 0) {
                for (let index = 0; index < result.length; index++) {
                    let element = result[index];

                   
                    ORCAMENTO_INICIAL = ORCAMENTO_INICIAL + element.ORCAMENTO_INICIAL
                    ORCAMENTO_CORRIGIDO = ORCAMENTO_CORRIGIDO + element.ORCAMENTO_CORRIGIDO
                    ORCAMENTO_DISPONIVEL = ORCAMENTO_DISPONIVEL + element.ORCAMENTO_DISPONIVEL
                    PAGO = PAGO + element.PAGO
                    SALDO_DISPONIVEL = SALDO_DISPONIVEL + element.SALDO_DISPONIVEL
                    PAGO_PERCENT = PAGO_PERCENT + element.PAGO_PERCENT

                    dataResult.push({
                        "Ano": element.ANO,
                        "Orç. Inicial": element.ORCAMENTO_INICIAL,
                        "Orç. Corrigido": element.ORCAMENTO_CORRIGIDO,
                        "Orç. Disponivel": element.ORCAMENTO_DISPONIVEL,
                        "Pago": element.PAGO,
                        "% Pago": element.PAGO_PERCENT,
                        "Saldo Disponivel": element.SALDO_DISPONIVEL,
                    })
                }
            }

            let dataCsv = this.toCsv(dataResult)
            if (dataResult.length > 0) {
                dataCsv = dataCsv + "\r\n"

                dataCsv = dataCsv + this.toCsv([
                    {
                        "TOTAL": "TOTAL",
                        "Orç. Inicial": Math.round(ORCAMENTO_INICIAL),
                        "Orç. Corrigido": Math.round(ORCAMENTO_CORRIGIDO),
                        "Orç. Disponivel": Math.round(ORCAMENTO_DISPONIVEL),
                        "Pago": Math.round(CABIMENTADO),
                        "% Pago": "",
                        "Saldo Disponivel": Math.round(SALDO_DISPONIVEL),
                    }
                ], false)
            }

            await Database
                .table(this.table)
                .userID(request.userID)
                .registerExport("CSV")

            response.header('Content-type', 'text/csv')
            response.header('Content-Disposition', 'attachment; filename="orcalmento.csv"')
            return response.send(dataCsv)
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async exportPdf({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])


            let ORCAMENTO_INICIAL = 0
            let ORCAMENTO_CORRIGIDO = 0
            let ORCAMENTO_DISPONIVEL = 0
            let SALDO_DISPONIVEL = 0

            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Ano</th>
                       <th style="text-align: center;">Orç. Inicial</th>
                       <th style="text-align: center;">Orç. Corrigido</th>
                       <th style="text-align: center;">Orç. Disponivel</th>
                       <th style="text-align: center;">Pago</th>
                       <th style="text-align: center;">% Pago</th>
                       <th style="text-align: center;">Saldo Disponivel</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>
                    ${await (async () => {
                   
                    var result = (await Model.query().orderBy('DT_REGISTO', 'desc').where('ESTADO', 1).where(data).fetch()).toJSON()
                    let tbody = ""
                    if (!result) {
                        return ''
                    }
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];

                        ORCAMENTO_INICIAL = ORCAMENTO_INICIAL + element.ORCAMENTO_INICIAL
                        ORCAMENTO_CORRIGIDO = ORCAMENTO_CORRIGIDO + element.ORCAMENTO_CORRIGIDO
                        ORCAMENTO_DISPONIVEL = ORCAMENTO_DISPONIVEL + element.ORCAMENTO_DISPONIVEL
                        SALDO_DISPONIVEL = SALDO_DISPONIVEL + element.SALDO_DISPONIVEL

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                            <td style="text-align: center;"> ${element.ANO}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_INICIAL)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_CORRIGIDO)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_DISPONIVEL)}</tb>
                            <td style="text-align: center;"> ${this.formatCurrency(element.PAGO)}</tb>
                            <td style="text-align: right;"> ${element.PAGO_PERCENT}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.SALDO_DISPONIVEL)}</tb>
                        </tr>`

                    }
                    return tbody
                })()}

                ${(() => {
                    return `<tr style="background-color:#b9bdba;font-weight: bold">
                        <td style="text-align: center;font-weight: bold">TOTAL</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(ORCAMENTO_INICIAL)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(ORCAMENTO_CORRIGIDO)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(ORCAMENTO_DISPONIVEL)}</tb>
                        <td style="text-align: right;font-weight: bold"> </tb>
                        <td style="text-align: right;font-weight: bold"> </tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(SALDO_DISPONIVEL)}</tb>
                       
                   </tr>`
                })()}
                
                  </tbody>
                </table>
            <div>`

            await Database
                .table(this.table)
                .userID(request.userID)
                .registerExport("PDF")

            response.header('Content-type', 'application/pdf')
            response.header('Content-Disposition', 'attachment; filename="orcalmento.pdf"')
            return response.send(await this.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }
}

module.exports = ProjetoController



