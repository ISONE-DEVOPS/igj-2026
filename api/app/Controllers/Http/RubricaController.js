'use strict'


const GenericController = require("./GenericController")
const Model = use('App/Models/Rubrica');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()



class RubricaController extends GenericController {

    table = "rubricas";
    Model = Model

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.USER_ID = request.userID
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID

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



    async index({ request, response }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

            let result = await Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').where(data).whereNull('RUBRICA_ID').where('ESTADO', '<>', 0).fetch()
            result = result ? result.rows : []

            for (let index = 0; index < result.length; index++) {
                let element = result[index];
                element["rubricas"] = await this.getTreeRubrica(element)

            }

            return result
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async getTreeRubrica(rubrica) {

        let rubricasSubsequente = await Model.query().where("RUBRICA_ID", rubrica.ID).where('ESTADO', '<>', 0).fetch()
        rubricasSubsequente = rubricasSubsequente ? rubricasSubsequente.rows : []

        for (let index = 0; index < rubricasSubsequente.length; index++) {
            let element = rubricasSubsequente[index];
            element["rubricas"] = await this.getTreeRubrica(element)


        }

        return rubricasSubsequente

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
                    .where('ESTADO', '<>', 0)
                    .with('rubricas')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }

    async destroy({ params, response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "delete", request.userID, params.id);
        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }
            else {

                let exist = await Database
                    .table(this.table)
                    .where('RUBRICA_ID', '' + params.id)
                    .where('ESTADO', '<>', 0)
                    .first()

                if (exist) {
                    return { status: "fail", entity: "", message: "There have children's", code: "" }
                }

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
}

module.exports = RubricaController
