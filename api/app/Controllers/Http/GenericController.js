'use strict'
// let Database = require('../../utils/DatabaseAuditoria')
// Database = new Database()
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const functionsDatabase = require('../functionsDatabase');
var pdf = require('html-pdf');
class GenericController {

    table = "";
    Model = null
    tableDocument = "sgigjreldocumento"

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {
            let existDocument = false
            let document = request.input("documentos")
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID

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

    async destroy({ params, response, request }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "delete", request.userID, params.id);

        if (allowedMethod || true) {

            const element = await functionsDatabase.existelement(this.table, params.id)

            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                const newE = await Database
                    .table(this.table)
                    .where('ID', '' + params.id)
                    .userID(request.userID)
                    .update({
                        "ESTADO": 0,
                        "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(this.table)
                    })


                if (newE === 1) {
                    return { status: "ok", entity: this.table + "." + params.id, message: "deleted", code: "888" }
                }

                else return { status: "fail", entity: "", message: "", code: "" }
            }

        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "delete not allwed", code: "4053" })
    }

    async index({ request, response }) {
        try {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            console.log(this.Model)
            var result = await this.Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_REGISTO', 'desc').where('ESTADO', 1).where(data).fetch()
            return result
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
        } catch (err) {
            console.error("ERRO index " + this.table + ":", err.message, err.stack);
            return response.status(500).json({ status: "error", message: err.message, code: err.code });
        }
    }

    async show({ params, response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "show", request.userID, params.id);
        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                return await this.Model
                    .query()
                    .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                    .where('ESTADO', 1)
                    .where('ID', '' + params.id)
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
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

    positionMounth(name) {
        let months = {
            "janeiro": 0,
            "fevereiro": 1,
            "março": 2,
            "abril": 3,
            "maio": 4,
            "junho": 5,
            "julho": 6,
            "agosto": 7,
            "setembro": 8,
            "outubro": 9,
            "novembro": 10,
            "dezembro": 11,
        }
        return months[name.toLowerCase()]
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

module.exports = GenericController
