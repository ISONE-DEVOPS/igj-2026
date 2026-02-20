'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Contribuicoes');
const ModelEntidade = use('App/Models/Sgigjentidade');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const moment = require("moment");

class ContribuicoeController extends GenericController {

    table = "contribuicoes";
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

            let exist = await Model
                .query()
                .where('ANO', '' + data.ANO)
                .where('MES', '' + data.MES)
                .where('ESTADO', 1)
                .where('ENTIDADE_ID', '' + data.ENTIDADE_ID).first()

            if (exist) {
                return { status: "fail", entity: "", message: "This year and month exist", code: "" }
            }

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
            var result = await Model.query()
                .orderBy('DT_REGISTO', 'desc')
                .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
                .with('sgigjentidade')
                .with('glbuser')
                .with('pagamento')
                .with('pagamento.banco')
                .with('pagamento.meiopagamento')
                .with('pagamento.sgigjreldocumento')
                .where(data)
                .where('ESTADO', 1)
                .fetch()
            return result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })
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
                    .with('pagamento')
                    .with('pagamento.banco')
                    .with('pagamento.meiopagamento')
                    .with('pagamento.sgigjreldocumento')
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }

    async exportCsv({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query().orderBy('DT_REGISTO', 'desc').with('pagamento').where(data).where('ESTADO', 1).fetch()

            let valorTotal = 0
            let valorRecebido = 0

            result = result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })

            let dataResult = []
            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                let pagamento = element.pagamento ? element.pagamento.reduce(
                    (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.VALOR : 0,
                    0
                ) : 0
                valorTotal = valorTotal + element.VALOR
                valorRecebido = valorRecebido + pagamento
                dataResult.push({
                    "Pagamento": element.pagamento ? "Sim" : "Não",
                    "Ano": element.ANO,
                    "Mes": element.MES,
                    "Valor Mensalidade": element.VALOR,
                    "Data Emissão DUC": moment(element.DT_EMISSAO_DUC).format('DD-MM-Y'),
                    "Doc. Único Conbrança": element.DUC,
                    "Montante Recebido": pagamento ? pagamento : "",
                    "Data Confirmação Tesouro": element.pagamento.length > 0 ? moment(element.pagamento[0].DT_CONFIRMACAO).format('DD-MM-Y') : ""
                })
            }

            let dataCsv = this.toCsv(dataResult)
            if (dataResult.length > 0) {
                dataCsv = dataCsv + "\r\n"

                dataCsv = dataCsv + this.toCsv([
                    {
                        "Total": "TOTAL",
                        "Ano": "",
                        "Mes": "",
                        "Valor Mensalidade": Math.round(valorTotal),
                        "Data Emissão DUC": "",
                        "Doc. Único Conbrança": "",
                        "Montante Recebido": Math.round(valorRecebido),
                        "Data Confirmação Tesouro": ""
                    }
                ], false)
            }

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

    async exportPdf({ response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "export", request.userID, "");
        if (true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])
            var result = await Model.query().orderBy('DT_REGISTO', 'desc').with('pagamento').with('sgigjentidade').where(data).where('ESTADO', 1).fetch()

            let valorTotal = 0
            let valorRecebido = 0
            result = result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })

            let textFilter = ""
            if (data["ANO"]) {
                textFilter = " - " + data["ANO"]
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
            

            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>
                <h2 style="font-size: 12pt !important">Contribuições ${textFilter}</h2>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Estado</th>
                       <th style="text-align: center;">Mes</th>
                       <th style="text-align: center;">Valor</th>
                       <th style="text-align: center;">Data DUC</th>
                       <th style="text-align: center;">DUC</th>
                       <th style="text-align: center;">Montante</th>
                       <th style="text-align: center;">Data Tesouro</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>

                    ${(() => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        let pagamento = element.pagamento ? element.pagamento.reduce(
                            (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.VALOR : 0,
                            0
                        ) : 0
                        valorTotal = valorTotal + element.VALOR
                        valorRecebido = valorRecebido + pagamento

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                             <td style="text-align: center;"> ${element.pagamento ? '<span style="background: green; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
                             <td style="text-align: center;"> ${element.MES}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.VALOR)}</tb>
                             <td style="text-align: center;"> ${moment(element.DT_EMISSAO_DUC).format('DD-MM-Y')}</tb>
                             <td style="text-align: center;"> ${element.DUC}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(pagamento != 0 ? pagamento : 0)}</tb>
                             <td style="text-align: center;"> ${element.pagamento.length > 0 ? moment(element.pagamento[0].DT_CONFIRMACAO).format('DD-MM-Y') : ""}</tb>
                        </tr>`
                    }
                    return tbody
                })()}
                ${(() => {
                    if (result.length > 0) {
                        return ` <tr style="background-color:#b9bdba;font-weight: bold">
                        <td style="text-align: center;font-weight: bold"> TOTAL</tb>
                        <td style="text-align: center;"> </tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorTotal)}</tb>
                        <td style="text-align: center;"> </tb>
                        <td style="text-align: center;"> </tb>
                        <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorRecebido)}</tb>
                        <td style="text-align: center;"> </tb>
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
            response.header('Content-Disposition', 'attachment; filename="contribuicoes.pdf"')
            return response.send(await this.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }


}


module.exports = ContribuicoeController
