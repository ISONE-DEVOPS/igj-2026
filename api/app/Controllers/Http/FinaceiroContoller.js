'use strict'

const GenericController = require("./GenericController")
const Premio = use('App/Models/Premio');
const Imposto = use('App/Models/Imposto');
const Contrapartida = use('App/Models/Contrapartida');
const Contibuicoes = use('App/Models/Contribuicoes');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
let DatabaseDB = use("Database")

class FinaceiroContoller extends GenericController {

    async index({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
          try {
            let DATA_INCIO = request.get().DATA_INICIO
            let DATA_FIM = request.get().DATA_FIM


            if (DATA_INCIO) {
                DATA_INCIO = (new Date(DATA_INCIO)).getFullYear();
            }
            if (DATA_FIM) {
                DATA_FIM = (new Date(DATA_FIM)).getFullYear();
            }

            var result = await this.getData(DATA_INCIO, DATA_FIM)

            let premios = 0
            let premios_subsequente = 0
            let imposto = 0
            let bruto = 0
            let contrapartida = 0
            let contribuicoes = 0
            let dataResult = []


            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                let PREMIOS = element.PREMIOS ? (function () {
                    let val = 0
                    for (let index = 0; index < element.PREMIOS.length; index++) {
                        const currentValue = element.PREMIOS[index];
                        if (currentValue.ESTADO != 0 && currentValue.PREMIOS_ID === null) {
                            val = val + currentValue.VALOR
                        }

                    }
                    return val
                })() : 0

                premios = premios + PREMIOS
                let PREMIOS_SUBSEQUENTE = element.PREMIOS ? element.PREMIOS.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 && currentValue.PREMIOS_ID ? accumulator + currentValue.VALOR : accumulator + 0,
                    0
                ) : 0


                premios_subsequente = premios_subsequente + PREMIOS_SUBSEQUENTE
                let BRUTO = element.IMPOSTo ? element.IMPOSTo.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTALBRUTO : accumulator + 0,
                    0
                ) : 0

                bruto = bruto + BRUTO
                let IMPOSTO = element.IMPOSTo ? element.IMPOSTo.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTAL_IMPOSTO : accumulator + 0,
                    0
                ) : 0


