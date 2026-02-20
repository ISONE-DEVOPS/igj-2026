'use strict'



const GenericController = require("./GenericController")
const Model = use('App/Models/Cabimentacao');
const ProjetoRubrica = use('App/Models/ProjetoRubrica');
const Projeto = use('App/Models/Projeto');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
let DatabaseDB = use("Database")


class CabimentacaoController extends GenericController {

    table = "cabimentacaos";
    Model = Model


    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            let documents = request.input("documentos")
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.USER_ID = request.userID
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID

            const orcamento = await ProjetoRubrica.query()
                .where('ID', data.PROJETO_RUBRICA_ID).first()

            if (!orcamento) {
                return { status: "fail", entity: "", message: "ID de projeto_rubrica nao existe", code: "" }
            }

            let total = (await Model.query().select(DatabaseDB
                .raw('sum(CABIMENTADO) as total')).where('ESTADO', 1).where("PROJETO_RUBRICA_ID", '' + data.PROJETO_RUBRICA_ID).fetch()).toJSON()

            if (total) {
                total = Number(total[0]["total"]) + data.CABIMENTADO
                if (total > orcamento.ORCAMENTO_DISPONIVEL)
                    return { status: "fail", entity: "", message: "Valor maior que o saldo disponivel", code: "500" }
            }
            // let fields = ["documentos"]
            // let msg = ""
            // for (const field of fields) {
            //     if (!request.input(field)) {
            //         msg = msg + `${field} is required;`
            //     }
            // }


            // if (msg != "") return { status: "erro", entity: this.table, message: msg, code: 999 }

