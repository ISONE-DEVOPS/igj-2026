'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Pagamentoscontribuicoes');
const functionsDatabase = require('../functionsDatabase');


class PagamentosContribuicoeController extends GenericController{

    table = "pagamentoscontribuicoes";
    Model = Model

    async index({ request, response }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').orderBy('DT_REGISTO', 'desc').with('contribuicoes').where(data).where('ESTADO', 1) .fetch()
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
                    .with('contribuicoes')
                    .with('banco')
                    .with('meiopagamento')
                    .with('sgigjreldocumento')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }
}


module.exports = PagamentosContribuicoeController
