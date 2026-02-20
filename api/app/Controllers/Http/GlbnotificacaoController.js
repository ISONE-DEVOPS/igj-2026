'use strict'

const controller = "Glbnotificacao";



let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const ModelAutoExclusao = use("App/Models/Sgigjprocessoautoexclusao");


const functionsDatabase = require('../functionsDatabase');
const GlbnotificacaoFunctions = require('../Http/GlbnotificacaoFunctions');

class entity {

  async index({ request, response }) {
    const lastelement = await Database
      .table("glbuser")
      .where('ID', request.userID)
      .limit(1)


    const userInfo = await functionsDatabase.userInfo(request.userID)


    if (lastelement[0].FLAG_NOTIFICACAO == 1) return response.status(403).json({ status: "403Error", entity: table, message: "index not allowed", code: "4054" })

    else {

      var result = await Model.query().where("ESTADO", 1).where((query) => {
        query.orWhere({
          ENTIDADE_ID: userInfo.ENTIDADE_ID,
        })
          .orWhere({
            PERFIL_ID: userInfo.PERFIL_ID,
          })
          .orWhere({
            USER_ID: request.userID,
          })
      })
        .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
        .with('sgigjpessoa.sgigjrelpessoaentidade.glbuser')
        .with('sgigjrelnotificacaovizualizado', (builder) => { builder.where('USER_ID', request.userID) })
        .orderBy('DT_REGISTO', 'desc')
        .fetch()

      let lido = await Model.query().where("ESTADO", 1).where((query) => {
        query.orWhere({
          ENTIDADE_ID: userInfo.ENTIDADE_ID,
        })
          .orWhere({
            PERFIL_ID: userInfo.PERFIL_ID,
          })
          .orWhere({
            USER_ID: request.userID,
          })
      })
        .where("LIDO", 0)
        .with('sgigjpessoa.sgigjrelpessoaentidade.glbuser')
        .with('sgigjrelnotificacaovizualizado', (builder) => { builder.where('USER_ID', request.userID) })
        .orderBy('DT_REGISTO', 'desc')
        .fetch()

      if (result.rows.length > 0) {
        for (let index = 0; index < result.rows.length; index++) {
          let element = result.rows[index];
          let autoexclusao = await ModelAutoExclusao.query().where("PESSOA_ID", element.PESSOA_ID).first()
          element["autoexclusao"] = autoexclusao

        }

      }
      return {
        "data": result,
        "countNew": lido.rows.length
      }
    }
  }

  async lido({ request, response }) {
    const userInfo = await functionsDatabase.userInfo(request.userID)
    await Database.table(table).where("ESTADO", 1).where((query) => {
      query.orWhere({
        ENTIDADE_ID: userInfo.ENTIDADE_ID,
      })
        .orWhere({
          PERFIL_ID: userInfo.PERFIL_ID,
        })
        .orWhere({
          USER_ID: request.userID,
        })
    }).update("LIDO", 1)
    return {
      status: "ok",
      entity: "",
      message: "lido",
      code: "888",
    };
  }

  async destroy({ params, response, request }) {
    const newE = await Database.table(table)
      .where("ID", "" + params.id)
      .userID(request.userID)
      .update({ "ESTADO": "0", "DELETADO_POR": request.userID, "DELETADO_EM": functionsDatabase.createDateNow(table) });

    if (newE) {
      return {
        status: "ok",
        entity: table + "." + params.id,
        message: "deleted",
        code: "888",
      };
    } else
      return response
        .status(400)
        .json({ status: "fail", entity: "", message: "", code: "" });

  }

}

module.exports = entity



