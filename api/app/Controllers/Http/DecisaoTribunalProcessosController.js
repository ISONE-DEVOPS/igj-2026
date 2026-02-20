'use strict'

const GenericController = require("./GenericController")
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const Model = use('App/Models/DecisaoTribunalProcessos');
const DatabaseDB = use("Database");



class DecisaoTribunalProcessosController extends GenericController {

    table = "decisao_tribunal_processos";
    Model = Model
    tableDocument = "sgigjreldocumento"

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
            const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])

            let documentos = request.input("documentos");
            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.USER_ID = request.userID
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID

            if (!documentos) {
                return { status: "fail", entity: "", message: "documentos is required", code: "" }
            }


            if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(this.table)

            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

            if (validation.status === 'ok') {

                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] === 0) {
                    data.documentos = []

                    for (let index = 0; index < documentos.length; index++) {
                        let element = documentos[index];
                        element.DECISAO_TRIBUNAL_PROCESSOS_ID = data.ID
                        element.ID = await functionsDatabase.createID(this.tableDocument)
                        element.DT_REGISTO = functionsDatabase.createDateNow(this.table)
                        element.ESTADO = 1
                        const validationDocuments = await functionsDatabase.validation(listDocuments, element, extractRequestDocument, this.tableDocument);
                        if (validationDocuments.status === 'ok') {
                            const newE = await Database
                                .table(this.tableDocument)
                                .insert(element)
                            if (newE[0] === 0) {
                                data.documentos.push(element)
                            }
                            else return { status: "fail", entity: "", message: "", code: "" }


                        } else {
                            return validationDocuments
                        }

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

                const list = await functionsDatabase.DBMaker(this.table);
                const extractRequest = functionsDatabase.extractRequest(list, ["ESTADO"])

                const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
                const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])

                let documentos = request.input("documentos");
                let visados = request.input("visados");

                let data = request.only(extractRequest)

                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .userID(request.userID)
                        .update(data)

                    if (newE === 1) {

                        if (documentos) {
                            const deleteDocuments = await DatabaseDB
                                .table(this.tableDocument)
                                .where('DECISAO_TRIBUNAL_PROCESSOS_ID', '' + params.id)
                                .delete()

                    

                            data.documentos = []

                            for (let index = 0; index < documentos.length; index++) {
                                let element = documentos[index];
                                element.DECISAO_TRIBUNAL_PROCESSOS_ID = params.id
                                element.ID = await functionsDatabase.createID(this.tableDocument)
                                element.DT_REGISTO = functionsDatabase.createDateNow(this.table)
                                element.ESTADO = 1
                                const validationDocuments = await functionsDatabase.validation(listDocuments, element, extractRequestDocument, this.tableDocument);
                                if (validationDocuments.status === 'ok') {
                                    const newE = await Database
                                        .table(this.tableDocument)
                                        .insert(element)
                                    if (newE[0] === 0) {
                                        data.documentos.push(element)
                                    }
                                    else return { status: "fail", entity: "", message: "", code: "" }


                                } else {
                                    return validationDocuments
                                }

                            }
                        }

                        return (data)
                    }

                    else return { status: "fail", entity: "", message: "", code: "" }

                } else return validation

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
            var result = await Model.query().orderBy('DT_REGISTO', 'desc')
                .with('processo')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('glbuser')
                .with("sgigjreldocumento.sgigjprdocumentotp")
                .where(data).where('ESTADO', 1).fetch()
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
                    .with('processo')
                    .with('glbuser')
                    .with("sgigjreldocumento.sgigjprdocumentotp")
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }



}


module.exports = DecisaoTribunalProcessosController