'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Imposto');
const ImpostoParametrizado = use('App/Models/ImpostoParametrizado');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
var pdf = require('html-pdf');
const Env = use('Env')
const ModelEntidade = use('App/Models/Sgigjentidade');

class ImpostoController extends GenericController {

    table = "impostos";
    Model = Model

    async store({ request, response }) {

        const allowedMethod = await functionsDatabase.allowed(this.table, "create", request.userID, "");

        if (allowedMethod || true) {

            const list = await functionsDatabase.DBMaker(this.table);
            console.log("list", list)
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

            let impostoParametrizados = await ImpostoParametrizado
                .query()
                .where('ESTADO', 1).fetch()



            if (impostoParametrizados) {
                impostoParametrizados = impostoParametrizados.rows
                let params = {}
                for (let index = 0; index < impostoParametrizados.length; index++) {
                    const element = impostoParametrizados[index];
                    params[element.TYPE] = element.PERCENTAGEM
                }

                if (params["IMPOSTO"]) {
                    data.IMPOSTO = (params["IMPOSTO"] / 100) * data.BRUTO

                    if (params["ORCAMENTO_ESTADO"]) {
                        data.ORCAMENTO_ESTADO = (params["ORCAMENTO_ESTADO"] / 100) * data.IMPOSTO
                    }

                    if (params["FUNDO_TURISMO"]) {
                        data.FUNDO_TURISMO = (params["FUNDO_TURISMO"] / 100) * data.IMPOSTO
                    }

                    if (params["FUNDO_DESPORTO"]) {
                        data.FUNDO_DESPORTO = (params["FUNDO_DESPORTO"] / 100) * data.IMPOSTO
                    }

                    if (params["FUNDO_CULTURA"]) {
                        data.FUNDO_CULTURA = (params["FUNDO_CULTURA"] / 100) * data.IMPOSTO
                    }
                    if (params["FUNDO_AREA_COBERTURA"]) {
                        data.FUNDO_AREA_COBERTURA = (params["FUNDO_AREA_COBERTURA"] / 100) * data.IMPOSTO
                    }
                    if (params["FUNDO_ENSINO"]) {
                        data.FUNDO_ENSINO = (params["FUNDO_ENSINO"] / 100) * data.IMPOSTO
                    }
                }
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
                const validation = await functionsDatabase.validation(list, data, extractRequest, this.table);

                let impostoParametrizados = await ImpostoParametrizado
                    .query()
                    .where('ESTADO', 1).fetch()



                if (impostoParametrizados) {
                    impostoParametrizados = impostoParametrizados.rows
                    let params = {}
                    for (let index = 0; index < impostoParametrizados.length; index++) {
                        const element = impostoParametrizados[index];
                        params[element.TYPE] = element.PERCENTAGEM
                    }

                    if (params["IMPOSTO"]) {
                        data.IMPOSTO = (params["IMPOSTO"] / 100) * data.BRUTO

                        if (params["ORCAMENTO_ESTADO"]) {
                            data.ORCAMENTO_ESTADO = (params["ORCAMENTO_ESTADO"] / 100) * data.IMPOSTO
                        }

                        if (params["FUNDO_TURISMO"]) {
                            data.FUNDO_TURISMO = (params["FUNDO_TURISMO"] / 100) * data.IMPOSTO
                        }

                        if (params["FUNDO_DESPORTO"]) {
                            data.FUNDO_DESPORTO = (params["FUNDO_DESPORTO"] / 100) * data.IMPOSTO
                        }

                        if (params["FUNDO_CULTURA"]) {
                            data.FUNDO_CULTURA = (params["FUNDO_CULTURA"] / 100) * data.IMPOSTO
                        }
                        if (params["FUNDO_AREA_COBERTURA"]) {
                            data.FUNDO_AREA_COBERTURA = (params["FUNDO_AREA_COBERTURA"] / 100) * data.IMPOSTO
                        }
                        if (params["FUNDO_ENSINO"]) {
                            data.FUNDO_ENSINO = (params["FUNDO_ENSINO"] / 100) * data.IMPOSTO
                        }
                    }
                }

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
                .where('ESTADO', 1).fetch()
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

            let BRUTO = 0
            let IMPOSTO = 0
            let ORCAMENTO_ESTADO = 0
            let FUNDO_TURISMO = 0
            let FUNDO_DESPORTO = 0
            let FUNDO_CULTURA = 0
            let FUNDO_AREA_COBERTURA = 0
            let FUNDO_ENSINO = 0

            result = result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })
            let dataResult = []
            for (let index = 0; index < result.length; index++) {
                let element = result[index];

                BRUTO = BRUTO + element.BRUTO
                IMPOSTO = IMPOSTO + element.IMPOSTO
                ORCAMENTO_ESTADO = ORCAMENTO_ESTADO + element.ORCAMENTO_ESTADO
                FUNDO_TURISMO = FUNDO_TURISMO + element.FUNDO_TURISMO
                FUNDO_DESPORTO = FUNDO_DESPORTO + element.FUNDO_DESPORTO
                FUNDO_CULTURA = FUNDO_CULTURA + element.FUNDO_CULTURA
                FUNDO_AREA_COBERTURA = FUNDO_AREA_COBERTURA + element.FUNDO_AREA_COBERTURA
                FUNDO_ENSINO = FUNDO_ENSINO + element.FUNDO_ENSINO

                dataResult.push({
                    "Pagamento": element.pagamento.length > 0 ? "Sim" : "Não",
                    "Ano": element.ANO,
                    "Mes": element.MES,
                    "Receita Bruto": Math.round(element.BRUTO),
                    "Imposto": Math.round(element.IMPOSTO),
                    "DUC": element.DUC,
                    "Orçamento Estado (50%)": Math.round(element.ORCAMENTO_ESTADO),
                    "Fundo Des. Turismo (15$)": Math.round(element.FUNDO_TURISMO),
                    "Fundo Des. Desporto (10%)": Math.round(element.FUNDO_DESPORTO),
                    "Fundo A. A. Cultura (10%)": Math.round(element.FUNDO_CULTURA),
                    "Municípios da Área Coberta Concessão (10%)": Math.round(element.FUNDO_AREA_COBERTURA),
                    "Fundo A. Ensino e Formação (5%)": Math.round(element.FUNDO_ENSINO),
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
                        "Receita Bruto": Math.round(BRUTO),
                        "Imposto": Math.round(IMPOSTO),
                        "DUC": "",
                        "Orçamento Estado (50%)": Math.round(ORCAMENTO_ESTADO),
                        "Fundo Des. Turismo (15$)": Math.round(FUNDO_TURISMO),
                        "Fundo Des. Desporto (10%)": Math.round(FUNDO_DESPORTO),
                        "Fundo A. A. Cultura (10%)": Math.round(FUNDO_CULTURA),
                        "Municípios da Área Coberta Concessão (10%)": Math.round(FUNDO_AREA_COBERTURA),
                        "Fundo A. Ensino e Formação (5%)": Math.round(FUNDO_ENSINO),
                    }
                ], false)
            }

