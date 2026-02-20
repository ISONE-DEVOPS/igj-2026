'use strict'


const GenericController = require("./GenericController")
const Model = use('App/Models/ImpostoParametrizado');
const functionsDatabase = require('../functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()

class ImpostoParametrizadoController extends GenericController {

    table = "impostoparametrizados";
    Model = Model

    async seeder({ request, response }) {
        let table = "impostoparametrizados";
        let data = [
            {
                ID: await functionsDatabase.createID(table),
                NOME: "Imposto",
                TYPE: "IMPOSTO",
                PERCENTAGEM: 10,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },
            {
                ID: await functionsDatabase.createID(table),
                NOME: "Orçamento Estado",
                TYPE: "ORCAMENTO_ESTADO",
                PERCENTAGEM: 50,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },
            {
                ID: await functionsDatabase.createID(table),
                NOME: "“Fundo Des. Turismo",
                TYPE: "FUNDO_TURISMO",
                PERCENTAGEM: 15,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },
            {
                ID: await functionsDatabase.createID(table),
                NOME: "Fundo Des. Desporto",
                TYPE: "FUNDO_DESPORTO",
                PERCENTAGEM: 10,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },
            {
                ID: await functionsDatabase.createID(table),
                NOME: "Fundo A. A. Cultura",
                TYPE: "FUNDO_CULTURA",
                PERCENTAGEM: 10,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },
            {
                ID: await functionsDatabase.createID(table),
                NOME: "Municípios da Área Coberta Concessão",
                TYPE: "FUNDO_AREA_COBERTURA",
                PERCENTAGEM: 10,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },
            {
                ID: await functionsDatabase.createID(table),
                NOME: "Fundo A. Ensino e Formação",
                TYPE: "FUNDO_ENSINO",
                PERCENTAGEM: 5,
                DT_REGISTO: await functionsDatabase.createDateNow(table),
                ESTADO: "1"

            },

        ]


        data.forEach(async element => {
            await Database
                .table(table)
                .insert(element)
        });
    }
}



module.exports = ImpostoParametrizadoController