                imposto = imposto + IMPOSTO
                let CONTRAPARTIDA = element.CONTRAPARTIDA ? element.CONTRAPARTIDA.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + (currentValue.TOTAL_Art_48_percent + currentValue.TOTAL_Art_49_percent) : accumulator + 0,
                    0
                ) : 0

                contrapartida = contrapartida + CONTRAPARTIDA
                let CONTRIBUICOES = element.CONTRIBUICOES ? element.CONTRIBUICOES.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTAL_VALOR : accumulator + 0,
                    0
                ) : 0

                contribuicoes = contribuicoes + CONTRIBUICOES

                dataResult.push({
                    "Ano": element.ANO,
                    "Prémio Inicial": PREMIOS ? PREMIOS : "",
                    "Prémio Subsequente": PREMIOS_SUBSEQUENTE ? PREMIOS_SUBSEQUENTE : "",
                    "Receita Bruta": BRUTO ? BRUTO : "",
                    "Imposto": IMPOSTO ? IMPOSTO : "",
                    "Contrapartida": CONTRAPARTIDA ? CONTRAPARTIDA : "",
                    "Contribuições IGJ": CONTRIBUICOES ? CONTRIBUICOES : "",
                    "Total Recibo": PREMIOS + PREMIOS_SUBSEQUENTE + IMPOSTO + CONTRAPARTIDA + CONTRIBUICOES
                })
            }



            dataResult.push(
                {
                    "Total": "TOTAL",
                    "Prémio Inicial": premios ? Math.round(premios) : "",
                    "Prémio Subsequente": premios_subsequente ? Math.round(premios_subsequente) : "",
                    "Receita Bruta": bruto ? Math.round(bruto) : "",
                    "Imposto": imposto ? Math.round(imposto) : "",
                    "Contrapartida": contrapartida ? Math.round(contrapartida) : "",
                    "Contribuições IGJ": contribuicoes ? Math.round(contribuicoes) : "",
                    "Total Recibo": Math.round(premios + premios_subsequente + imposto + contrapartida + contribuicoes)
                }
            )

            return dataResult
          } catch (err) {
            console.error('FinaceiroContoller.index ERROR:', err.message, err.stack)
            return response.status(500).json({ status: "500Error", message: err.message })
          }
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }


    async getData(DATA_INCIO, DATA_FIM) {
        DATA_INCIO = DATA_INCIO ? DATA_INCIO : 2022
        DATA_FIM = DATA_FIM ? DATA_FIM : 2040
        let result = []

        for (let index = DATA_INCIO; index <= DATA_FIM; index++) {

            let premios = (await Premio.query().where('ANO', index).where('ESTADO', 1).fetch()).toJSON()
            let imposto = (await Imposto.query().select(DatabaseDB
                .raw('ANO, sum(IMPOSTO) as TOTAL_IMPOSTO, sum(BRUTO) as TOTALBRUTO')).groupBy("ANO").where('ANO', index).where('ESTADO', 1).fetch()).toJSON()
            let contrapartida = (await Contrapartida.query().select(DatabaseDB
                .raw('ANO, sum(BRUTO) as TOTAL_BRUTO, sum(Art_48_percent) as TOTAL_Art_48_percent, sum(Art_49_percent) as TOTAL_Art_49_percent')).groupBy("ANO").where('ANO', index).where('ESTADO', 1).fetch()).toJSON()
            let contribuicoes = (await Contibuicoes.query().select(DatabaseDB
                .raw('ANO, sum(VALOR) as TOTAL_VALOR')).groupBy("ANO").where('ANO', index).where('ESTADO', 1).fetch()).toJSON()

            if (premios.length > 0 || imposto.length > 0 || contrapartida.length > 0 || contribuicoes.length > 0) {

                result.push({
                    "ANO": index,
                    "PREMIOS": premios,
                    "IMPOSTo": imposto,
                    "CONTRAPARTIDA": contrapartida,
                    "CONTRIBUICOES": contribuicoes,
                })
            }
        }

        return result
    }

    async exportCsv({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (allowedMethod || true) {
            let DATA_INCIO = request.get().DATA_INICIO
            let DATA_FIM = request.get().DATA_FIM

            var result = await this.getData(DATA_INCIO, DATA_FIM)

            let premios = 0
            let premios_subsequente = 0
            let imposto = 0
            let bruto = 0
            let contrapartida = 0
            let contribuicoes = 0
            let dataResult = []

            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                let PREMIOS = element.PREMIOS ? (function () {
                    let val = 0
                    for (let index = 0; index < element.PREMIOS.length; index++) {
                        const currentValue = element.PREMIOS[index];
                        if (currentValue.ESTADO != 0 && currentValue.PREMIOS_ID === null) {
                            val = val + currentValue.VALOR
                        }

                    }
                    return val
                })() : 0

                premios = premios + PREMIOS
                let PREMIOS_SUBSEQUENTE = element.PREMIOS ? element.PREMIOS.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 && currentValue.PREMIOS_ID ? accumulator + currentValue.VALOR : accumulator + 0,
                    0
                ) : 0


                premios_subsequente = premios_subsequente + PREMIOS_SUBSEQUENTE
                let BRUTO = element.IMPOSTo ? element.IMPOSTo.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTALBRUTO : accumulator + 0,
                    0
                ) : 0

                bruto = bruto + BRUTO
                let IMPOSTO = element.IMPOSTo ? element.IMPOSTo.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTAL_IMPOSTO : accumulator + 0,
                    0
                ) : 0


                imposto = imposto + IMPOSTO
                let CONTRAPARTIDA = element.CONTRAPARTIDA ? element.CONTRAPARTIDA.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + (currentValue.TOTAL_Art_48_percent + currentValue.TOTAL_Art_49_percent) : accumulator + 0,
                    0
                ) : 0

                contrapartida = contrapartida + CONTRAPARTIDA
                let CONTRIBUICOES = element.CONTRIBUICOES ? element.CONTRIBUICOES.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTAL_VALOR : accumulator + 0,
                    0
                ) : 0

                contribuicoes = contribuicoes + CONTRIBUICOES

                dataResult.push({
                    "Ano": element.ANO,
                    "Prémio Inicial": PREMIOS ? Math.round(PREMIOS) : "",
                    "Prémio Subsequente": PREMIOS_SUBSEQUENTE ? Math.round(PREMIOS_SUBSEQUENTE) : "",
                    "Receita Bruta": BRUTO ? Math.round(BRUTO) : "",
                    "Imposto": IMPOSTO ? Math.round(IMPOSTO) : "",
                    "Contrapartida": CONTRAPARTIDA ? Math.round(CONTRAPARTIDA) : "",
                    "Contribuições IGJ": CONTRIBUICOES ? Math.round(CONTRIBUICOES) : "",
                    "Total Recibo": Math.round(PREMIOS + PREMIOS_SUBSEQUENTE + IMPOSTO + CONTRAPARTIDA + CONTRIBUICOES)
                })
            }


            let data = this.toCsv(dataResult)

            if (result.length > 0) {
                data = data + "\r\n"
                data = data + this.toCsv([
                    {
                        "Total": "TOTAL",
                        "Prémio Inicial": premios ? Math.round(premios) : "",
                        "Prémio Subsequente": premios_subsequente ? Math.round(premios_subsequente) : "",
                        "Receita Bruta": bruto ? Math.round(bruto) : "",
                        "Imposto": imposto ? Math.round(imposto) : "",
                        "Contrapartida": contrapartida ? Math.round(contrapartida) : "",
                        "Contribuições IGJ": contribuicoes ? Math.round(contribuicoes) : "",
                        "Total Recibo": Math.round(premios + premios_subsequente + imposto + contrapartida + contribuicoes)
                    }
                ], false)
            }

            await Database
                .table(this.table)
                .userID(request.userID)
                .registerExport("CSV")

            response.header('Content-type', 'text/csv')
            response.header('Content-Disposition', 'attachment; filename="finaceiro.csv"')
            return response.send(data)
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async exportPdf({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (true) {
            let DATA_INCIO = request.get().DATA_INICIO
            let DATA_FIM = request.get().DATA_FIM

            var result = await this.getData(DATA_INCIO, DATA_FIM)

            let premios = 0
            let premios_subsequente = 0
            let imposto = 0
            let bruto = 0
            let contrapartida = 0
            let contribuicoes = 0

            let textFilter = ""
            if (DATA_INCIO && DATA_FIM) {
                textFilter = moment(DATA_INCIO).format('DD-MM-Y') + " - " + moment(DATA_FIM).format('DD-MM-Y')
            }

            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>
                <h2 style="font-size: 12pt !important">Visão Geral ${textFilter}</h2>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Ano</th>
                       <th style="text-align: center;">Prémio Inicial</th>
                       <th style="text-align: center;">Prémio Subsequente</th>
                       <th style="text-align: center;">Receita Bruta</th>
                       <th style="text-align: center;">Imposto</th>
                       <th style="text-align: center;">Contrapartida</th>
                       <th style="text-align: center;">Contribuições IGJ</th>
                       <th style="text-align: center;">Total Recibo</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>

                    ${(() => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        let element = result[index];

                        let PREMIOS = element.PREMIOS ? (function () {
                            let val = 0
                            for (let index = 0; index < element.PREMIOS.length; index++) {
                                const currentValue = element.PREMIOS[index];
                                if (currentValue.ESTADO != 0 && currentValue.PREMIOS_ID === null) {
                                    val = val + currentValue.VALOR
                                }

                            }
                            return val
                        })() : 0

                        premios = premios + PREMIOS
                        let PREMIOS_SUBSEQUENTE = element.PREMIOS ? element.PREMIOS.reduce(
                            (accumulator, currentValue) => currentValue.ESTADO != 0 && currentValue.PREMIOS_ID ? accumulator + currentValue.VALOR : accumulator + 0,
                            0
                        ) : 0


                        premios_subsequente = premios_subsequente + PREMIOS_SUBSEQUENTE
                        let BRUTO = element.IMPOSTo ? element.IMPOSTo.reduce(
                            (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTALBRUTO : accumulator + 0,
                            0
                        ) : 0

                        bruto = bruto + BRUTO
                        let IMPOSTO = element.IMPOSTo ? element.IMPOSTo.reduce(
                            (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTAL_IMPOSTO : accumulator + 0,
                            0
                        ) : 0


                        imposto = imposto + IMPOSTO
                        let CONTRAPARTIDA = element.CONTRAPARTIDA ? element.CONTRAPARTIDA.reduce(
                            (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + (currentValue.TOTAL_Art_48_percent + currentValue.TOTAL_Art_49_percent) : accumulator + 0,
                            0
                        ) : 0

                        contrapartida = contrapartida + CONTRAPARTIDA
                        let CONTRIBUICOES = element.CONTRIBUICOES ? element.CONTRIBUICOES.reduce(
                            (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.TOTAL_VALOR : accumulator + 0,
                            0
                        ) : 0

                        contribuicoes = contribuicoes + CONTRIBUICOES

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                         <td style="text-align: center;"> ${element.ANO}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(PREMIOS)}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(PREMIOS_SUBSEQUENTE)}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(BRUTO)}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(IMPOSTO)}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(CONTRAPARTIDA)}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(CONTRIBUICOES)}</tb>
             <td style="text-align: right;"> ${this.formatCurrency(PREMIOS + PREMIOS_SUBSEQUENTE + IMPOSTO + CONTRAPARTIDA + CONTRIBUICOES)}</tb>
            </tr>`
                    }
                    return tbody
                })()}
               ${(() => {
                    if (result.length > 0) {
                        return ` <tr style="background-color:#b9bdba;font-weight: bold">
                        <td style="text-align: center;font-weight: bold">TOTAL</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(premios)}</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(premios_subsequente)}</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(bruto)}</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(imposto)}</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(contrapartida)}</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(contribuicoes)}</td>
                        <td style="text-align: right;font-weight: bold">${this.formatCurrency(premios + premios_subsequente + imposto + contrapartida + contribuicoes)}</td>
                   </tr>`
                    }
                    return ``
                })()}
                  </tbody>
                </table>
            <div>`

            await Database
                .table(this.table)
                .userID(request.userID)
                .registerExport("PDF")

            response.header('Content-type', 'application/pdf')
            response.header('Content-Disposition', 'attachment; filename="finaceiro.pdf"')
            return response.send(await this.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

}

module.exports = FinaceiroContoller
