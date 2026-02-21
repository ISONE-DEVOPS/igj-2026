'use strict'

const GenericController = require("./GenericController")
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const Model = use('App/Models/CasoSuspeito');
var pdf = require('html-pdf');
const moment = require("moment");

class CasoSuspeitoController extends GenericController {

    table = "casosuspeito";
    Model = Model
    tableDocument = "sgigjreldocumento"
    tableIntervinientes = "interveniente"
    tablePessoa = "sgigjpessoa"

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])


            const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
            const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])


            const listIntervinientes = await functionsDatabase.DBMaker(this.tableIntervinientes);
            const extractRequestIntervinientes = functionsDatabase.extractRequest(listIntervinientes, [])

            const listPessoa = await functionsDatabase.DBMaker(this.tablePessoa);
            const extractRequestPessoa = functionsDatabase.extractRequest(listPessoa, [])

            let documentos = request.input("documentos");
            let intervenientes = request.input("intervenientes");

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
                    data.documentos = []
                    data.intervenientes = []

                    for (let index = 0; index < documentos.length; index++) {
                        let element = documentos[index];
                        element.PROCESSO_CASOSUSPEITO_ID = data.ID
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

                    for (let index = 0; index < intervenientes.length; index++) {
                        let element = intervenientes[index];
                        if (element.pessoa) {
                            let pessoa = element.pessoa
                            pessoa.DT_REGISTO = functionsDatabase.createDateNow(this.tablePessoa)
                            pessoa.ID = await functionsDatabase.createID(this.tablePessoa)
                            pessoa.ESTADO = 1

                            if (!pessoa.CODIGO) {
                                pessoa.CODIGO = await functionsDatabase.createCODIGO(this.tablePessoa)
                            }

                            const validationPessoa = await functionsDatabase.validation(listPessoa, pessoa, extractRequestPessoa, this.tablePessoa);
                            pessoa.ID = await functionsDatabase.createID(this.tablePessoa)
                            element.PESSOA_ID = pessoa.ID

                            if (validationPessoa.status === 'ok') {
                                const newE = await Database
                                    .table(this.tablePessoa)
                                    .insert(pessoa)
                                if (newE[0] === 0) {
                                    data.intervenientes.push(pessoa)
                                    delete element.pessoa
                                }
                                else return { status: "fail", entity: "", message: "", code: "" }


                            } else {
                                return validationPessoa
                            }
                        }


                        element.CASOSUSPEITO_ID = data.ID
                        element.ID = await functionsDatabase.createID(this.tableIntervinientes)
                        element.DT_REGISTO = functionsDatabase.createDateNow(this.table)
                        element.ESTADO = 1
                        const validationIntervientes = await functionsDatabase.validation(listIntervinientes, element, extractRequestIntervinientes, this.tableIntervinientes);
                        if (validationIntervientes.status === 'ok') {
                            const newE = await Database
                                .table(this.tableIntervinientes)
                                .insert(element)
                            if (newE[0] === 0) {
                                data.intervenientes.push(element)
                            }
                            else return { status: "fail", entity: "", message: "", code: "" }


                        } else {
                            return validationIntervientes
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


                const listIntervinientes = await functionsDatabase.DBMaker(this.tableIntervinientes);
                const extractRequestIntervinientes = functionsDatabase.extractRequest(listIntervinientes, [])

                const listPessoa = await functionsDatabase.DBMaker(this.tablePessoa);
                const extractRequestPessoa = functionsDatabase.extractRequest(listPessoa, [])

                let documentos = request.input("documentos");
                let intervenientes = request.input("intervenientes");

                let data = request.only(extractRequest)

                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);



                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .userID(request.userID)
                       .update(data)

                    if (newE === 1) {

                        const deleteDocuments = await Database
                            .table(this.tableDocument)
                            .where('PROCESSO_CASOSUSPEITO_ID', '' + params.id)
                            .userID(request.userID)
                            .delete()

                        if (deleteDocuments !== 1) {
                            return { status: "fail", entity: "", message: "", code: "" }
                        }


                        const deleteInterviniente = await Database
                            .table(this.tableIntervinientes)
                            .where('CASOSUSPEITO_ID', '' + params.id)
                            .userID(request.userID)
                            .delete()

                        if (deleteInterviniente !== 1) {
                            return { status: "fail", entity: "", message: "", code: "" }
                        }

                        data.documentos = []
                        data.intervenientes = []

                        for (let index = 0; index < documentos.length; index++) {
                            let element = documentos[index];
                            element.PROCESSO_CASOSUSPEITO_ID = params.id
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

                        for (let index = 0; index < intervenientes.length; index++) {
                            let element = intervenientes[index];
                            if (element.pessoa) {
                                let pessoa = element.pessoa
                                pessoa.DT_REGISTO = functionsDatabase.createDateNow(this.tablePessoa)
                                pessoa.ID = await functionsDatabase.createID(this.tablePessoa)
                                pessoa.ESTADO = 1

                                if (!pessoa.CODIGO) {
                                    pessoa.CODIGO = await functionsDatabase.createCODIGO(this.tablePessoa)
                                }

                                const validationPessoa = await functionsDatabase.validation(listPessoa, pessoa, extractRequestPessoa, this.tablePessoa);
                                pessoa.ID = await functionsDatabase.createID(this.tablePessoa)
                                element.PESSOA_ID = pessoa.ID

                                if (validationPessoa.status === 'ok') {
                                    const newE = await Database
                                        .table(this.tablePessoa)
                                        .insert(pessoa)
                                    if (newE[0] === 0) {
                                        data.intervenientes.push(pessoa)
                                        delete element.pessoa
                                    }
                                    else return { status: "fail", entity: "", message: "", code: "" }


                                } else {
                                    return validationPessoa
                                }
                            }


                            element.CASOSUSPEITO_ID = params.id
                            element.ID = await functionsDatabase.createID(this.tableIntervinientes)
                            element.DT_REGISTO = functionsDatabase.createDateNow(this.table)
                            element.ESTADO = 1
                            const validationIntervientes = await functionsDatabase.validation(listIntervinientes, element, extractRequestIntervinientes, this.tableIntervinientes);
                            if (validationIntervientes.status === 'ok') {
                                const newE = await Database
                                    .table(this.tableIntervinientes)
                                    .insert(element)
                                if (newE[0] === 0) {
                                    data.intervenientes.push(element)
                                }
                                else return { status: "fail", entity: "", message: "", code: "" }


                            } else {
                                return validationIntervientes
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
                .with('sgigjentidade')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('intervenientes.pessoa')
                .with('intervenientes.pessoa.nacionalidade')
                .with('intervenientes.pessoa.sgigjreldocumento')
                .with('intervenientes.pessoa.sgigjreldocumento.sgigjprdocumentotp')
                .with('intervenientes.profissao')
                .with('glbuser')
                .with('divisa')
                .with('meiopagamento')
                .with('modalidade')
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
                    .with('sgigjentidade')
                    .with('intervenientes.pessoa')
                    .with('intervenientes.pessoa.nacionalidade')
                    .with('intervenientes.profissao')
                    .with('glbuser')
                    .with('divisa')
                    .with('meiopagamento')
                    .with('modalidade')
                    .with("sgigjreldocumento.sgigjprdocumentotp")
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }

    async documentComunicado({ params, response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "show", request.userID, params.id);
        if (allowedMethod || true) {
            const element = await functionsDatabase.existelement(this.table, params.id)
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {
                let result = await Model
                    .query()
                    .where('ID', '' + params.id)
                    .where('ESTADO', 1)
                    .with('sgigjentidade')
                    .with('intervenientes.pessoa')
                    .with('intervenientes.pessoa.nacionalidade')
                    .with('intervenientes.pessoa.sgigjreldocumento')
                    .with('intervenientes.pessoa.sgigjreldocumento.sgigjprdocumentotp')
                    .with('intervenientes.profissao')
                    .with('glbuser.sgigjrelpessoaentidade.sgigjpessoa')
                    .with('divisa')
                    .with('meiopagamento')
                    .with('modalidade').with("sgigjreldocumento.sgigjprdocumentotp")
                    .first()

                result = result.toJSON()
                let content = `
                        <div
                        style="font-family: sans-serif;font-size: 10pt !important;display: block;margin-left: auto;margin-right: auto;width: 87%;position: relative; line-height: 1.7;">
                        <header>
                            <h1 style="text-align: center;text-transform: uppercase;;font-size: 15pt !important">Comunicação de
                                operaçoes suspeitas</h1>
                            <div style="margin-top:30px">
                                <span><span style="font-weight: bold;">Entidade Sujeita:</span> <span>${result.sgigjentidade && result.sgigjentidade.DESIG ? result.sgigjentidade.DESIG : ""}</span></span>
                                <span style="margin-left: 20px;"><span style="font-weight: bold;">Data:</span> <span>${result.DT ? moment(result.DT).format('DD/MM/Y') : ""}</span></span>
                                <span style="position: absolute;right: 0%;"><span style="font-weight: bold;">Ref:</span> <span>${result.REFERENCIA ? result.REFERENCIA : ""}</span>
                            </div>
                        </header>

                        ${(function () {
                        let interveniente = ''
                        for (let index = 0; index < result.intervenientes.length; index++) {
                            const element = result.intervenientes[index];


                            if (element.COLETIVO == '0') {
                                interveniente += `
                                <section style="margin-bottom:25px">
                                <h1
                                    style="text-transform: uppercase; background: #ededed;margin-bottom: 5px;padding: 1px;font-size: 12pt !important;padding-left: 0;">
                                    Interveniente Singular</h1>
                                <div>
                                    <div style="">
                                        <span> <span style="font-weight: bold;">Nome:</span> <span>${element.pessoa ? element.pessoa.NOME : ""}</span></span>
                                        <span style="position: absolute;right: 0%;"><span style="font-weight: bold;"> Nasc:</span> <span>${element.pessoa && element.pessoa.DT_NASC ? moment(element.pessoa.DT_NASC).format('DD/MM/Y') : ""}</span></span>
                                    </div>
                                    <div style="">
                                        <span><span style="font-weight: bold;">Doc Id: </span><span>${element.pessoa && element.pessoa.DOC_IDENTIFICACAO ? element.pessoa.DOC_IDENTIFICACAO : ""}</span></span>
                                        <span style="margin-left: 20px;"><span style="font-weight: bold;">Nº: </span><span>${element.pessoa && element.pessoa.NUMERO ? element.pessoa.NUMERO : ""}</span></span>
                                        <span style="position: absolute;right: 0%;"><span style="font-weight: bold;">NIF:</span> <span>${element.pessoa && element.pessoa.NIF ? element.pessoa.NIF : ""}</span></span>
                                    </div>
                                    <div style="">
                                        <span><span style="font-weight: bold;">Morada: </span><span>${element.MORADA ? element.MORADA : ""}</span></span>
                                    </div>
                                    <div style="">
                                        <span><span style="font-weight: bold;">Telef: </span><span>${element.TELEFONE}</span></span>
                                        <span style="margin-left: 20px;"><span style="font-weight: bold;">Nacionalidade: </span><span>${element.pessoa && element.pessoa.nacionalidade && element.pessoa.nacionalidade.NOME ? element.pessoa.nacionalidade.NOME : ""}</span></span>
                                        <span style="position: absolute;right: 0%;"><span style="font-weight: bold;">Profissão: </span><span>${element.profissao && element.profissao.DESIG ? element.profissao.DESIG : ""}</span></span>
                                    </div>
                                    <div style="">
                                        <span><span style="font-weight: bold;">Local trabalho: </span><span>${element.LOCAL_TRABALHO ? element.LOCAL_TRABALHO : ""}</span></span>
                                        <span style="position: absolute;right: 0%;"><span style="font-weight: bold;">Entidade Patronal: </span><span>${element.ENTIDADE_PATRONAL ? element.ENTIDADE_PATRONAL : ""}</span></span>
                                    </div>
                                </div>
                            </section>
                                `
                            } else {
                                interveniente += `<section style="margin-bottom:25px">
                                    <h1
                                        style="text-transform: uppercase; background: #ededed;margin-bottom: 5px;padding: 1px;font-size: 12pt !important;padding-left: 0;">
                                        Interveniente Coletivo</h1>
                                    <div>
                                        <div>
                                            <span><span style="font-weight: bold;">Nome: </span><span>${element.NOME ? element.NOME : ""}</span></span>

                                        </div>
                                        <div>
                                            <span><span style="font-weight: bold;">NIF: </span><span>${element.NIF ? element.NIF : ""}</span></span>
                                            <span style="margin-left: 20px;"><span style="font-weight: bold;">Atividade: </span><span> ${element.ATIVIDADE ? element.ATIVIDADE : ""}</span></span>
                                        </div>
                                        <div>
                                            <span><span style="font-weight: bold;">Morada: </span><span>${element.MORADA ? element.MORADA : ""}</span></span>
                                            <span style="position: absolute;right: 0%;"><span style="font-weight: bold;">Telef: </span><span>${element.TELEFONE ? element.TELEFONE : ""}</span></span>
                                        </div>
                                        <div>
                                            <span><span style="font-weight: bold;">Representante: </span><span>${element.pessoa && element.pessoa.NOME ? element.pessoa.NOME : ""}</span></span>
                                        </div>
                                    </div>
                                </section>`
                            }
                        }
                        return interveniente
                    })()}
                        

                        

                        <section style="margin-bottom:25px">
                            <h1
                                style="text-transform: uppercase; background: #ededed;margin-bottom: 5px;padding: 1px;font-size: 12pt !important;padding-left: 0;">
                                Descrição da Operação</h1>
                            <div>
                                <div>
                                    <span><span style="font-weight: bold;">Tipo do Bem: </span><span>${result.TIPO_BEM ? result.TIPO_BEM : ""}</span></span>

                                </div>
                                <div>
                                    <span><span style="font-weight: bold;">Dta Operação: </span><span>${result.DT_OPERACAO ? moment(result.DT_OPERACAO).format('DD/MM/Y') : ""}</span></span>
                                    <span style="margin-left: 20px;"><span style="font-weight: bold;">Montande: </span><span> ${result.VALOR ? result.VALOR : ""}</span></span>
                                    <span style="position: absolute;right: 0%;"><span style="font-weight: bold;">Divisa: </span><span> ${result.divisa && result.divisa.DESIGNACAO ? result.divisa.DESIGNACAO : ""}</span></span>
                                </div>
                                <div>
                                    <span><span style="font-weight: bold;">Forma de Pagamento: </span><span>${result.meiopagamento && result.meiopagamento.NOME ? result.meiopagamento.NOME : ""}</span></span>
                                </div>
                                <div>
                                    </span><span style="font-weight: bold;">Modalidade de Pagamento: </span><span>${result.modalidade && result.modalidade.DESIGNACAO ? result.modalidade.DESIGNACAO : ""}</span></span>
                                </div>
                            </div>
                        </section>

                        <section style="margin-bottom:25px">
                            <h1
                                style="text-transform: uppercase; background: #ededed;margin-bottom: 5px;padding: 1px;font-size: 12pt !important;padding-left: 0;">
                                Motivo da Suspeita</h1>
                            <div>
                                <p style="margin-top: 0;padding-top: 0;">${result.MOTIVO ? result.MOTIVO : ""}</p>
                            </div>
                        </section>

                        <section style="margin-bottom:25px">
                            <h1
                                style="text-transform: uppercase; background: #ededed;margin-bottom: 5px;padding: 1px;font-size: 12pt !important;padding-left: 0;">
                                Observação</h1>
                            <div>
                                <p style="margin-top: 0;padding-top: 0;">${result.OBS ? result.OBS : ""}
                                </p>
                            </div>
                        </section>

                        <div id="page-last" style="height:300px;width:100%;position: absolute;bottom: -600px;">
                            <div style="text-align: center">
                                <p>Responsalvel</p>
                                <p>${result.glbuser && result.glbuser.sgigjrelpessoaentidade && result.glbuser.sgigjrelpessoaentidade.sgigjpessoa && result.glbuser.sgigjrelpessoaentidade.sgigjpessoa.NOME ? result.glbuser.sgigjrelpessoaentidade.sgigjpessoa.NOME : ""}</p>
                            </div>
                        </div>

                    </div>
                    `

                response.header('Content-type', 'application/pdf')
                response.header('Content-Disposition', 'attachment; filename="contrapartida.pdf"')
                return response.send(await this.toPdf(content))
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }


    async toPdf(content) {

        const pdfCreater = async (data) => {
            let promise = new Promise((resolve, reject) => {
                pdf.create(data, {
                    "format": "A4", "border": { "top": "15mm", "right": "15mm", "bottom": "15mm", "left": "15mm" }, "type": "pdf",
                    paginationOffset: 1,       // Override the initial pagination number
                    "header": {
                        "height": "20mm",
                    },
                    "footer": {
                        "height": "30mm",
                        "contents": {
                            default: '<div style="color: #444;width:93%;font-size:10pt;text-align: right"><span>Pág {{page}}</span>/<span>{{pages}}</span></div>', // fallback value
                        }
                    },
                }).toBuffer(function (err, buffer) {
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

   

    async exportPdf({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            let result = await Model.query().orderBy('DT_REGISTO', 'desc')
                .with('sgigjentidade')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('intervenientes.pessoa')
                .with('intervenientes.pessoa.nacionalidade')
                .with('intervenientes.pessoa.sgigjreldocumento')
                .with('intervenientes.pessoa.sgigjreldocumento.sgigjprdocumentotp')
                .with('intervenientes.profissao')
                .with('glbuser')
                .with('divisa')
                .with('meiopagamento')
                .with('modalidade')
                .with("sgigjreldocumento.sgigjprdocumentotp")
                .where(data).where('ESTADO', 1).fetch()

            result = result.toJSON()
            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>
                <h2 style="font-size: 12pt !important">Caso Suspeito</h2>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Interveniente</th>
                       <th style="text-align: center;">Nif</th>
                       <th style="text-align: center;">Responsável</th>
                       <th style="text-align: center;">DT Operação</th>
                       <th style="text-align: center;">Montante</th>
                       <th style="text-align: center;">Divisa</th>
                       <th style="text-align: center;">Meio Pagamento</th>
                       <th style="text-align: center;">Modalidade Pagamento</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>

                    ${( () => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        for (const interveniente of element.intervenientes) {
                            tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                             <td style="text-align: center;"> ${interveniente.pessoa ? interveniente.pessoa.NOME : ""}</tb>
                             <td style="text-align: center;"> ${interveniente.pessoa ? interveniente.pessoa.NIF : ""}</tb>
                             <td style="text-align: center;"> ${interveniente.pessoa && interveniente.COLETIVO != '0' ? interveniente.pessoa.NOME : ""}</tb>
                             <td style="text-align: center;"> ${element.DT_OPERACAO ? moment(element.DT_OPERACAO).format('DD-MM-Y') : ""}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.VALOR)}</tb>
                             <td style="text-align: center;"> ${element.divisa ? element.divisa.DESIGNACAO : ""}</tb>
                             <td style="text-align: center;"> ${element.meiopagamento ? element.meiopagamento.NOME : ""}</tb>
                             <td style="text-align: center;"> ${element.modalidade ? element.modalidade.DESIGNACAO : ""}</tb>
                            
                        </tr>`
                        }
                    }
                    return tbody
                })()}
                  </tbody>
                </table>
            <div>`

            await Database
                    .table(this.table)
                    .userID(request.userID)
                    .registerExport("PDF")

            response.header('Content-type', 'application/pdf')
            response.header('Content-Disposition', 'attachment; filename="imposto.pdf"')
            return response.send(await super.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async exportCsv({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            let result = await Model.query().orderBy('DT_REGISTO', 'desc')
                .with('sgigjentidade')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('intervenientes.pessoa')
                .with('intervenientes.pessoa.nacionalidade')
                .with('intervenientes.pessoa.sgigjreldocumento')
                .with('intervenientes.pessoa.sgigjreldocumento.sgigjprdocumentotp')
                .with('intervenientes.profissao')
                .with('glbuser')
                .with('divisa')
                .with('meiopagamento')
                .with('modalidade')
                .with("sgigjreldocumento.sgigjprdocumentotp")
                .where(data).where('ESTADO', 1).fetch()

            result = result.toJSON()
            let dataResult = []
            for (let index = 0; index < result.length; index++) {
                let element = result[index];
                for (const interveniente of element.intervenientes) {
                    dataResult.push({
                        "Interveniente": interveniente.pessoa ? interveniente.pessoa.NOME : "",
                        "Nif": interveniente.pessoa ? interveniente.pessoa.NIF : "",
                        "Responsável": interveniente.pessoa && interveniente.COLETIVO != '0' ? interveniente.pessoa.NOME : "",
                        "DT Operação": element.DT_OPERACAO ? moment(element.DT_OPERACAO).format('DD-MM-Y') : "",
                        "Montante": element.VALOR,
                        "Divisa": element.divisa ? element.divisa.DESIGNACAO : "",
                        "Meio Pagamento": element.meiopagamento ? element.meiopagamento.NOME : "",
                        "Modalidade Pagamento": element.modalidade ? element.modalidade.DESIGNACAO : ""
                    })
                }
            }

            let dataCsv = this.toCsv(dataResult)

            await Database
                    .table(this.table)
                    .userID(request.userID)
                    .registerExport("CSV")

            response.header('Content-type', 'text/csv')
            response.header('Content-Disposition', 'attachment; filename="contribuicoes.csv"')
            return response.send(dataCsv)
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

}


module.exports = CasoSuspeitoController