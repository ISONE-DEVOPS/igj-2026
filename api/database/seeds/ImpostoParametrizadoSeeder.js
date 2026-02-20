'use strict'

/*
|--------------------------------------------------------------------------
| ImpostoParametrizadoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const functionsDatabase = require('../../app/Controllers/functionsDatabase');
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = "impostoparametrizados"

class ImpostoParametrizadoSeeder {
  async run() {
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
      console.log(await Database
        .table(table)
        .insert(element)  .toSQL())
    });

  }
}

module.exports = ImpostoParametrizadoSeeder