'use strict'

const DatabaseDB = use("Database");
const functionsDatabase = require('../functionsDatabase');

class DespachoAutoexclusaoReferenciaController {

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      "sgigjprocessoautoexclusao",
      "Despacho",
      request.userID,
      ""
    );

    if (allowedMethod) {
      // Determine year from the autoexclusão's DT_REGISTO
      const autoexclusaoId = request.input('autoexclusaoId');
      let targetYear = new Date().getFullYear();

      if (autoexclusaoId) {
        const auto = await DatabaseDB.table("sgigjprocessoautoexclusao")
          .where("ID", autoexclusaoId)
          .select("DT_REGISTO")
          .first();
        if (auto && auto.DT_REGISTO) {
          targetYear = new Date(auto.DT_REGISTO).getFullYear();
        }
      }

      // Get max REFERENCIA for despachos whose autoexclusão was registered in targetYear
      const result = await DatabaseDB
        .table("sgigjprocessodespacho as d")
        .join("sgigjprocessoautoexclusao as a", "a.ID", "d.PROCESSO_AUTOEXCLUSAO_ID")
        .whereRaw("YEAR(a.DT_REGISTO) = ?", [targetYear])
        .orderByRaw("CAST(d.REFERENCIA AS UNSIGNED) DESC")
        .select("d.REFERENCIA")
        .first();

      const maxRef = result ? parseInt(result.REFERENCIA) || 0 : 0;
      const nextNumber = maxRef + 1;

      return { status: "ok", nextRef: nextNumber, year: targetYear };
    } else {
      return response.status(403).json({
        status: "403Error",
        entity: "despacho-autoexclusao",
        message: "not allowed",
        code: "4054",
      });
    }
  }
}

module.exports = DespachoAutoexclusaoReferenciaController;
