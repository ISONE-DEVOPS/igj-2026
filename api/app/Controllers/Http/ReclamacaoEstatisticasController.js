'use strict'

let DatabaseDB = use("Database")
const functionsDatabase = require('../functionsDatabase')

class ReclamacaoEstatisticasController {

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed('sgigjexclusaoreclamacao', 'index', request.userID, '')

    if (!allowedMethod) {
      return response.status(403).json({ status: '403Error', entity: 'sgigjexclusaoreclamacao', message: 'not allowed', code: '4054' })
    }

    try {
      const ano = request.input('ano')
      const anoFilter = ano ? ` AND YEAR(r.DATA) = ${parseInt(ano)}` : ''

      // Total de reclamacoes ativas
      const totalRes = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjexclusaoreclamacao r WHERE r.ESTADO = 1${anoFilter}`
      )
      const total = totalRes[0][0].total

      // Total no ano corrente
      const totalAnoCorrenteRes = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjexclusaoreclamacao r WHERE r.ESTADO = 1 AND YEAR(r.DATA) = YEAR(CURDATE())`
      )
      const totalAnoCorrente = totalAnoCorrenteRes[0][0].total

      // Reclamacoes por mes
      const porMesRes = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(r.DATA, '%Y-%m') as mes, COUNT(*) as total
         FROM sgigjexclusaoreclamacao r
         WHERE r.ESTADO = 1${anoFilter}
         GROUP BY DATE_FORMAT(r.DATA, '%Y-%m')
         ORDER BY mes`
      )
      const porMes = porMesRes[0]

      // Media mensal (total / numero de meses distintos)
      const mediaMensal = porMes.length > 0 ? Math.round((total / porMes.length) * 10) / 10 : 0

      // Top 10 entidades com mais reclamacoes
      const porEntidadeRes = await DatabaseDB.raw(
        `SELECT e.DESIG as entidade, COUNT(*) as total
         FROM sgigjexclusaoreclamacao r
         INNER JOIN sgigjprocessoexclusao p ON r.PROCESSO_EXCLUSAO_ID = p.ID
         INNER JOIN sgigjentidade e ON p.ENTIDADE_ID = e.ID
         WHERE r.ESTADO = 1${anoFilter}
         GROUP BY e.ID, e.DESIG
         ORDER BY total DESC
         LIMIT 10`
      )
      const porEntidade = porEntidadeRes[0]

      // Entidade com mais reclamacoes
      const topEntidade = porEntidade.length > 0 ? porEntidade[0].entidade : '-'

      // Reclamacoes por ano
      const porAnoRes = await DatabaseDB.raw(
        `SELECT YEAR(r.DATA) as ano, COUNT(*) as total
         FROM sgigjexclusaoreclamacao r
         WHERE r.ESTADO = 1
         GROUP BY YEAR(r.DATA)
         ORDER BY ano`
      )
      const porAno = porAnoRes[0]

      return response.json({
        total,
        totalAnoCorrente,
        mediaMensal,
        topEntidade,
        porMes,
        porEntidade,
        porAno
      })

    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

}

module.exports = ReclamacaoEstatisticasController
