'use strict'

const DatabaseDB = use("Database");
const functionsDatabase = require('../functionsDatabase');

class DespachoDesicaoReferenciaController {

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed(
      "sgigjprocessoexclusao",
      "DespachoFinal",
      request.userID,
      ""
    );

    if (allowedMethod) {
      const currentYear = new Date().getFullYear();

      const count = await DatabaseDB
        .table("sgigjdespachofinal")
        .where("ESTADO", 1)
        .whereRaw("YEAR(DT_REGISTO) = ?", [currentYear])
        .count("* as total");

      const nextNumber = (count[0].total || 0) + 1;
      const referencia = `${String(nextNumber).padStart(2, '0')}/IGJ/${currentYear}`;

      return { status: "ok", message: referencia };
    } else {
      return response.status(403).json({
        status: "403Error",
        entity: "despacho-desicao",
        message: "not allowed",
        code: "4054",
      });
    }
  }
}

module.exports = DespachoDesicaoReferenciaController;
