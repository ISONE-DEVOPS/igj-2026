'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Contrapartida');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const Contrapartidaentidade = use('App/Models/Contrapartidaentidade');
const moment = require("moment");
const ModelEntidade = use('App/Models/Sgigjentidade');

class ContrapartidaController extends GenericController {

    table = "contrapartidas";
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

            let contrapartidaentidade = await Contrapartidaentidade
                .query()
                .where('ENTIDADE_ID', '' + data.ENTIDADE_ID)
                .where('ESTADO', 1)
                .with('contrapartidaParamentrizado')
                .first()


            if (!contrapartidaentidade) {
                return { status: "fail", entity: "", message: "Não existe percentagem de contrapartida definido para esta entidade", code: "" }
            }

            contrapartidaentidade = contrapartidaentidade.toJSON()

            data.Art_48_percent = data.BRUTO * (contrapartidaentidade.contrapartidaParamentrizado.Art_48_percent / 100)
            data.Art_49_percent = data.BRUTO * (contrapartidaentidade.contrapartidaParamentrizado.Art_49_percent / 100)

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

    async update({ params, request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "update", request.userID, params.id);

        if (allowedMethod || true) {

            const element = await functionsDatabase.existelement(this.table, params.id)

            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                const list = await functionsDatabase.DBMaker(this.table);
                const extractRequest = functionsDatabase.extractRequest(list, ["ESTADO"])

                let data = request.only(extractRequest)
                let contrapartidaentidade = await Contrapartidaentidade
                    .query()
                    .where('ENTIDADE_ID', '' + data.ENTIDADE_ID)
                    .where('ESTADO', 1)
                    .with('contrapartidaParamentrizado')
                    .first()


                if (!contrapartidaentidade) {
                    return { status: "fail", entity: "", message: "Não existe percentagem de contrapartida definido para esta entidade", code: "" }
                }

                contrapartidaentidade = contrapartidaentidade.toJSON()

                data.Art_48_percent = data.BRUTO * (contrapartidaentidade.contrapartidaParamentrizado.Art_48_percent / 100)
                data.Art_49_percent = data.BRUTO * (contrapartidaentidade.contrapartidaParamentrizado.Art_49_percent / 100)

                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                if (validation.status === 'ok') {

                    const newE = await Database
                        .table(this.table)
                        .where('ID', '' + params.id)
                        .where('ESTADO', 1)
                        .userID(request.userID)
                        .update(data)


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

            let valorBruto = 0
            let valorArt48 = 0
            let valorArt49 = 0
            let valorTotal = 0
            result = result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })
            let dataResult = []
            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                // let total = element.pagamento.length > 0 ? element.pagamento.reduce(
                //     (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.VALOR : 0,
                //     0
                // ) : 0
                let total = (element.Art_48_percent ? element.Art_48_percent : 0) + (element.Art_49_percent ? element.Art_49_percent : 0)
                valorBruto = valorBruto + element.BRUTO
                valorArt48 = valorArt48 + element.Art_48_percent
                valorArt49 = valorArt49 + element.Art_49_percent
                valorTotal = valorTotal + total

                dataResult.push({
                    "Pagamento": element.pagamento ? "Sim" : "Não",
                    "Ano": element.ANO,
                    "Mes": element.MES,
                    "Receita Bruta": Math.round(element.BRUTO),
                    "Artigo 48ª (3%)": Math.round(element.Art_48_percent),
                    "DUC (Artº 48ª)": element.DUC_Art_48,
                    "Data de emissão de DUC (Artº 48ª)": moment(element.DT_EMISSAO_DUC_Art_48).format('DD-MM-Y'),
                    "Artigo 49ª (3%)": Math.round(element.Art_49_percent),
                    "DUC (Artº 49ª)": element.DUC_Art_49,
                    "Data de emissão de DUC (Artº 49ª)": moment(element.DT_EMISSAO_DUC_Art_49).format('DD-MM-Y'),
                    "Total Recebimento": Math.round(total)
                })
            }

            let dataCsv = this.toCsv(dataResult)
            if (dataResult.length > 0) {
                dataCsv = dataCsv + "\r\n"

                dataCsv = dataCsv + this.toCsv([
                    {
                        "Total": "Total",
                        "Ano": "",
                        "Mes": "",
                        "Receita Bruta": Math.round(valorBruto),
                        "Artigo 48ª (3%)": Math.round(valorArt48),
                        "DUC (Artº 48ª)": "",
                        "Data de emissão de DUC (Artº 48ª)": "",
                        "Artigo 49ª (3%)": Math.round(valorArt49),
                        "DUC (Artº 49ª)": "",
                        "Data de emissão de DUC (Artº 49ª)": "",
                        "Total Recebimento": Math.round(valorTotal)
                    }
                ], false)
            }

