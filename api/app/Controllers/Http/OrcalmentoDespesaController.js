'use strict'


const GenericController = require("./GenericController")
const Model = use('App/Models/Orcalmentodespesa');
const functionsDatabase = require('../functionsDatabase');
const Orcamento = use('App/Models/Orcamento')
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()

class OrcalmentoDespesaController extends GenericController {

    table = "orcalmentodespesa";
    Model = Model

    async store({ request, response }) {

        
        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {
            let documents = request.input("documentos")
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID

            if (list.key) {
                for (let index = 0; index < list.key.length; index++) {
                    const element = list.key[index];
                    if (element.name === "USER_ID") {
                        data.USER_ID = request.userID
                    }

                }
            }

            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);
            if (validation.status === 'ok') {

                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] != 0) {
                    return { status: "fail", entity: "", message: "", code: "" }
                }

            } else return validation


            if (documents) {
                data.documentos = []
                for (let index = 0; index < documents.length; index++) {
                    const document = documents[index];
                    document.ID = await functionsDatabase.createID(this.tableDocument)
                    document.DT_REGISTO = functionsDatabase.createDateNow(this.tableDocument)
                    document.ESTADO = 1
                    document.ORCALMENTO_DESPESA_ID = data.ID

                    const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
                    const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                    const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, this.tableDocument);
                    if (validationDocuments.status === 'ok') {
                        const newE = await Database
                            .table(this.tableDocument)
                            .insert(document)
                        if (newE[0] === 0) {
                            data.documentos.push(document)
                        }
                    }
                    else return validationDocuments

                }

            }
            
            
            const orcamento = await Orcamento.query()
                .where('ID', data.ORCALMENTO_ID).first()

            if (orcamento) {
                await Database
                    .table("orcamentos")
                    .where('ID', '' + data.ORCALMENTO_ID)
                    .update({
                        "SALDO_DISPONIVEL": (orcamento.ORCAMENTO_DISPONIVEL - data.VALOR) < 0 ? 0 : (orcamento.ORCAMENTO_DISPONIVEL - data.VALOR),
                    },false)
            }

            return data
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "create not allwed", code: "4051" })

    }

    async update({ params, request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "update", request.userID, params.id);

        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }
            else {

                let documents = request.input("documentos")
                const list = await functionsDatabase.DBMaker(this.table);
                const extractRequest = functionsDatabase.extractRequest(list, ["ESTADO"])

                let data = request.only(extractRequest)
                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .where('ESTADO', 1)
                        .userID(request.userID)
                        .update(data)


                    if (newE !== 1) {
                        return { status: "fail", entity: "", message: "", code: "" }
                    }

                } else return validation

                if (documents) {
                    data.documentos = []

                    const deleteDocuments = await Database
                        .table(this.tableDocument)
                        .where('ORCALMENTO_DESPESA_ID', '' + params.id)
                        .delete(false)

                    for (let index = 0; index < documents.length; index++) {
                        const document = documents[index];
                        document.ID = await functionsDatabase.createID(this.tableDocument)
                        document.DT_REGISTO = functionsDatabase.createDateNow(this.tableDocument)
                        document.ESTADO = 1
                        document.ORCALMENTO_DESPESA_ID = params.id

                        const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
                        const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                        const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, this.tableDocument);
                        if (validationDocuments.status === 'ok') {
                            const newE = await Database
                                .table(this.tableDocument)
                                .insert(document)
                            if (newE[0] === 0) {
                                data.documentos.push(document)
                            }
                        } else {
                            return validationDocuments
                        }

                    }
                }

                return data

            }
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "update not allwed", code: "4052" })

    }

    async index({ request, response }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query()
                .orderBy('DT_REGISTO', 'desc')
                .with('sgigjreldocumento')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('rubrica')
                .with('orcalmento')
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
                    .with('sgigjreldocumento')
                    .with('rubrica')
                    .with('orcalmento')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }
}


module.exports = OrcalmentoDespesaController
