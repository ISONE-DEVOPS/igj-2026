
const controller = "Sigjprcampo";

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');

class entity {

  async index({ request, response, view }) {
    // const allowedMethod = await functionsDatabase.allowed(table, "index", request.userID, "");

    // if (allowedMethod) {

    const list = await functionsDatabase.DBMaker(table);
    const extractRequest = functionsDatabase.extractRequest(list, [])
    const data = functionsDatabase.indexconfig(request, extractRequest, ['DT_REGISTO'])

    var result = await Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').where(function () {
      //this.where('events.start_date', '>=', now),
      this.where(data),
        this.andWhere('ESTADO', '<>', '0')
    }).orderBy('DT_REGISTO', 'desc').fetch()


    return result

  }

  // else return response.status(403).json({ status: "403Error", entity: table, message: "index not allwed", code: "4054" })




  async store({ request, response }) {
    // const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");
    const list = await functionsDatabase.DBMaker(table);
    const extractRequest = functionsDatabase.extractRequest(list, [])

    let data = request.only(extractRequest)

    data.ID = await functionsDatabase.createID(table)
    data.DT_REGISTO = functionsDatabase.createDateNow(table)
    data.ESTADO = "1"
    data.CRIADO_POR = request.userID

    if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

    const validation = await functionsDatabase.validation(list, data, extractRequest, table);

    var exists = false
    if (validation.status === 'ok') {
      const campos = await Model.query().where('ESTADO', '1')
        .fetch()
        .then((campo) => campo.toJSON())
      if (campos.length > 0) {
        for (let index = 0; index < campos.length; index++) {
          if ((campos[index].FLAG_PESSOA == 1 && data.FLAG_PESSOA == 1)) {
            exists = true
            continue
          } if ((campos[index].FLAG_DECISAO == 1 && data.FLAG_DECISAO == 1)) {
            exists = true
            continue
          }
          if ((campos[index].FLAG_ANEXO_DOC == 1 && data.FLAG_ANEXO_DOC == 1)) {
            exists = true
            continue
          }
          if ((campos[index].FLAG_OBS == 1 && data.FLAG_OBS == 1)) {
            exists = true
            continue
          }
          if ((campos[index].FLAG_DESTINATARIO == 1 && data.FLAG_DESTINATARIO == 1)) {
            exists = true
            continue
          }
          if ((campos[index].FLAG_INFRACAO_COIMA == 1 && data.FLAG_INFRACAO_COIMA == 1)) {
            exists = true
            continue
          } if ((campos[index].FLAG_PERIODO_EXCLUSAO == 1 && data.FLAG_PERIODO_EXCLUSAO == 1)) {
            exists = true
            continue
          }
          if ((campos[index].FLAG_TEXTO == 1 && data.FLAG_TEXTO == 1)) {
            exists = true
            continue
          }
        }
      }

      var newE;
      if (!exists) {
        newE = await Database
          .table(table)
          .insert(data)
      } else {
        return response.status(400).json({ status: "fail", entity: "", message: "Já existe um campo criado com essa FLAG.", code: "" })
      }


      if (newE[0] === 0) {
        return (data)
      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

    } else return response.status(400).json(validation)





  }


  async show({ params, response, request }) {

    return await Model.findOrFail(params.id)
  }



  async update({ params, request, response }) {

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


  async destroy({ params, response, request }) {

    const element = await functionsDatabase.existelement(table, params.id)

    if (element === false) return response.status(400).json({ status: "erro", entity: table, message: "doesnt exist", code: 999 })

    else {
      const newE = await Database.table(table).userID(request.userID).update({ 'ESTADO': '0', "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table) }).where('id', params.id)
      if (newE === 1) {
        return { status: "ok", entity: table + "." + params.id, message: "deleted", code: "888" }
      }
      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })
    }




  }

}

module.exports = entity
