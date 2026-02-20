'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Orcamento');
const ModelCabimentacao = use('App/Models/Cabimentacao');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
let DatabaseDB = use("Database")
var pdf = require('html-pdf');


class OrcamentoController extends GenericController {

    table = "orcamentos";
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
                result = await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').where("ANO", d.getFullYear()).where('ESTADO', 1).fetch()
            }else{
                result = await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').where(data).where('ESTADO', 1).fetch()
            }
            if(!result){
                return null
            }

            result = result.toJSON()
            if (result.length > 0) {
                
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    result[index]["cabimentacao"] = (await ModelCabimentacao.query().select(DatabaseDB
                        .raw('*, sum(CABIMENTADO) as T_Cab,sum(CABIMENTADO_PERCENT) as T_Cab_Pre')).with('rubrica').with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').with('sgigjreldocumento').groupBy("RUBRICA_ID").where('ESTADO', 1).where("ORCAMENTO_ID", '' + element.ID).fetch()).toJSON()   
                }
            }

            return result

        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {
            let existDocument = false
            let document = request.input("documentos")
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            let exist = await Model
                .query()
                .where('ANO', '' + data.ANO)
                .where('ESTADO', 1).first()

            if (exist) {
                return { status: "fail", entity: "", message: "This year exist", code: "" }
            }

            data.ID = await functionsDatabase.createID(this.table)
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID
            data.ORCAMENTO_DISPONIVEL = data.ORCAMENTO_CORRIGIDO
            data.SALDO_DISPONIVEL = data.ORCAMENTO_DISPONIVEL

            if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(this.table)

            if (list.key) {
                for (let index = 0; index < list.key.length; index++) {
                    const element = list.key[index];
                    if (element.name === "USER_ID") {
                        data.USER_ID = request.userID
                    }

                    if (element.name === "DOCUMENT_ID") {
                        existDocument = true
                    }

                }
            }


            if (document && existDocument) {
                document.ID = await functionsDatabase.createID(this.tableDocument)
                document.DT_REGISTO = functionsDatabase.createDateNow(this.tableDocument)
                document.ESTADO = 1

                const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
                const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, this.tableDocument);
                if (validationDocuments.status === 'ok') {
                    const newE = await Database
                        .table(this.tableDocument)
                        .insert(document)
                    if (newE[0] === 0) {
                        data.DOCUMENT_ID = document.ID
                    }
                }
                else return validationDocuments
            }

            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);
            if (validation.status === 'ok') {
                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] === 0) {
                    if (document && existDocument) {
                        data["sgigjreldocumento"] = document
                    }
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

                let existDocument = false
                let document = request.input("documentos")
                const list = await functionsDatabase.DBMaker(this.table);
                const extractRequest = functionsDatabase.extractRequest(list, ["ESTADO"])

                let data = request.only(extractRequest)
                data.ORCAMENTO_DISPONIVEL = data.ORCAMENTO_CORRIGIDO
                data.SALDO_DISPONIVEL = data.ORCAMENTO_DISPONIVEL
                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                if (list.key) {
                    for (let index = 0; index < list.key.length; index++) {
                        const element = list.key[index];
                        if (element.name === "DOCUMENT_ID") {
                            existDocument = true
                        }
                    }
                }

                if (document && existDocument) {
                    document.ID = await functionsDatabase.createID(this.tableDocument)
                    document.DT_REGISTO = functionsDatabase.createDateNow(this.tableDocument)
                    document.ESTADO = 1

                    const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
                    const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                    const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, this.tableDocument);
                    if (validationDocuments.status === 'ok') {
                        const newE = await Database
                            .table(this.tableDocument)
                            .insert(document)
                        if (newE[0] === 0) {
                            data.DOCUMENT_ID = document.ID
                        }
                    } else {
                        return validationDocuments
                    }
                }

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
                    .fetch()).toJSON()

                if (result.length > 0) {
                    result[0]["cabimentacao"] = (await ModelCabimentacao.query().select(DatabaseDB
                        .raw('*, sum(CABIMENTADO) as T_Cab,sum(CABIMENTADO_PERCENT) as T_Cab_Pre')).with('rubrica').with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').with('sgigjreldocumento').groupBy("RUBRICA_ID").where('ESTADO', 1).where("ORCAMENTO_ID", '' + params.id).fetch()).toJSON()
                }
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

            const d = new Date();
            var orcalmentoModel = (await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').where("ANO", d.getFullYear()).where('ESTADO', 1).first()).toJSON()


            // let ORCAMENTO_INICIAL = 0
            // let ORCAMENTO_CORRIGIDO = 0
            // let ORCAMENTO_ESTADO = 0
            // let ORCAMENTO_DISPONIVEL = 0
            let CABIMENTADO = 0
            // let CABIMENTADO_PERCENT = 0
            // let PAGO = 0
            // let PAGO_PERCENT = 0
            let SALDO_DISPONIVEL = 0
            // let PROJECTO = 0
            let result = null

            if (orcalmentoModel) {
                SALDO_DISPONIVEL = orcalmentoModel.ORCAMENTO_DISPONIVEL
                // result = result.toJSON()
                result = (await ModelCabimentacao.query().select(DatabaseDB
                    .raw('*, sum(CABIMENTADO) as T_Cab,sum(CABIMENTADO_PERCENT) as T_Cab_Pre')).with('rubrica').with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').with('sgigjreldocumento').groupBy("RUBRICA_ID").where('ESTADO', 1).where("ORCAMENTO_ID", '' + orcalmentoModel.ID).fetch()).toJSON()
            }
            let dataResult = []
            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                SALDO_DISPONIVEL = SALDO_DISPONIVEL - element.T_Cab
                CABIMENTADO = CABIMENTADO + element.T_Cab

                // ORCAMENTO_INICIAL = ORCAMENTO_INICIAL + element.ORCAMENTO_INICIAL
                // ORCAMENTO_CORRIGIDO = ORCAMENTO_CORRIGIDO + element.ORCAMENTO_CORRIGIDO
                // ORCAMENTO_ESTADO = ORCAMENTO_ESTADO + element.ORCAMENTO_ESTADO
                // ORCAMENTO_DISPONIVEL = ORCAMENTO_DISPONIVEL + element.ORCAMENTO_DISPONIVEL
                // CABIMENTADO = CABIMENTADO + element.CABIMENTADO
                // CABIMENTADO_PERCENT = CABIMENTADO_PERCENT + (element.cabimentacao ? element.cabimentacao[0].CABIMENTADO : 0)
                // PAGO = PAGO + element.PAGO
                // SALDO_DISPONIVEL = SALDO_DISPONIVEL + element.SALDO_DISPONIVEL
                // PAGO_PERCENT = PAGO_PERCENT + (element.cabimentacao ? element.cabimentacao[0].CABIMENTADO_PERCENT : 0)
                // PROJECTO = PROJECTO + (element.projeto && element.projeto.length > 0 ? 1 : 0)

                dataResult.push({
                    "Pagamento": element.DT_PAGAMENTO ? "Sim" : "Não",
                    "Rubrica": element.rubrica && element.rubrica.length > 0 ? element.rubrica[0].DESIGNACAO : '',
                    "Orç. Inicial": orcalmentoModel.ORCAMENTO_INICIAL,
                    "Orç. Corrigido": orcalmentoModel.ORCAMENTO_CORRIGIDO,
                    "Orç. Disponivel": orcalmentoModel.ORCAMENTO_DISPONIVEL,
                    "Cabimento": element.T_Cab,
                    "% Cabimento": element.T_Cab_Pre,
                    "Pago": element.T_Cab,
                    "% Pago": element.T_Cab,
                    "Saldo Disponivel": SALDO_DISPONIVEL,
                })
            }

            let dataCsv = this.toCsv(dataResult)
            if (dataResult.length > 0) {
                dataCsv = dataCsv + "\r\n"

                dataCsv = dataCsv + this.toCsv([
                    {
                        "TOTAL": "TOTAL",
                        "Rubrica": "",
                        "Orç. Inicial": Math.round(orcalmentoModel.ORCAMENTO_INICIAL),
                        "Orç. Corrigido": Math.round(orcalmentoModel.ORCAMENTO_CORRIGIDO),
                        "Orç. Disponivel": Math.round(orcalmentoModel.ORCAMENTO_DISPONIVEL),
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

            const d = new Date();
            var orcalmentoModel = (await Model.query().orderBy('DT_REGISTO', 'desc').with('projeto').with('rubrica').with('cabimentacao').where("ANO", d.getFullYear()).where('ESTADO', 1).first()).toJSON()


            let ORCAMENTO_INICIAL = 0
            let ORCAMENTO_CORRIGIDO = 0
            let ORCAMENTO_ESTADO = 0
            let ORCAMENTO_DISPONIVEL = 0
            let CABIMENTADO = 0
            let CABIMENTADO_PERCENT = 0
            let PAGO = 0
            let PAGO_PERCENT = 0
            let SALDO_DISPONIVEL = 0
            let PROJECTO = 0
            let result = null




            let textFilter = ""
            textFilter = " - " + d.getFullYear()

            if (orcalmentoModel) {
                SALDO_DISPONIVEL = orcalmentoModel.ORCAMENTO_DISPONIVEL
                result = (await ModelCabimentacao.query().select(DatabaseDB
                    .raw('*, sum(CABIMENTADO) as T_Cab,sum(CABIMENTADO_PERCENT) as T_Cab_Pre')).with('rubrica').with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').with('sgigjreldocumento').groupBy("RUBRICA_ID").where('ESTADO', 1).where("ORCAMENTO_ID", '' + orcalmentoModel.ID).fetch()).toJSON()
            }


            if (data["PROJETO_ID"] && result.length > 0) {

                let nameProjecto = result[0].projeto.length ? result[0].projeto[0].NOME : ""
                textFilter = textFilter + " - " + nameProjecto
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
                    ${(() => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];

                        SALDO_DISPONIVEL = SALDO_DISPONIVEL - element.T_Cab
                        CABIMENTADO = CABIMENTADO + element.T_Cab
                        // ORCAMENTO_INICIAL = ORCAMENTO_INICIAL + element.ORCAMENTO_INICIAL
                        // ORCAMENTO_CORRIGIDO = ORCAMENTO_CORRIGIDO + element.ORCAMENTO_CORRIGIDO
                        // ORCAMENTO_ESTADO = ORCAMENTO_ESTADO + element.ORCAMENTO_ESTADO
                        // ORCAMENTO_DISPONIVEL = ORCAMENTO_DISPONIVEL + element.ORCAMENTO_DISPONIVEL
                        // CABIMENTADO = CABIMENTADO + (element.cabimentacao.length > 0 ? element.cabimentacao[0].CABIMENTADO : 0)
                        // CABIMENTADO_PERCENT = CABIMENTADO_PERCENT + (element.cabimentacao.length > 0 ? element.cabimentacao[0].CABIMENTADO_PERCENT : 0)
                        // PAGO = PAGO + element.PAGO
                        // SALDO_DISPONIVEL = SALDO_DISPONIVEL + element.SALDO_DISPONIVEL
                        // PAGO_PERCENT = PAGO_PERCENT + element.PAGO_PERCENT
                        // PROJECTO = PROJECTO + (element.projeto && element.projeto.length > 0 ? 1 : 0)

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                            <td style="text-align: center;"> ${element.DT_PAGAMENTO ? '<span style="background: green; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
                            <td style="text-align: center;"> ${element.rubrica && element.rubrica.length > 0 ? element.rubrica[0].DESIGNACAO : ''}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(orcalmentoModel.ORCAMENTO_INICIAL)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(orcalmentoModel.ORCAMENTO_CORRIGIDO)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(orcalmentoModel.ORCAMENTO_DISPONIVEL)}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.T_Cab)}</tb>
                            <td style="text-align: center;"> ${element.T_Cab_Pre}</tb>
                            <td style="text-align: center;"> ${this.formatCurrency(element.T_Cab)}</tb>
                            <td style="text-align: right;"> ${element.T_Cab_Pre}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(SALDO_DISPONIVEL)}</tb>
                        </tr>`

                    }
                    return tbody
                })()}

                ${(() => {
                    if (result.length > 0) {
                        return `<tr style="background-color:#b9bdba;font-weight: bold">
                        <td style="text-align: center;font-weight: bold">TOTAL</tb>
                        <td style="text-align: center;"></tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(orcalmentoModel.ORCAMENTO_INICIAL)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(orcalmentoModel.ORCAMENTO_CORRIGIDO)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(orcalmentoModel.ORCAMENTO_DISPONIVEL)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(CABIMENTADO)}</tb>
                        <td style="text-align: right;font-weight: bold"> </tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(CABIMENTADO)}</tb>
                        <td style="text-align: right;font-weight: bold"> </tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(SALDO_DISPONIVEL)}</tb>
                       
                   </tr>`
                    }
                    return ''
                })()}
                
                  </tbody>
                </table>
            <div>`

            return content
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

module.exports = OrcamentoController