            if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(this.table)
            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);


            if (validation.status === 'ok') {

                data["CABIMENTADO_PERCENT"] = orcamento.ORCAMENTO_DISPONIVEL == 0 ? 0 : Number(((data.CABIMENTADO / (orcamento.ORCAMENTO_DISPONIVEL)) * 100).toFixed(2))//arronda 2 casa decimais

                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] === 0) {
                    if (documents) {
                        let tableDocument = "sgigjreldocumento"
                        for (let index = 0; index < documents.length; index++) {
                            const document = documents[index];
                            document.ID = await functionsDatabase.createID(tableDocument)
                            document.DT_REGISTO = functionsDatabase.createDateNow(tableDocument)
                            document.ESTADO = 1
                            document.PAGAMENTO_CABIMENTO = data.ID

                            const listDocuments = await functionsDatabase.DBMaker(tableDocument);
                            const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                            const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, tableDocument);
                            if (validationDocuments.status === 'ok') {
                                const newE = await Database
                                    .table(tableDocument)
                                    .insert(document)
                            }
                            else return validationDocuments
                        }

                    }

                    // if (orcamento) {
                    //     await Database
                    //         .table("orcamentos")
                    //         .where('ID', '' +data.ORCAMENTO_ID)
                    //         .update({
                    //             "PAGO": (data.CABIMENTADO + orcamento.PAGO),
                    //             "PAGO_PERCENT": orcamento.ORCAMENTO_DISPONIVEL == 0 ? 0 : Number((((data.CABIMENTADO + orcamento.PAGO) / orcamento.ORCAMENTO_DISPONIVEL) * 100).toFixed(2)),//arronda 2 casa decimais
                    //             "SALDO_DISPONIVEL": (orcamento.SALDO_DISPONIVEL - data.CABIMENTADO) < 0 ? 0 : (orcamento.SALDO_DISPONIVEL - data.CABIMENTADO),
                    //         })
                    // }
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

                let documents = request.input("documentos")
                let data = request.only(extractRequest)
                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                const orcamento = await Orcamento.query()
                    .where('ID', data.ORCAMENTO_ID).first()
                data["CABIMENTADO_PERCENT"] = orcamento.ORCAMENTO_DISPONIVEL == 0 ? 0 : Number(((data.CABIMENTADO / orcamento.ORCAMENTO_DISPONIVEL) * 100).toFixed(2))//arronda 2 casa decimais

                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .where('ESTADO', 1)
                        .userID(request.userID)
                        .update(data)


                    if (newE === 1) {
                        if (documents) {
                            let tableDocument = "sgigjreldocumento"
                            for (let index = 0; index < documents.length; index++) {
                                const document = documents[index];
                                document.ID = await functionsDatabase.createID(tableDocument)
                                document.DT_REGISTO = functionsDatabase.createDateNow(tableDocument)
                                document.ESTADO = 1
                                document.PAGAMENTO_CABIMENTO = params.id
    
                                const listDocuments = await functionsDatabase.DBMaker(tableDocument);
                                const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                                const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, tableDocument);
                                if (validationDocuments.status === 'ok') {
                                    const newE = await Database
                                        .table(tableDocument)
                                        .insert(document)
                                }
                                else return validationDocuments
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
            var result = await Model.query()
                .orderBy('DT_REGISTO', 'desc')
                .with('projeto_rubrica')
                .with('projeto_rubrica.rubrica')
                .with('projeto_rubrica.projeto')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('sgigjreldocumento')
                .where(data)
                .where('ESTADO', 1).fetch()
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
                    .with('projeto_rubrica')
                    .with('projeto_rubrica.rubrica')
                    .with('projeto_rubrica.projeto')
                    .with('sgigjreldocumento')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }

    async payment({ params, response, request }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "pagamento", request.userID, params.id);

        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)

            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                let entity = await Model.query().where("ID", params.id).first()
                if(!entity){
                    return response.status(404).json({ status: "404Error", entity: this.table, message: "Cabimentacao not found", code: "404" })
                }

                let orcamento = await ProjetoRubrica.query()
                    .where('ID', entity.PROJETO_RUBRICA_ID).first()
                if (!orcamento) {
                    return { status: "fail", entity: "", message: "ID de Projeto Rubrica nao existe", code: "" }
                }

                if ((orcamento.SALDO_DISPONIVEL - entity.CABIMENTADO) < 0) {
                    return { status: "fail", entity: "", message: "Saldo indisponivel", code: "" }
                }

                
                const newE = await Database
                    .table(this.table)
                    .where('ID', '' + params.id)
                    .update({
                        "DT_PAGAMENTO": functionsDatabase.createDateNow(this.table),
                        "USER_ID_PAGAMENTO": request.userID,
                        // "NUM_DOC_PAGAMENTO": request.input("NUM_DOC_PAGAMENTO")
                    })


                if (newE == 1) {



                    if (orcamento) {
                        await Database
                            .table("projeto_rubrica")
                            .where('ID', '' + entity.PROJETO_RUBRICA_ID)
                            .update({
                                "PAGO": (entity.CABIMENTADO + orcamento.PAGO),
                                "PAGO_PERCENT": orcamento.ORCAMENTO_DISPONIVEL == 0 ? 0 : Number((((entity.CABIMENTADO + orcamento.PAGO) / orcamento.ORCAMENTO_DISPONIVEL) * 100).toFixed(2)),//arronda 2 casa decimais
                                "SALDO_DISPONIVEL": (orcamento.SALDO_DISPONIVEL - entity.CABIMENTADO) < 0 ? 0 : (orcamento.SALDO_DISPONIVEL - entity.CABIMENTADO),
                            })


                        let projeto = await Projeto.query()
                            .where('ID', orcamento.PROJETO_ID).first()

                        if (projeto) {
                            await Database
                                .table("projetos")
                                .where('ID', '' + orcamento.PROJETO_ID)
                                .update({
                                    "PAGO": (entity.CABIMENTADO + projeto.PAGO),
                                    "PAGO_PERCENT": projeto.ORCAMENTO_DISPONIVEL == 0 ? 0 : Number((((entity.CABIMENTADO + projeto.PAGO) / projeto.ORCAMENTO_DISPONIVEL) * 100).toFixed(2)),//arronda 2 casa decimais
                                    "SALDO_DISPONIVEL": (projeto.SALDO_DISPONIVEL - entity.CABIMENTADO) < 0 ? 0 : (projeto.SALDO_DISPONIVEL - entity.CABIMENTADO),
                                })
                        }
                    }

                    return { status: "ok", entity: this.table + "." + params.id, message: "payment", code: "888" }
                }

                else return { status: "fail", entity: "", message: "", code: "" }
            }

        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "payment not allwed", code: "4053" })
    }
}

module.exports = CabimentacaoController



