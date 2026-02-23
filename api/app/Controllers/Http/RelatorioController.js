'use strict'

let DatabaseDB = use("Database")
const functionsDatabase = require('../functionsDatabase')

class RelatorioController {

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed('impostos', 'index', request.userID, '')

    if (!allowedMethod && false) {
      return response.status(403).json({ status: '403Error', entity: 'relatorios', message: 'not allowed', code: '4054' })
    }

    try {
      const entidadeId = request.input('entidade_id')
      const ano = request.input('ano')
      const mes = request.input('mes')
      const anoInt = ano ? parseInt(ano) : null
      const mesStr = mes || null

      // ── Entidades (para dropdown de filtro) ──
      const [entidades] = await DatabaseDB.raw(
        `SELECT DISTINCT e.ID, e.DESIG
         FROM sgigjentidade e
         WHERE e.ESTADO = 1
         ORDER BY e.DESIG`
      )

      // ── Impostos Mensal (Obrigacoes Fiscais) ──
      let impostosMensalWhere = 'i.ESTADO = 1'
      if (entidadeId) impostosMensalWhere += ` AND i.ENTIDADE_ID = '${entidadeId}'`
      if (anoInt) impostosMensalWhere += ` AND i.ANO = ${anoInt}`
      if (mesStr) impostosMensalWhere += ` AND i.MES = '${mesStr}'`

      const [impostosMensal] = await DatabaseDB.raw(
        `SELECT i.ANO as ano, i.MES as mes,
          SUM(i.BRUTO) as bruto, SUM(i.IMPOSTO) as imposto,
          SUM(i.ORCAMENTO_ESTADO) as orcamento_estado,
          SUM(i.FUNDO_TURISMO) as fundo_turismo,
          SUM(i.FUNDO_DESPORTO) as fundo_desporto,
          SUM(i.FUNDO_CULTURA) as fundo_cultura,
          SUM(i.FUNDO_AREA_COBERTURA) as fundo_area_cobertura,
          SUM(i.FUNDO_ENSINO) as fundo_ensino,
          e.DESIG as entidade
         FROM impostos i
         INNER JOIN sgigjentidade e ON i.ENTIDADE_ID = e.ID
         WHERE ${impostosMensalWhere}
         GROUP BY i.ANO, i.MES, e.ID, e.DESIG
         ORDER BY i.ANO, CAST(i.MES AS UNSIGNED)`
      )

      // ── Impostos Anual (Resumo com variacao %) ──
      let impostosAnualWhere = 'i.ESTADO = 1'
      if (entidadeId) impostosAnualWhere += ` AND i.ENTIDADE_ID = '${entidadeId}'`

      const [impostosAnualRaw] = await DatabaseDB.raw(
        `SELECT i.ANO as ano, SUM(i.BRUTO) as bruto_total, SUM(i.IMPOSTO) as imposto_total
         FROM impostos i
         WHERE ${impostosAnualWhere}
         GROUP BY i.ANO
         ORDER BY i.ANO`
      )

      // Calcular variacao %
      const impostosAnual = impostosAnualRaw.map((row, idx) => {
        let variacao_percent = null
        if (idx > 0 && impostosAnualRaw[idx - 1].bruto_total > 0) {
          variacao_percent = ((row.bruto_total - impostosAnualRaw[idx - 1].bruto_total) / impostosAnualRaw[idx - 1].bruto_total * 100).toFixed(1)
        }
        return { ...row, variacao_percent: variacao_percent ? parseFloat(variacao_percent) : null }
      })

      // ── Contrapartidas por entidade/ano ──
      let contrapartidasWhere = 'c.ESTADO = 1'
      if (entidadeId) contrapartidasWhere += ` AND c.ENTIDADE_ID = '${entidadeId}'`
      if (anoInt) contrapartidasWhere += ` AND c.ANO = ${anoInt}`

      const [contrapartidas] = await DatabaseDB.raw(
        `SELECT c.ANO as ano, e.DESIG as entidade,
          SUM(c.BRUTO) as bruto, SUM(c.Art_48_percent) as art48, SUM(c.Art_49_percent) as art49
         FROM contrapartidas c
         INNER JOIN sgigjentidade e ON c.ENTIDADE_ID = e.ID
         WHERE ${contrapartidasWhere}
         GROUP BY c.ANO, e.ID, e.DESIG
         ORDER BY c.ANO, e.DESIG`
      )

      // ── Contribuicoes por entidade/ano ──
      let contribuicoesWhere = 'ct.ESTADO = 1'
      if (entidadeId) contribuicoesWhere += ` AND ct.ENTIDADE_ID = '${entidadeId}'`
      if (anoInt) contribuicoesWhere += ` AND ct.ANO = ${anoInt}`

      const [contribuicoes] = await DatabaseDB.raw(
        `SELECT ct.ANO as ano, e.DESIG as entidade, SUM(ct.VALOR) as valor_total
         FROM contribuicoes ct
         INNER JOIN sgigjentidade e ON ct.ENTIDADE_ID = e.ID
         WHERE ${contribuicoesWhere}
         GROUP BY ct.ANO, e.ID, e.DESIG
         ORDER BY ct.ANO, e.DESIG`
      )

      return response.json({
        entidades,
        impostosMensal,
        impostosAnual,
        contrapartidas,
        contribuicoes
      })

    } catch (err) {
      console.error('RelatorioController.index ERROR:', err.message, err.stack)
      return response.status(500).json({ status: '500Error', message: err.message })
    }
  }

}

module.exports = RelatorioController
