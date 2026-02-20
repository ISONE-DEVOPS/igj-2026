'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/ProjetoRubrica');
const Projeto = use('App/Models/Projeto');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const functionsDatabase = require('../functionsDatabase');
let DatabaseDB = use("Database")
const ModelCabimentacao = use('App/Models/Cabimentacao');
const ModelProjeto = use('App/Models/Projeto');
var pdf = require('html-pdf');

class ProjetoRubricaController extends GenericController {

    table = "projeto_rubrica";
    Model = Model

    async index({ request, response }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, [])
            let result = []
            const d = new Date();
            if (Object.keys(data).length == 0) {
                result = await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').with('cabimentacao.sgigjreldocumento').where('ESTADO', 1).fetch()
            } else {
                result = await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').with('cabimentacao.sgigjreldocumento').where(data).where('ESTADO', 1).fetch()
            }
            if (!result) {
                return null
            }

            result = result.toJSON()

            return result

        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID
            data.ORCAMENTO_DISPONIVEL = data.ORCAMENTO_CORRIGIDO
            data.SALDO_DISPONIVEL = data.ORCAMENTO_DISPONIVEL
            data.USER_ID = request.userID

            const orcamento = await Projeto.query()
                .where('ID', data.PROJETO_ID).first()

            if (!orcamento) {
                return { status: "fail", entity: "", message: "ID de Projeto nao existe", code: "" }
            }

            let total = (await Model.query().select(DatabaseDB
                .raw('sum(ORCAMENTO_DISPONIVEL) as total')).where('ESTADO', 1).where("PROJETO_ID", '' + data.PROJETO_ID).fetch()).toJSON()

            if (total) {
                total = Number(total[0]["total"]) + Number(data.ORCAMENTO_DISPONIVEL)
                if (total > orcamento.ORCAMENTO_DISPONIVEL)
                    return { status: "fail", entity: "", message: "Valor maior que o saldo disponivel de projeto", code: "500" }
            }


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

