'use strict'

const controller = "Sgigjprpecasprocessual";
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const ModelcamposTable = use('App/Models/Sigjprcampo');
const RelPecasCampos = use('App/Models/Sgigjrelpecaprocessualcampo');
const relPecasCamposTabela = "sgigjrelpecaprocessualcampo"
const camposTable = "sigjprcampo"
const functionsDatabase = require('../functionsDatabase');

class entity {
  //   {
  //     "PECA":{
  //       "DESIG": "Conclusão do Processo _ Despacho",
  //        "OBS": null,
  //        "ESTADO": "1"
  //      },
  //      "CAMPOS":[
  //          {
  //           "ID": "987678",
  //    
  //           "FLAG_OBRIGATORIEDADE ": "1",
  //           "ESTADO ": "1",
  //           "ORDEM ": "1"
  //      }]
  //  }

  async store({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(table, "create", request.userID, "");

    if (allowedMethod) {
      var dataObj = request.all();
      const list = await functionsDatabase.DBMaker(table);
      const extractRequest = functionsDatabase.extractRequest(list, [])

      let data = request.only(extractRequest)

      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)
      data.ESTADO = "1"
      data.DESIG = dataObj['PECA']['DESIG']
      data.OBS = dataObj['PECA']['OBS']
      data.CRIADO_POR = request.userID

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)

      const validation = await functionsDatabase.validation(list, data, extractRequest, table);



      if (validation.status === 'ok') {


        const pecasProcessuais = await Database
          .table(table)
          .insert(data)
        var listRelPecasCampos = []
        if (pecasProcessuais[0] == 0) {
          var campos = dataObj['CAMPOS']
          for (let index = 0; index < campos.length; index++) {
            const element = campos[index];
            let objc = {
              PR_PECASPROCESSUAL_ID: data.ID,
              PR_CAMPOS_ID: element['PR_CAMPOS_ID'],
              ORDEM: element['ORDEM'],
              FLAG_OBRIGATORIEDADE: element['FLAG_OBRIGATORIEDADE'],
              ESTADO: element['ESTADO'],
              ID: await functionsDatabase.createID(table),
            }
            
            if (element["TEXT"]) {
              objc["TEXT"] = element['TEXT']
            }

            listRelPecasCampos.push(objc)
          }
          const createRelPecasCampos = await RelPecasCampos.createMany(listRelPecasCampos);

          console.log(listRelPecasCampos)
          var dateResponse = {
            "peca": data,
            "campos": createRelPecasCampos
          }
          return (dateResponse)
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

        var dataObj = request.all();

        const list = await functionsDatabase.DBMaker(table);
        const extractRequest = functionsDatabase.extractRequest(list, [])

        let data = request.only(extractRequest)
        const validation = await functionsDatabase.validation(list, data, extractRequest, table);

        data.ESTADO = "1"
        data.DESIG = dataObj['DESIG']
        data.OBS = dataObj['OBS']

        if (validation.status === 'ok') {

          const newE = await Database
            .table(table)
            .where('ID', '' + params.id)
            .userID(request.userID)
            .update(data)

            await Database
                    .table(relPecasCamposTabela)
                    .where('PR_PECASPROCESSUAL_ID', params.id)
                    .delete(false)

          if (newE === 1) {
            const relCamposPeca = await RelPecasCampos.query().where('PR_PECASPROCESSUAL_ID', params.id).andWhere("ESTADO", "1")
              .fetch()
              .then((campo) => campo.toJSON())
            relCamposPeca.forEach(async element => {
              await Database.table(relPecasCamposTabela).update('ESTADO', '0').where('ID', element.ID)
            });
            var relPecasCampos = []
            var existe = false

            for (let element of dataObj['CAMPOS']) {
              
              const campos = await RelPecasCampos.query().where('ID', element.ID).andWhere("ESTADO", "1")
                .fetch()
                .then((campo) => campo.toJSON())
              
                const verificarOrdemExiste = await RelPecasCampos.query().where('PR_PECASPROCESSUAL_ID', params.id).andWhere("ESTADO", "1")
                .fetch()
                .then((campo) => campo.toJSON())
              
                verificarOrdemExiste.forEach(item => {
                if (item['ID'] !== element['ID']) {
                  if (item['ORDEM'] == element['ORDEM']) {
                    existe = true
                  }
                }
              });
              
              if (existe) {
                return response.status(400).json({ status: "fail", entity: "", message: "Já existe um campo nessa ordem", code: "" })
              } {
                if (campos[0]) {
                  campos[0].PR_PECASPROCESSUAL_ID = params.id
                  campos[0].PR_CAMPOS_ID = element['PR_CAMPOS_ID'],
                    campos[0].ORDEM = element['ORDEM'],
                    campos[0].FLAG_OBRIGATORIEDADE = element['FLAG_OBRIGATORIEDADE']

                    if (element["TEXT"]) {
                      campos[0]["TEXT"] = element['TEXT']
                    }
                  const newE = await Database
                    .table(relPecasCamposTabela)
                    .where('ID', '' + element.ID)
                    .update(campos[0])
                  continue
                  console.log(newE);
                  // await campo.save()
                } else {
                  var newDaTA = {
                    PR_PECASPROCESSUAL_ID: params.id,
                    PR_CAMPOS_ID: element['PR_CAMPOS_ID'],
                    ORDEM: element['ORDEM'],
                    FLAG_OBRIGATORIEDADE: element['FLAG_OBRIGATORIEDADE'],
                    ESTADO: "1",
                    DT_REGISTO: functionsDatabase.createDateNow(table),
                    ID: await functionsDatabase.createID(table)
                  }

                  const insert = await Database
                    .table(relPecasCamposTabela)
                    .insert(newDaTA)
                  console.log(insert);
                  continue
                }

              }

            }
            return data

          }

          else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

        } else return response.status(400).json(validation)
      }
    }
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

      // var rrr = await Model.query().with('sgigjrelpecaprocessualcampo.sigjprcampo').where(data).orderBy('DT_REGISTO', 'desc').fetch().then((campo) => campo.toJSON())

      var result = await Model.query().with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa').with('sgigjrelpecaprocessualcampo.sigjprcampo').where(data).where('ESTADO', 1).orderBy('DT_REGISTO', 'desc').fetch()
      console.log(result);
      // const campos = await ModelcamposTable.query().where('ESTADO', '1')
      //   .fetch()
      //   .then((campo) => campo.toJSON())
      // let res = {
      //   result: result,
      //   campos: campos
      // }
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
          .with('sgigjrelpecaprocessualcampo.sigjprcampo')
          .where('ID', '' + params.id)
          .fetch()
      }

    }

    else return response.status(403).json({ status: "403Error", entity: table, message: "show not allwed", code: "4056" })

  }

}

module.exports = entity
