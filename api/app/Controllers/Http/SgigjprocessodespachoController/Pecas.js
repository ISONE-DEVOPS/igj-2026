'use strict'

const controller = "Sgigjrelinstrutorpeca";
let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const GlbnotificacaoFunctions = use('App/Controllers/Http/GlbnotificacaoFunctions');
const functionsDatabase = require('../../functionsDatabase');
const Sgigjrelinstrutorpeca = use('App/Models/Sgigjrelinstrutorpeca');
const Sgigjprpecasprocessual = use('App/Models/Sgigjprpecasprocessual');
const pdfCreater = require('../pdfCreater');
const { buildOfficialTemplatePeca } = require('../pdfTemplate');
const Env = use('Env')
const User = use('App/Models/Glbuser');
const Sgigjrelpessoaentidade = use("App/Models/Sgigjrelpessoaentidade");
const moment = require("moment");

const store = async ({ params, request, response }) => {
  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");
  if (allowedMethod) {

    const element = await functionsDatabase.existelement(table, params.id)

    if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }
    else {
      var find_instrucaopecas = await Sgigjrelinstrutorpeca
        .query()
        .with("sgigjrelprocessoinstrucao")
        .where({
          ID: "" + params.id
        })
        .fetch()

      const instrucaopecas = find_instrucaopecas.rows[0].$attributes
      const instrucao = find_instrucaopecas.rows[0].$relations.sgigjrelprocessoinstrucao.$attributes

      // Permite gerar PDF de peças mesmo após o Relatório Final
      // Peças podem ser inseridas enquanto o processo não estiver encerrado

      let user = await User.query().where("glbuser.ID", request.userID).first()
      let nameUser = ""
      if (user) {
        let Pessoa = await Sgigjrelpessoaentidade.query().with("sgigjpessoa").where("sgigjrelpessoaentidade.ID", user.REL_PESSOA_ENTIDADE_ID).first()
        nameUser = Pessoa ? Pessoa.$relations.sgigjpessoa.$attributes.NOME : ""
      }

      let data = {}
      const pdftxt = {
        content: buildOfficialTemplatePeca(instrucaopecas?.OBS, nameUser, user.ASSINATURA_URL),
        tipo: "pecasinstrucao.pdf",
      }

      const pdfcreated = await pdfCreater(pdftxt)

      if (pdfcreated?.status == true) data.URL_DOC = pdfcreated?.url
      else {

        response.status(400).json({ status: "fail", entity: "", message: "creating pdf", code: "" })

      }

      const newE = await Database
        .table(table)
        .where('ID', '' + params.id)
        .userID(request.userID)
        .update(data)


      if (newE === 1) {
        data.ID = params.id
        const nomeUtilizador = await functionsDatabase.userIDToNome(request.userID)
        const dataHoje = moment().format("DD/MM/YYYY HH:mm")

        let nomePeca = ""
        if (instrucaopecas?.PR_PECAS_PROCESSUAIS_ID) {
          const pecaInfo = await Sgigjprpecasprocessual.query().where("ID", instrucaopecas.PR_PECAS_PROCESSUAIS_ID).first()
          if (pecaInfo) nomePeca = pecaInfo.DESIG || ""
        }
        const pecaTexto = nomePeca ? ` - ${nomePeca}` : ""

        GlbnotificacaoFunctions.storeToPerfil({
          request,
          PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
          MSG: `${nomeUtilizador} adicionou uma peça ao processo (Código: ${instrucaopecas?.CODIGO}${pecaTexto}) em ${dataHoje}.`,
          TITULO: "Peça no Processo",
          PESSOA_ID: null,
          URL: `/processos/exclusaointerdicao`
        })

        GlbnotificacaoFunctions.storeToPerfil({
          request,
          PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspector
          MSG: `${nomeUtilizador} adicionou uma peça ao processo (Código: ${instrucaopecas?.CODIGO}${pecaTexto}) em ${dataHoje}.`,
          TITULO: "Peça no Processo",
          PESSOA_ID: null,
          URL: `/processos/exclusaointerdicao`
        })

        return (data)
      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
    }

  }

  else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })
}

module.exports = store