    async show({ params, response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "show", request.userID, params.id);
        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {
                let result = (await Model
                    .query()
                    .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                    .where('ID', '' + params.id)
                    .where('ESTADO', 1)
                    .with('glbuser')
                    .with('projeto')
                    .with('rubrica')
                    .with('cabimentacao')
                    .with('cabimentacao.sgigjreldocumento')
                    .fetch()).toJSON()
                return result
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }

    async exportCsv({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            // var result = await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').where(data).where('ESTADO', 1).fetch()

            // const d = new Date();
            // var projecto = await Projeto.query().where("ANO", d.getFullYear()).where('ESTADO', 1).first()


            let ORCAMENTO_INICIAL = 0
            let ORCAMENTO_CORRIGIDO = 0
            let ORCAMENTO_DISPONIVEL = 0
            let CABIMENTADO = 0
            let CABIMENTADO_PERCENT = 0
            let PAGO = 0
            let PAGO_PERCENT = 0
            let SALDO_DISPONIVEL = 0

            let dataResult = []

            // if (projecto) {
            let result = (await Model.query().orderBy('DT_REGISTO', 'desc').with('rubrica')
                // .where("PROJETO_ID", projecto.ID)
                .where('ESTADO', 1).where(data).fetch()).toJSON()

            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                let cabumentacaoValor = 0
                let cabumentacaoPre = 0

                let cabumentacao = (await ModelCabimentacao.query().select(DatabaseDB
                    .raw('*, sum(CABIMENTADO) as T_Cab,sum(CABIMENTADO_PERCENT) as T_Cab_Pre')).where('ESTADO', 1).where("PROJETO_RUBRICA_ID", '' + element.ID).fetch()).toJSON()

                if (cabumentacao) {
                    cabumentacaoValor = cabumentacao[0].T_Cab
                    cabumentacaoPre = cabumentacao[0].T_Cab_Pre
                }

                CABIMENTADO = CABIMENTADO + cabumentacaoValor
                ORCAMENTO_INICIAL = ORCAMENTO_INICIAL + element.ORCAMENTO_INICIAL
                ORCAMENTO_CORRIGIDO = ORCAMENTO_CORRIGIDO + element.ORCAMENTO_CORRIGIDO
                ORCAMENTO_DISPONIVEL = ORCAMENTO_DISPONIVEL + element.ORCAMENTO_DISPONIVEL
                CABIMENTADO_PERCENT = cabumentacaoPre ? (CABIMENTADO_PERCENT + cabumentacaoPre) : (CABIMENTADO_PERCENT)
                PAGO = PAGO + element.PAGO
                SALDO_DISPONIVEL = SALDO_DISPONIVEL + element.SALDO_DISPONIVEL
                PAGO_PERCENT = PAGO_PERCENT + element.PAGO_PERCENT

                dataResult.push({
                    //"Pagamento": element.PAGO == cabumentacaoValor ? "Sim" : "Não",
                    "Rubrica": element.rubrica ? element.rubrica.DESIGNACAO : '',
                    "Orç. Inicial": element.ORCAMENTO_INICIAL,
                    "Orç. Corrigido": element.ORCAMENTO_CORRIGIDO,
                    "Orç. Disponivel": element.ORCAMENTO_DISPONIVEL,
                    "Cabimento": cabumentacaoValor,
                    "% Cabimento": cabumentacaoPre,
                    "Pago": element.PAGO,
                    "% Pago": element.PAGO_PERCENT,
                    "Saldo Disponivel": element.SALDO_DISPONIVEL,
                })
            }
            // }

            let dataCsv = this.toCsv(dataResult)
            if (dataResult.length > 0) {
                dataCsv = dataCsv + "\r\n"

                dataCsv = dataCsv + this.toCsv([
                    {
                        "TOTAL": "TOTAL",
                        // "Rubrica": "",
                        "Orç. Inicial": Math.round(ORCAMENTO_INICIAL),
                        "Orç. Corrigido": Math.round(ORCAMENTO_CORRIGIDO),
                        "Orç. Disponivel": Math.round(ORCAMENTO_DISPONIVEL),
                        "Cabimento": Math.round(CABIMENTADO),
                        "% Cabimento": "",
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
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

            var result = (await Model.query().orderBy('DT_REGISTO', 'desc').with('rubrica').where('ESTADO', 1).where(data).fetch()).toJSON()

            let ORCAMENTO_INICIAL = 0
            let ORCAMENTO_CORRIGIDO = 0
            let ORCAMENTO_DISPONIVEL = 0
            let CABIMENTADO = 0
            let CABIMENTADO_PERCENT = 0
            let PAGO = 0
            let PAGO_PERCENT = 0
            let SALDO_DISPONIVEL = 0

            let textFilter = " - " + d.getFullYear()


            if (data["PROJETO_ID"]) {
                var projecto = (await ModelProjeto.query().where("ID", data["PROJETO_ID"]).first())

                if (projecto) {
                    projecto = projecto.toJSON()
                    let nameProjecto = projecto ? " Projeto: " + projecto.NOME : ""
                    textFilter = textFilter + " - " + nameProjecto
                }

            }


            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>
                <h2 style="font-size: 12pt !important">Orçamento ${textFilter}</h2>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Estado</th>
                       <th style="text-align: center;">Rubrica</th>
                       <th style="text-align: center;">Orç. Inicial</th>
                       <th style="text-align: center;">Orç. Corrigido</th>
                       <th style="text-align: center;">Orç. Disponivel</th>
                       <th style="text-align: center;">Cabimentado</th>
                       <th style="text-align: center;">% Cabimentado</th>
                       <th style="text-align: center;">Pago</th>
                       <th style="text-align: center;">% Pago</th>
                       <th style="text-align: center;">Saldo Disponivel</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>
                    ${await (async () => {
                    // if (!projecto) {
                    //     return ''
                    // }

                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];

                        let cabumentacaoValor = 0
                        let cabumentacaoPre = 0

                        let cabumentacao = (await ModelCabimentacao.query().select(DatabaseDB
                            .raw('*, sum(CABIMENTADO) as T_Cab,sum(CABIMENTADO_PERCENT) as T_Cab_Pre')).where('ESTADO', 1).where("PROJETO_RUBRICA_ID", '' + element.ID).fetch()).toJSON()

                        if (cabumentacao) {
                            cabumentacaoValor = cabumentacao[0].T_Cab
                            cabumentacaoPre = cabumentacao[0].T_Cab_Pre
                        }

                        CABIMENTADO = CABIMENTADO + cabumentacaoValor
                        ORCAMENTO_INICIAL = ORCAMENTO_INICIAL + element.ORCAMENTO_INICIAL
                        ORCAMENTO_CORRIGIDO = ORCAMENTO_CORRIGIDO + element.ORCAMENTO_CORRIGIDO
                        ORCAMENTO_DISPONIVEL = ORCAMENTO_DISPONIVEL + element.ORCAMENTO_DISPONIVEL
                        CABIMENTADO_PERCENT = CABIMENTADO_PERCENT + cabumentacaoPre
                        PAGO = PAGO + element.PAGO
                        SALDO_DISPONIVEL = SALDO_DISPONIVEL + element.SALDO_DISPONIVEL
                        PAGO_PERCENT = PAGO_PERCENT + element.PAGO_PERCENT

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                            <td style="text-align: center;"> 
                            ${cabumentacaoValor != 0 ? '<span style="background: gray; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;float:left;"></span>' : ''}
                            ${element.SALDO_DISPONIVEL == 0 ? '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin-left:20px;"></span>' : ''}
                            </tb>
                            <td style="text-align: center;"> ${element.rubrica ? element.rubrica.DESIGNACAO : ''}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_INICIAL)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_CORRIGIDO)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_DISPONIVEL)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(cabumentacaoValor)}</tb>
                            <td style="text-align: center;"> ${cabumentacaoPre ? cabumentacaoPre : 0}</tb>
                            <td style="text-align: center;"> ${this.formatCurrency(element.PAGO)}</tb>
                            <td style="text-align: right;"> ${element.PAGO_PERCENT ? element.PAGO_PERCENT : 0}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.SALDO_DISPONIVEL)}</tb>
                        </tr>`

                    }
                    return tbody
                })()}

                ${(() => {
                    return `<tr style="background-color:#b9bdba;font-weight: bold">
                        <td style="text-align: center;font-weight: bold">TOTAL</tb>
                        <td style="text-align: center;"></tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(ORCAMENTO_INICIAL)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(ORCAMENTO_CORRIGIDO)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(ORCAMENTO_DISPONIVEL)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(CABIMENTADO)}</tb>
                        <td style="text-align: right;font-weight: bold"> </tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(PAGO)}</tb>
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

    async toPdf(content) {

        const pdfCreater = async (data) => {
            let promise = new Promise((resolve, reject) => {
                pdf.create(data, { "format": "A4", "border": "0", "type": "pdf", "orientation": "landscape" }).toBuffer(function (err, buffer) {
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

module.exports = ProjetoRubricaController



