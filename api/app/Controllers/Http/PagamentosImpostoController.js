'use strict'

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const GenericController = require("./GenericController")
const Model = use('App/Models/PagamentosImposto');
const Imposto = use('App/Models/Imposto');
const functionsDatabase = require('../functionsDatabase');

class PagamentosImpostoController extends GenericController {

    table = "pagamentosimpostos";
    Model = Model
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

            let imposto = await Imposto
                .query()
                .where("ID", data.imposto_ID)
                .where('ESTADO', 1).first()

                imposto = imposto.toJSON()

            if (!imposto || !imposto.BRUTO) {
                return { status: "fail", entity: "imposto", message: "No exist value of imposto", code: "" }
            }

            data.VALOR = imposto.BRUTO

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

    async index({ request, response }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query().orderBy('DT_REGISTO', 'desc')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('imposto')
                .with('banco')
                .with('meiopagamento')
                .with('sgigjreldocumento')
                .where(data)
                .where('ESTADO', 1)
                .fetch()
            return result
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async show({ params, response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "show", request.userID, params.id);
        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                return await Model
                    .query()
                    .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                    .where('ID', '' + params.id)
                    .where('ESTADO', 1)
                    .with('imposto')
                    .with('banco')
                    .with('meiopagamento')
                    .with('sgigjreldocumento')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }
}
module.exports = PagamentosImpostoController



