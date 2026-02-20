'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Contrapartidaparamentizado');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()


class ContrapartidaEntidadeController extends GenericController {

    table = "contrapartidaparamentizados";
    tableContrapartidaEntidade = "contrapartidaentidade";
    Model = Model

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)
            let entidades = request.input("ENTIDADE_ID")
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

            if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(this.table)

            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);
            if (validation.status === 'ok') {
                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] === 0) {

                    for (let index = 0; index < entidades.length; index++) {
                        const element = entidades[index];
                        await Database
                            .table(this.tableContrapartidaEntidade)
                            .insert({
                                "ID": await functionsDatabase.createID(this.tableContrapartidaEntidade),
                                "ENTIDADE_ID": element,
                                "CONTRAPARTIDA_ID": data.ID,
                                "DT_REGISTO": functionsDatabase.createDateNow(this.tableContrapartidaEntidade),
                                "ESTADO": 1
                            })

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

                let entidades = request.input("ENTIDADE_ID")
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


                    if (newE === 1) {
                        const deleteInterviniente = await Database
                            .table(this.tableContrapartidaEntidade)
                            .where('CONTRAPARTIDA_ID', '' + params.id)
                            .userID(request.userID)
                            .delete()

                        for (let index = 0; index < entidades.length; index++) {
                            const element = entidades[index];
                            await Database
                                .table(this.tableContrapartidaEntidade)
                                .insert({
                                    "ID": await functionsDatabase.createID(this.tableContrapartidaEntidade),
                                    "ENTIDADE_ID": element,
                                    "CONTRAPARTIDA_ID": params.id,
                                    "DT_REGISTO": functionsDatabase.createDateNow(this.tableContrapartidaEntidade),
                                    "ESTADO": 1
                                })

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
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('entidade')
                .with('entidade.sgigjentidade')
                .with('glbuser')
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
                    .with('entidade')
                    .with('entidade.sgigjentidade')
                    .with('glbuser')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }
}

module.exports = ContrapartidaEntidadeController
