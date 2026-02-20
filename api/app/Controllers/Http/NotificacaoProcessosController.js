'use strict'

const GenericController = require("./GenericController")
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const Model = use('App/Models/NotificacaoProcessos');
const DatabaseDB = use("Database");
const GlbnotificacaoFunctions = require('./GlbnotificacaoFunctions');
const pdfCreater = require('./pdfCreater');
const Env = use('Env');

class NotificacaoProcessosController extends GenericController {

    table = "notificacao_processos";
    Model = Model
    tableDocument = "sgigjreldocumento"
    tableNotificacaoVisado = "notificacao_processos_visados"

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            const listDocuments = await functionsDatabase.DBMaker(this.tableDocument);
            const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])

            let documentos = request.input("documentos");
            let visados = request.input("visados");

            if (!visados) {
                return { status: "fail", entity: "", message: "visados is required", code: "" }
            }

            if (!documentos) {
                return { status: "fail", entity: "", message: "documentos is required", code: "" }
            }

            let data = request.only(extractRequest)

            data.ID = await functionsDatabase.createID(this.table)
            data.USER_ID = request.userID
            data.DT_REGISTO = functionsDatabase.createDateNow(this.table)
            data.ESTADO = "1"
            data.CRIADO_POR = request.userID


            if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(this.table)



            const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

            if (validation.status === 'ok') {

                if (data.ESTADO_NOTIFICACAO == "CONCLUIR") {
                    data.URL_DOC_GERADO = await this.gerarDoc(data.CORPO)
                    if (!data.URL_DOC_GERADO) {
                        return { status: "fail", entity: this.table, message: "Falha ao gerar documento PDF", code: "PDF_ERROR" }
                    }
                }

                const newE = await Database
                    .table(this.table)
                    .insert(data)

                if (newE[0] === 0) {
                    data.documentos = []
                    data.visados = []

                    for (let index = 0; index < documentos.length; index++) {
                        let element = documentos[index];
                        element.NOTIFICACAO_PROCESSO_ID = data.ID
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

                    for (let index = 0; index < visados.length; index++) {
                        let element = visados[index];
                        let notificacao_visado = {
                            VISADO_ID: element,
                            NOTIFICACAO_PROCESSO_ID: data.ID,
                            ESTADO: 1,
                            ID: await functionsDatabase.createID(this.tableNotificacaoVisado)
                        }

                        if (data.ESTADO_NOTIFICACAO == "CONCLUIR") {
                            this.sendEmail(element, data.CORPO, request.userID, request, data.URL_DOC_GERADO)
                        }

                        const newE = await Database
                            .table(this.tableNotificacaoVisado)
                            .insert(notificacao_visado)
                        if (newE[0] === 0) {
                            data.visados.push(element)
                        }
                        else return { status: "fail", entity: "", message: "", code: "" }
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

                    if (data.ESTADO_NOTIFICACAO == "CONCLUIR") {
                        data.URL_DOC_GERADO = await this.gerarDoc(data.CORPO)
                        if (!data.URL_DOC_GERADO) {
                            return { status: "fail", entity: this.table, message: "Falha ao gerar documento PDF", code: "PDF_ERROR" }
                        }
                    }

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .userID(request.userID)
                        .update(data)

                    if (newE === 1) {

                        if (documentos) {
                            const deleteDocuments = await DatabaseDB
                                .table(this.tableDocument)
                                .where('NOTIFICACAO_PROCESSO_ID', '' + params.id)
                                .delete()

                            data.documentos = []

                            for (let index = 0; index < documentos.length; index++) {
                                let element = documentos[index];
                                element.NOTIFICACAO_PROCESSO_ID = params.id
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

                        if (visados) {
                            const deleteNotificacaoVisados = await DatabaseDB
                                .table(this.tableNotificacaoVisado)
                                .where('NOTIFICACAO_PROCESSO_ID', '' + params.id)
                                .delete()



                            data.visados = []


                            for (let index = 0; index < visados.length; index++) {
                                let element = visados[index];
                                let notificacao_visado = {
                                    VISADO_ID: element,
                                    NOTIFICACAO_PROCESSO_ID: params.id,
                                    ESTADO: 1,
                                    ID: await functionsDatabase.createID(this.tableNotificacaoVisado)
                                }

                                if (data.ESTADO_NOTIFICACAO == "CONCLUIR") {
                                    this.sendEmail(element, data.CORPO, request.userID, request, data.URL_DOC_GERADO)
                                }

                                const newE = await Database
                                    .table(this.tableNotificacaoVisado)
                                    .insert(notificacao_visado)
                                if (newE[0] === 0) {
                                    data.visados.push(element)
                                }
                                else return { status: "fail", entity: "", message: "", code: "" }
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
                .with('visados.sgigjrelinterveniente.sgigjpessoa')
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
                    .with('visados.sgigjrelinterveniente.sgigjpessoa')
                    .with("sgigjreldocumento.sgigjprdocumentotp")
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }


    async sendEmail(visado_id, msg, user_id, request, attachment) {

        const interveniente = await Database
            .table("Sgigjrelinterveniente")
            .where('ID', visado_id)
            .limit(1)
        if (interveniente.length == 0) {
            return response.status(400).json({ status: "405Error", entity: "Sgigjrelinterveniente", message: "interveniente not exist", code: "" })
        }

        if(attachment){
            attachment = attachment + "?alt=media&token=0"
        }

        GlbnotificacaoFunctions.storeToUser({
            request,
            USER_ID: user_id,
            MSG: "Foste notificado.",
            TITULO: "Notificação de Decisão",
            PESSOA_ID: interveniente[0].PESSOA_ID,
            URL: "/processos/",
            ATTACHMENTS: [
                {
                    filename: 'notificacao.pdf',
                    path: attachment
                }
            ]
        })

    }


    async gerarDoc(corpo){
        const pdftxt = {
          content: `
            <div style="width: 100%; height: 100%; zoom: ${Env.get("ZOOM_PDF","")};">
                <div style=" margin-bottom: 96px; ">
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="Paris" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 40px;">
                </div>    
                <div style=" min-height: 1190px; padding-right: 96px; padding-left: 96px;">              
                  ${corpo}  
                </div>
              <div >
                  <p class="MsoNormal" align="center" style=" margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">_______________________________________________________________________________________</p><p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 12px;">Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                  - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span></p>
              </div>
          </div>
            `,
          tipo: "notificacao.pdf",
        };
        const pdfcreated = await pdfCreater(pdftxt);
        if (pdfcreated?.status == true){
            return pdfcreated?.url
        }

        return null
    }

}


module.exports = NotificacaoProcessosController