            await Database
            .table(this.table)
            .userID(request.userID)
            .registerExport("CSV")
            
            response.header('Content-type', 'text/csv')
            response.header('Content-Disposition', 'attachment; filename="imposto.csv"')
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

            let BRUTO = 0
            let IMPOSTO = 0
            let ORCAMENTO_ESTADO = 0
            let FUNDO_TURISMO = 0
            let FUNDO_DESPORTO = 0
            let FUNDO_CULTURA = 0
            let FUNDO_AREA_COBERTURA = 0
            let FUNDO_ENSINO = 0

            result = result.toJSON().sort((itemA, itemB) => {
                let ano = (itemA.ANO - itemB.ANO)
                let mes = (this.positionMounth(itemA.MES) - this.positionMounth(itemB.MES))
                return ano == 0 ? mes : ano
            })
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

            // const logoIgj = Env.get("APP_URL")+"/resources/logoigj.jpg"
            const logoIgj = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-2467355902521149-logoigj.jpg?alt=media&token=0";
            // const logoMinisterio = Env.get("APP_URL")+"/resources/logominsterio.png"
            const logoMinisterio = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4358817791332590-logominsterio.png?alt=media&token=0"

            const content = `<div >
            <div style="margin:8px 8px 8px 8px;width: 100%;z-index: 2;">
                <div style="margin-top: 10px;margin-bottom: 40px;">
                    <img src="${logoMinisterio}" alt="Paris" style="width: 350px;height:80px !important;">
                    <img src="${logoIgj}" alt="Paris" style="width: 175px;height:100px !important;float:right">
                </div>
                
                <p>
                    <span style="font-size: 12pt !important;float:left;font-weight:700">Imposto Especial ${textFilter}</span>
                    <span style="margin-left:70%; font-size: 8pt !important;">Moeda: CVE</span>
                </p>

                <table style="border-collapse: collapse;font-size: 6pt !important;width: 97%;">
                  <thead style="background-color:#2b7fb9;color:#fff">
                    <tr style="margin-top:5px">
                       <th style="text-align: center;">Estado</th>
                       <th style="text-align: center;">Mes</th>
                       <th style="text-align: center;">Receita Bruta</th>
                       <th style="text-align: center;">Imposto</th>
                       <th style="text-align: center;">DUC</th>
                       <th style="text-align: center;">Orçamento Estado</th>
                       <th style="text-align: center;">Fundo Des. Turismo</th>
                       <th style="text-align: center;">Fundo Des. Desporto</th>
                       <th style="text-align: center;">Fundo A. A. Cultura</th>
                       <th style="text-align: center;">Mun. Área Coberta Concessão</th>
                       <th style="text-align: center;">Fundo A. Ensino e Formação</th>
                      
                    </tr>
                  </thead>
                  
                  <tbody>

                    ${(() => {
                    let tbody = ""
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        BRUTO = BRUTO + element.BRUTO
                        IMPOSTO = IMPOSTO + element.IMPOSTO
                        ORCAMENTO_ESTADO = ORCAMENTO_ESTADO + element.ORCAMENTO_ESTADO
                        FUNDO_TURISMO = FUNDO_TURISMO + element.FUNDO_TURISMO
                        FUNDO_DESPORTO = FUNDO_DESPORTO + element.FUNDO_DESPORTO
                        FUNDO_CULTURA = FUNDO_CULTURA + element.FUNDO_CULTURA
                        FUNDO_AREA_COBERTURA = FUNDO_AREA_COBERTURA + element.FUNDO_AREA_COBERTURA
                        FUNDO_ENSINO = FUNDO_ENSINO + element.FUNDO_ENSINO

                        tbody = tbody + `<tr ${index % 2 == 0 ? 'style="background-color:#f5f5f5;color:#000"' : 'background-color:#fff;color:#000"'}>
                            <td > ${element.pagamento.length > 0 ? '<span style="background: green; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>' : '<span style="background: red; width: 14px;height: 12px;display: block;border-radius: 50%;margin: auto;"></span>'}</tb>
                             <td style="text-align: center;"> ${element.MES}</tb>
                             <td style="text-align: right;"><span style="margin-right:10px"> ${this.formatCurrency(element.BRUTO)}</span></tb>
                             <td style="text-align: right;"><span style="margin-right:10px"> ${this.formatCurrency(element.IMPOSTO)}</span></tb>
                             <td style="text-align: center;"> ${element.DUC}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.ORCAMENTO_ESTADO)}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.FUNDO_TURISMO)}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.FUNDO_DESPORTO)}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.FUNDO_CULTURA)}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.FUNDO_AREA_COBERTURA)}</tb>
                             <td style="text-align: right;"> ${this.formatCurrency(element.FUNDO_ENSINO)}</tb>
                            
                        </tr>`
                    }
                    return tbody
                })()}
                ${(() => {
                    if (result.length > 0) {
                        return `<tr style="background-color:#b9bdba;font-weight: bold;padding-top:10px">
                        <td style="text-align: center;font-weight: bold;">TOTAL</tb>
                        <td > </tb>
                         <td style="text-align: right;font-weight: bold;"><span style="margin-right:10px"> ${this.formatCurrency(BRUTO)}</span></tb>
                         <td style="text-align: right;font-weight: bold;"><span style="margin-right:10px"> ${this.formatCurrency(IMPOSTO)}</span></tb>
                         <td style="text-align: center;;"></tb>
                         <td style="text-align: right;font-weight: bold;"> ${this.formatCurrency(ORCAMENTO_ESTADO)}</tb>
                         <td style="text-align: right;font-weight: bold;"> ${this.formatCurrency(FUNDO_TURISMO)}</tb>
                         <td style="text-align: right;font-weight: bold;"> ${this.formatCurrency(FUNDO_DESPORTO)}</tb>
                         <td style="text-align: right;font-weight: bold;"> ${this.formatCurrency(FUNDO_CULTURA)}</tb>
                         <td style="text-align: right;font-weight: bold;"> ${this.formatCurrency(FUNDO_AREA_COBERTURA)}</tb>
                         <td style="text-align: right;font-weight: bold;"> ${this.formatCurrency(FUNDO_ENSINO)}</tb>
                        
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
            response.header('Content-Disposition', 'attachment; filename="imposto.pdf"')
            return response.send(await this.toPdf(content))
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async toPdf(content) {

        const pdfCreater = async (data) => {
            let promise = new Promise((resolve, reject) => {
                pdf.create(data, { "format": "A4", "border": { "top": "15mm", "right": "15mm", "bottom": "15mm", "left": "15mm" }, "type": "pdf", "orientation": "landscape" }).toBuffer(function (err, buffer) {
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

    formatCurrency(value) {
        if (typeof value !== 'number') {
            return '0';
        }

        // Round the value to 2 decimal places, rounding half up
        const roundedValue = Math.round(value);

        // Split the number into integer and fractional parts
        const parts = roundedValue.toString().split('.');

        // Format the integer part with thousands separator
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        // Ensure there is a fractional part with two decimal places
        const fractionalPart = parts.length > 1 ? parts[1].padEnd(2, '0') : '00';

        // Combine the formatted parts with the currency symbol
        const formattedNumber = `${integerPart},${fractionalPart}`;

        return formattedNumber;
    }
}


module.exports = ImpostoController
