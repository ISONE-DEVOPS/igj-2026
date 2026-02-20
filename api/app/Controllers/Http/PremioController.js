'use strict'


const GenericController = require("./GenericController")
const Model = use('App/Models/Premio');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const moment = require("moment");
const ModelEntidade = use('App/Models/Sgigjentidade');

class PremioController extends GenericController {

    table = "premios";
    Model = Model

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])

            let data = request.only(extractRequest)
            let subsequente_value = request.input("SUBSEQUENTE")
            let n_vezes = parseInt(request.input("N_VEZES"))
            let primeiro_ano = parseInt(request.input("PRIMEIRO_ANO"))

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

                if (subsequente_value) {
                    let byYear = (subsequente_value) / n_vezes
                    // await Database
                    //     .table(this.table)
                    //     .insert({
                    //         "ID": await functionsDatabase.createID(this.table),
                    //         "CODIGO": await functionsDatabase.createCODIGO(this.table),
                    //         "ENTIDADE_ID": data.ENTIDADE_ID,
                    //         "PREMIOS_ID": data.ID,
                    //         "ANO": primeiro_ano,
                    //         "VALOR": byYear,
                    //         "USER_ID": data.USER_ID,
                    //         "DT_REGISTO": functionsDatabase.createDateNow(this.table),
                    //         "ESTADO": 1
                    //     })

                    for (let value = 0; value < n_vezes; value++) {
                        await Database
                            .table(this.table)
                            .insert({
                                "ID": await functionsDatabase.createID(this.table),
                                "CODIGO": await functionsDatabase.createCODIGO(this.table),
                                "ENTIDADE_ID": data.ENTIDADE_ID,
                                "PREMIOS_ID": data.ID,
                                "ANO": (primeiro_ano + value),
                                "VALOR": Math.round(byYear),
                                "USER_ID": data.USER_ID,
                                "DT_REGISTO": functionsDatabase.createDateNow(this.table),
                                "ESTADO": 1
                            })
                    }
                }

                if (newE[0] == 0) {
                    return await Model
                        .query()
                        .where('ID', '' + data.ID)
                        .where('ESTADO', 1)
                        .with('subsequente')
                        .orderBy('DT_REGISTO', 'desc')
                        .fetch()
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

                let data = request.only(extractRequest)
                let subsequente_value = request.input("SUBSEQUENTE")
                let n_vezes = parseInt(request.input("N_VEZES"))
                let primeiro_ano = parseInt(request.input("PRIMEIRO_ANO"))

                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .where('ESTADO', 1)
                        .userID(request.userID)
                       .update(data)

                    await Database
                        .table(this.table)
                        .where('PREMIOS_ID', '' + params.id)
                        .userID(request.userID)
                        .delete()

                    if (subsequente_value) {
                        let byYear = (subsequente_value) / n_vezes
                        for (let value = 0; value < n_vezes; value++) {
                            await Database
                                .table(this.table)
                                .insert({
                                    "ID": await functionsDatabase.createID(this.table),
                                    "CODIGO": await functionsDatabase.createCODIGO(this.table),
                                    "ENTIDADE_ID": data.ENTIDADE_ID,
                                    "PREMIOS_ID": params.id,
                                    "ANO": (primeiro_ano + value),
                                    "VALOR": Math.round(byYear),
                                    "USER_ID": request.userID,
                                    "DT_REGISTO": functionsDatabase.createDateNow(this.table),
                                    "ESTADO": 1
                                })
                        }
                    }


                    if (newE === 1) {
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
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .orderBy('DT_REGISTO', 'desc')
                .with('sgigjentidade')
                .with('glbuser')
                .with('banco')
                .with('meiopagamento')
                .with('sgigjreldocumento')
                .where(data)
                .whereNull('PREMIOS_ID')
                .where('ESTADO', 1)
                .fetch()




            result = result.toJSON()

            for (let index = 0; index < result.length; index++) {
                result[index]["subsequente"] = await Model.query()
                    .orderBy('ANO', 'DESC')
                    .with('sgigjentidade')
                    .with('banco')
                    .with('meiopagamento')
                    .with('sgigjreldocumento')
                    .with('glbuser')
                    .where('PREMIOS_ID', result[index].ID)
                    .where('ESTADO', 1)
                    .fetch();

            }

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
                    .with('glbuser')
                    .with('subsequente')
                    .with('banco')
                    .with('meiopagamento')
                    .with('sgigjreldocumento')
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

                const newE = await Database
                    .table(this.table)
                    .where('ID', '' + params.id)
                    .userID(request.userID)
                    .update({
                        "ESTADO": 0,
                        "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(this.table)
                    })

                await Database
                    .table(this.table)
                    .where('PREMIOS_ID', '' + params.id)
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

    async payment({ params, response, request }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "pagamento", request.userID, params.id);

        if (allowedMethod || true) {

            let document = request.input("documentos")
            const element = await functionsDatabase.existelement(this.table, params.id)

            let fields = ["DT_PAGAMENTO", "banco_iD", "meio_pagamento_ID"]
            let msg = ""
            for (const field of fields) {
                if (!request.input(field)) {
                    msg = msg + `${field} is required;`
                }
            }


            if (msg != "") return { status: "erro", entity: this.table, message: msg, code: 999 }

            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                let DOCUMENT_PAGAMENTO_ID = ""
                if (document) {
                    let tableDocument = "sgigjreldocumento"
                    document.ID = await functionsDatabase.createID(tableDocument)
                    document.DT_REGISTO = functionsDatabase.createDateNow(tableDocument)
                    document.ESTADO = 1

                    const listDocuments = await functionsDatabase.DBMaker(tableDocument);
                    const extractRequestDocument = functionsDatabase.extractRequest(listDocuments, [])
                    const validationDocuments = await functionsDatabase.validation(listDocuments, document, extractRequestDocument, tableDocument);
                    if (validationDocuments.status === 'ok') {
                        const newE = await Database
                            .table(tableDocument)
                            .insert(document)
                        if (newE[0] === 0) {
                            DOCUMENT_PAGAMENTO_ID = document.ID
                        }
                    }
                    else return validationDocuments
                }

                const newE = await Database
                    .table(this.table)
                    .where('ID', '' + params.id)
                    .update({
                        "DT_PAGAMENTO": request.input("DT_PAGAMENTO"),
                        "USER_ID_PAGAMENTO": request.userID,
                        "NUM_DOC_PAGAMENTO": request.input("NUM_DOC_PAGAMENTO"),
                        "DUC": request.input("DUC"),
                        "banco_iD": request.input("banco_iD"),
                        "DOCUMENT_PAGAMENTO_ID": DOCUMENT_PAGAMENTO_ID,
                        "meio_pagamento_ID": request.input("meio_pagamento_ID"),
                        "USER_ID_PAGAMENTO": request.userID
                    })

                // await Database
                //     .table(this.table)
                //     .where('PREMIOS_ID', '' + params.id)
                //     .update({
                //         "DT_PAGAMENTO": functionsDatabase.createDateNow(this.table),
                //         "USER_ID_PAGAMENTO": request.userID
                //     })


                // let result = await Model
                //     .query()
                //     .where('ID', '' + params.id)
                //     .first()

                // result = result.toJSON()

                // if (result) {
                //     if (result.PREMIOS_ID) {
                //         let resultSubsuquente = await Model
                //             .query()
                //             .where('PREMIOS_ID', '' + result.PREMIOS_ID)
                //             .fetch()

                //         resultSubsuquente = resultSubsuquente.toJSON()

                //         let is_payment = true;
                //         for (let index = 0; index < resultSubsuquente.length; index++) {
                //             const element = resultSubsuquente[index];
                //             if(!element.DT_PAGAMENTO){
                //                 is_payment = false
                //                 break
                //             }
                //         }

                //         if(is_payment){
                //             await Database
                //             .table(this.table)
                //             .where('ID', '' + result.PREMIOS_ID)
                //             .update({
                //                 "DT_PAGAMENTO": functionsDatabase.createDateNow(this.table),
                //                 "USER_ID_PAGAMENTO": request.userID
                //             })
                //         }
                //     }
                // }


                if (newE === 1) {
                    return { status: "ok", entity: this.table + "." + params.id, message: "payment", code: "888" }
                }

                else return { status: "fail", entity: "", message: "", code: "" }
            }

        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "delete not allwed", code: "4053" })
    }

    async exportCsv({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query().orderBy('DT_REGISTO', 'desc').with('sgigjentidade').with('glbuser').where(data).whereNull('PREMIOS_ID').where('ESTADO', 1).fetch()

            let valorPremio = 0
            let valorSequente = 0
            result = result.toJSON()
            let dataResult = []
            for (let index = 0; index < result.length; index++) {
                let element = result[index];
                valorPremio = valorPremio + element.VALOR

                dataResult.push({
                    "Pagamento": element.DT_PAGAMENTO ? "Sim" : "Não",
                    "Ano": element.ANO,
                    "Prémio Inicial": element.VALOR,
                    "Prémio Subsequente": "---",
                    "Data": moment(element.DT_REGISTO).format('DD-MM-Y'),
                })
                let subsequente = await Model.query().orderBy('ANO', 'DESC').with('sgigjentidade').with('glbuser').where('PREMIOS_ID', result[index].ID).where('ESTADO', 1).fetch()
                if (subsequente) {
                    subsequente = subsequente.toJSON()
                    for (let index = 0; index < subsequente.length; index++) {
                        const elementS = subsequente[index];
                        valorSequente = valorSequente + elementS.VALOR

                        dataResult.push({
                            "Pagamento": elementS.DT_PAGAMENTO ? "Sim" : "Não",
                            "Ano": elementS.ANO,
                            "Prémio Inicial": "---",
                            "Prémio Subsequente": elementS.VALOR,
                            "Data": moment(elementS.DT_REGISTO).format('DD-MM-Y'),
                        })

                    }
                }

            }

            let dataCsv = this.toCsv(dataResult)
            if (dataResult.length > 0) {
                dataCsv = dataCsv + "\r\n"

                dataCsv = dataCsv + this.toCsv([
                    {
                        "Total": "Total",
                        "Ano": "",
                        "Prémio Inicial": Math.round(valorPremio),
                        "Prémio Subsequente": Math.round(valorSequente),
                        "Data": "",
                    }
                ], false)
            }

            await Database
                    .table(this.table)
                    .userID(request.userID)
                    .registerExport("CSV")
                    
            response.header('Content-type', 'text/csv')
            response.header('Content-Disposition', 'attachment; filename="premio.csv"')
            return response.send(dataCsv)
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async exportPdf({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query().orderBy('DT_REGISTO', 'desc').with('sgigjentidade').with('glbuser').where(data).whereNull('PREMIOS_ID').where('ESTADO', 1).fetch()

            let valorPremio = 0
            let valorSequente = 0
            result = result.toJSON()
            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            let textFilter = ""
            if(data["ANO"]){
                textFilter = " - "+ data["ANO"]
            }

            let nameEntidade = result.length >  0 && result[0].sgigjentidade ?  result[0].sgigjentidade.DESIG : "";
            if(nameEntidade == "" && data["ENTIDADE_ID"]){
                let entidade = (await ModelEntidade.query().where("ID",data["ENTIDADE_ID"]).first()).toJSON()
                if(entidade){
                    textFilter = textFilter + " - " + entidade.DESIG
                }
            }else{
                textFilter = textFilter + " - " + nameEntidade
            }

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>
                <h2 style="font-size: 12pt !important">Premios ${textFilter}</h2>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Estado</th>
                       <th style="text-align: center;">Ano</th>
                       <th style="text-align: center;">Prémio Inicial</th>
                       <th style="text-align: center;">Prémio Subsequente</th>
                       <th style="text-align: center;">Data</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>

                    ${await (async () => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {

                        const element = result[index];
                        valorPremio = valorPremio + element.VALOR

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                            <td style="text-align: center;"> ${element.DT_PAGAMENTO ? '<span style="background: green; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
                            <td style="text-align: center;"> ${element.ANO}</tb>
                            <td style="text-align: right;"> ${this.formatCurrency(element.VALOR)}</tb>
                            <td style="text-align: center;"> ${"---"}</tb>
                            <td style="text-align: center;"> ${moment(element.DT_REGISTO).format('DD-MM-Y')}</tb>
            
                        </tr>`

                        let subsequente = await Model.query().orderBy('ANO', 'DESC').with('sgigjentidade').with('glbuser').where('PREMIOS_ID', element.ID).where('ESTADO', 1).fetch()
                        if (subsequente) {
                            subsequente = subsequente.toJSON()
                            for (let index = 0; index < subsequente.length; index++) {
                                const elementS = subsequente[index];
                                valorSequente = valorSequente + elementS.VALOR
                                tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                                     <td style="text-align: center;"> ${elementS.DT_PAGAMENTO ? '<span style="background: green; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
                                     <td style="text-align: center;"> ${elementS.ANO}</tb>
                                     <td style="text-align: center;"> ${"---"}</tb>
                                     <td style="text-align: right;"> ${this.formatCurrency(elementS.VALOR)}</tb>
                                     <td style="text-align: center;"> ${moment(element.DT_REGISTO).format('DD-MM-Y')}</tb>
                    
                                </tr>`

                            }
                        }
                    }
                    return tbody
                })()}
                ${(() => {
                    if (result.length > 0) {
                        return `<tr style="background-color:#b9bdba;font-weight: bold">
                        <td style="text-align: center;font-weight: bold">TOTAL</tb>
                        <td style="text-align: center;"></tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorPremio)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorSequente)}</tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorPremio + valorSequente)}</tb>
       
                   </tr>`
                    }
                    return ''
                })()}
                
                  </tbody>
                </table>
            <div>`

            await Database
                    .table(this.table)
                    .userID(request.userID)
                    .registerExport("PDF")

            response.header('Content-type', 'application/pdf')
            response.header('Content-Disposition', 'attachment; filename="premio.pdf"')
            return response.send(await this.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }
}

module.exports = PremioController
