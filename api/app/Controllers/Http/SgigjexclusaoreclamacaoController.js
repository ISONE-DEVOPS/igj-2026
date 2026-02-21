'use strict'

const controller = "Sgigjexclusaoreclamacao";



let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);


const functionsDatabase = require('../functionsDatabase');
const pdfCreater = require('./pdfCreater');
const Env = use('Env');








class entity {






  async store({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])

      let data = request.only(extractRequest)

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);



      if (validation.status === 'ok') {


        const newE = await Database
          .table(table)
          .insert(data)



        if (newE[0] === 0) {
          return (data)
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      } else return response.status(400).json(validation)


    }

    else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

  }











  async update({ params, request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "update", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return { status: "erro", entity: table, message: "doesnt exist", code: 999 }

      else {




        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, [])

        let data = request.only(extractRequest)
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);



        if (validation.status === 'ok') {

          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)


          if (newE === 1) {
            return (data)
          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

        } else return response.status(400).json(validation)


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "update not allowed", code: "4052" })

  }









  async destroy({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "delete", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        const newE = await Database
          .table(table)
          .where('ID', '' + params.id)
          .userID(request.userID)
          .update({
            "ESTADO": 0,
            "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table)
          })


        if (newE === 1) {
          return { status: "ok", entity: table + "." + params.id, message: "deleted", code: "888" }
        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "delete not allwed", code: "4053" })

  }














  async index({ request, response }) {


    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");

    if (allowedMethod) {

      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])
      const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

      var result = await Model.query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjprocessoexclusao.sgigjrelinterveniente.sgigjpessoa')
        .with('sgigjprocessoexclusao.sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjrelprocessoinstrucao')
        .with('sgigjrelreclamacaopeca.sgigjprpecasprocessual')
        .where(data).where('ESTADO', 1).orderBy('DT_REGISTO', 'desc').fetch()


      return result

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })


  }









  async show({ params, response, request }) {

    const allowedMethod = await functionsDatabase.allowed(table, "show", request.userID, params.id);

    if (allowedMethod) {

      const element = await functionsDatabase.existelement(table, params.id)

      if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

      else {

        return await Model
          .query()
          .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
          .with('sgigjprocessoexclusao.sgigjrelinterveniente.sgigjpessoa')
          .with('sgigjprocessoexclusao.sgigjentidade')
          .with('sgigjrelpessoaentidade.sgigjpessoa')
          .with('sgigjrelprocessoinstrucao')
          .with('sgigjrelreclamacaopeca.sgigjprpecasprocessual')
          .where('ID', '' + params.id)
          .fetch()


      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }



  async exportPdf({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");

    if (allowedMethod) {

      var result = await Model.query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjprocessoexclusao.sgigjrelinterveniente.sgigjpessoa')
        .with('sgigjprocessoexclusao.sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .where('ESTADO', 1).orderBy('DT_REGISTO', 'desc').fetch()

      result = result.toJSON()

      let rows = ""
      for (let i = 0; i < result.length; i++) {
        const e = result[i]
        const processo = e.sgigjprocessoexclusao || {}
        const entidade = processo.sgigjentidade || {}
        const intervenientes = processo.sgigjrelinterveniente || []
        const visado = intervenientes.length > 0 ? (intervenientes[0].sgigjpessoa || {}) : {}

        rows += `<tr>
          <td>${e.CODIGO || ''}</td>
          <td>${processo.REF || ''}</td>
          <td>${visado.NOME || ''}</td>
          <td>${entidade.DESIG || ''}</td>
          <td>${e.DATA || ''}</td>
        </tr>`
      }

      const pdftxt = {
        content: `
          <div style="width: 100%; zoom: ${Env.get("ZOOM_PDF", "")};">
            <div style="margin-bottom: 30px;">
              <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
            </div>
            <div style="padding: 0 40px; font-family: 'Times New Roman', serif;">
              <h3 style="text-align: center; font-family: 'Times New Roman', serif; font-size: 16pt;">Lista de Reclama\u00e7\u00f5es</h3>
              <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 10pt;">
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th>C\u00f3digo</th>
                    <th>Processo</th>
                    <th>Visado</th>
                    <th>Entidade</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
            <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
              <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                Rua Largo da Europa, Pr\u00e9dio BCA 2\u00ba Andar C.P. 57 A - Telf: 2601877 Achada de Santo Ant\u00f3nio \u2013 Praia www.igj.cv
              </p>
            </div>
          </div>`,
        tipo: "reclamacoes_lista.pdf",
      }

      const pdfcreated = await pdfCreater(pdftxt)
      if (pdfcreated?.status == true) {
        Database.registerExport(request.userID, table, "PDF")
        return { url: pdfcreated.url }
      }

      return response.status(400).json({ status: "fail", message: "Erro ao gerar PDF" })

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })

  }


  async exportCsv({ request, response }) {

    const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");

    if (allowedMethod) {

      var result = await Model.query()
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjprocessoexclusao.sgigjrelinterveniente.sgigjpessoa')
        .with('sgigjprocessoexclusao.sgigjentidade')
        .with('sgigjrelpessoaentidade.sgigjpessoa')
        .where('ESTADO', 1).orderBy('DT_REGISTO', 'desc').fetch()

      result = result.toJSON()

      let csv = "C\u00f3digo;Processo;Visado;Entidade;Data;Observa\u00e7\u00f5es\n"
      for (let i = 0; i < result.length; i++) {
        const e = result[i]
        const processo = e.sgigjprocessoexclusao || {}
        const entidade = processo.sgigjentidade || {}
        const intervenientes = processo.sgigjrelinterveniente || []
        const visado = intervenientes.length > 0 ? (intervenientes[0].sgigjpessoa || {}) : {}

        csv += `${e.CODIGO || ''};${processo.REF || ''};${visado.NOME || ''};${entidade.DESIG || ''};${e.DATA || ''};${(e.OBS || '').replace(/;/g, ',').replace(/\n/g, ' ')}\n`
      }

      Database.registerExport(request.userID, table, "CSV")

      response.header('Content-Type', 'text/csv')
      response.header('Content-Disposition', 'attachment; filename=reclamacoes.csv')
      return csv

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })

  }

}

module.exports = entity