            await Database
                .table(this.table)
                .userID(request.userID)
                .registerExport("CSV")

            response.header('Content-type', 'text/csv')
            response.header('Content-Disposition', 'attachment; filename="contrapartidas.csv"')
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
            var result = await Model.query().orderBy('DT_REGISTO', 'desc').with('sgigjentidade').with('pagamento').where(data).where('ESTADO', 1).fetch()

            let textFilter = ""


            if (data["ANO"]) {
                textFilter = " - " + data["ANO"]
            }


            let valorBruto = 0
            let valorArt48 = 0
            let valorArt49 = 0
            let valorTotal = 0
            result = result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })

            let nameEntidade = result.length > 0 && result[0].sgigjentidade ? result[0].sgigjentidade.DESIG : "";
            if (nameEntidade == "" && data["ENTIDADE_ID"]) {
                let entidade = (await ModelEntidade.query().where("ID", data["ENTIDADE_ID"]).first()).toJSON()
                if (entidade) {
                    textFilter = textFilter + " - " + entidade.DESIG
                }
            } else {
                textFilter = textFilter + " - " + nameEntidade
            }

            let logo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
                <div style=" margin-bottom: 40px; margin-left: -20px;">
                    <img src="${logo}" alt="Paris" style="width: 100%;height:70px">
                </div>
                <h2 style="font-size: 12pt !important">Contrapartida ${textFilter}</h2>

                <table style="border-collapse: collapse;font-size: 5pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr>
                       <th style="text-align: center;">Estado</th>
                       <th style="text-align: center;">Mes</th>
                       <th style="text-align: center;">Receita Bruta</th>
                       <th style="text-align: center;">Contrapartida 1</th>
                       <th style="text-align: center;">DUC Contrapartida 1</th>
                       <th style="text-align: center;">Contrapartida 2</th>
                       <th style="text-align: center;">DUC Contrapartida 2</th>
                       <th style="text-align: center;">Total Recebimento</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>

                    ${(() => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        // let total = element.pagamento.length > 0 ? element.pagamento.reduce(
                        //     (accumulator, currentValue) => currentValue.ESTADO != 0 ? accumulator + currentValue.VALOR : 0,
                        //     0
                        // ) : 0

                        let total = (element.Art_48_percent ? element.Art_48_percent : 0) + (element.Art_49_percent ? element.Art_49_percent : 0)

                        valorBruto = valorBruto + element.BRUTO
                        valorArt48 = valorArt48 + (element.Art_48_percent ? element.Art_48_percent : 0)
                        valorArt49 = valorArt49 + (element.Art_49_percent ? element.Art_49_percent : 0)
                        valorTotal = valorTotal + total
                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                             <td style="text-align: center;"> ${element.pagamento.length > 0 ? '<span style="background: green; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
                             <td style="text-align: center;"> ${element.MES}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.BRUTO)}</tb>
                             <td style="text-align: right;"> ${element.Art_48_percent ? this.formatCurrency(element.Art_48_percent) : "0 CVE"}</tb>
                             <td style="text-align: center;"> ${element.DUC_Art_48}</tb>
                             <td style="text-align: right;"> ${element.Art_49_percent ? this.formatCurrency(element.Art_49_percent) : "0 CVE"}</tb>
                             <td style="text-align: center;"> ${element.DUC_Art_49}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(total)}</tb>
    
                        </tr>`
                    }
                    return tbody
                })()}

                ${(() => {
                    if (result.length > 0) {
                        return `<tr style="background-color:#b9bdba;font-weight: bold">
                      <td style="text-align: center;font-weight: bold">TOTAL</tb>
                       <td style="text-align: center;"> </tb>
                       <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorBruto)}</tb>
                       <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorArt48)}</tb>
                       <td style="text-align: center;"> </tb>
                       <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorArt49)}</tb>
                       <td style="text-align: center;"> </tb>
                       <td style="text-align: right;font-weight: bold"> ${this.formatCurrency(valorTotal)}</tb>
  
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
            response.header('Content-Disposition', 'attachment; filename="contrapartida.pdf"')
            return response.send(await this.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }


}

module.exports = ContrapartidaController

