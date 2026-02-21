'use strict'

let DatabaseDB = use("Database")
const { getDashboardRole, getDashboardSections, getUserEntidadeId } = require('./dashboardPermissions')

class DashboardController {

    /**
     * Resolve o filtro de entidade conforme o perfil do utilizador.
     * - CASINO: forca o ENTIDADE_ID do utilizador (ignora param do request)
     * - Outros: usa o param do request se enviado
     */
    async _resolveEntidadeFilter(request) {
        const role = getDashboardRole(request.perfilID)
        if (role === 'CASINO') {
            const entidadeId = await getUserEntidadeId(request.userID)
            return entidadeId
        }
        return request.input('entidade_id') || null
    }

    /**
     * GET /dashboard/config
     * Returns dashboard visibility config based on user profile
     */
    async config({ request, response }) {
        try {
            const role = getDashboardRole(request.perfilID)
            const sections = getDashboardSections(role)
            let entidadeId = null

            if (role === 'CASINO') {
                entidadeId = await getUserEntidadeId(request.userID)
            }

            return response.json({
                role,
                entidadeId,
                sections
            })
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/kpis
     * Returns key performance indicators for the dashboard
     */
    async kpis({ request, response }) {
        try {
            const role = getDashboardRole(request.perfilID)
            const sections = getDashboardSections(role)
            const ano = request.input('ano')
            const entidadeId = await this._resolveEntidadeFilter(request)

            const anoFilter = ano ? ` AND ANO = ${parseInt(ano)}` : ''
            const entidadeFilter = entidadeId ? ` AND ENTIDADE_ID = '${entidadeId}'` : ''

            const result = {}

            // Receita Bruta
            if (sections.kpiReceita) {
                const receitaBruta = await DatabaseDB.raw(
                    `SELECT COALESCE(SUM(BRUTO), 0) as total FROM impostos WHERE ESTADO = 1${anoFilter}${entidadeFilter}`
                )
                result.receitaBruta = receitaBruta[0][0].total

                const sparklineReceita = await DatabaseDB.raw(
                    `SELECT ANO as ano, COALESCE(SUM(BRUTO), 0) as total FROM impostos WHERE ESTADO = 1${entidadeFilter} GROUP BY ANO ORDER BY ANO DESC LIMIT 5`
                )
                result.sparklines = result.sparklines || {}
                result.sparklines.receita = sparklineReceita[0].reverse()
            }

            // Impostos Arrecadados
            if (sections.kpiImpostos) {
                const impostos = await DatabaseDB.raw(
                    `SELECT COALESCE(SUM(IMPOSTO), 0) as total FROM impostos WHERE ESTADO = 1${anoFilter}${entidadeFilter}`
                )
                result.impostos = impostos[0][0].total
            }

            // Processos Ativos
            if (sections.kpiProcessos) {
                const processosExclusao = await DatabaseDB.raw(
                    `SELECT COUNT(*) as total FROM sgigjprocessoexclusao WHERE ESTADO = 1`
                )
                const processosAutoExclusao = await DatabaseDB.raw(
                    `SELECT COUNT(*) as total FROM sgigjprocessoautoexclusao WHERE ESTADO = 1`
                )
                result.processosAtivos = processosExclusao[0][0].total + processosAutoExclusao[0][0].total

                const sparklineProcessos = await DatabaseDB.raw(
                    `SELECT YEAR(DT_REGISTO) as ano, COUNT(*) as total FROM sgigjprocessoexclusao WHERE ESTADO = 1 GROUP BY YEAR(DT_REGISTO) ORDER BY ano DESC LIMIT 5`
                )
                result.sparklines = result.sparklines || {}
                result.sparklines.processos = sparklineProcessos[0].reverse()
            }

            // Entidades Ativas
            if (sections.kpiEntidades) {
                const entidades = await DatabaseDB.raw(
                    `SELECT COUNT(*) as total FROM sgigjentidade WHERE ESTADO = 1`
                )
                result.entidadesAtivas = entidades[0][0].total
            }

            // Eventos
            if (sections.kpiEventos) {
                const eventosFilter = entidadeId ? ` AND ENTIDADE_ID = '${entidadeId}'` : ''
                const eventos = await DatabaseDB.raw(
                    `SELECT COUNT(*) as total FROM sgigjentidadeevento WHERE ESTADO = 1${eventosFilter}`
                )
                result.eventosAprovados = eventos[0][0].total
            }

            // Casos Suspeitos
            if (sections.kpiCasosSuspeitos) {
                const casosSuspeitos = await DatabaseDB.raw(
                    `SELECT COUNT(*) as total FROM casosuspeito WHERE ESTADO = 1`
                )
                result.casosSuspeitos = casosSuspeitos[0][0].total
            }

            // Execucao Orcamental
            if (sections.kpiOrcamento) {
                const orcamentoTotal = await DatabaseDB.raw(
                    `SELECT COALESCE(SUM(ORCAMENTO_INICIAL), 0) as total FROM orcamentos WHERE ESTADO = 1`
                )
                const despesaTotal = await DatabaseDB.raw(
                    `SELECT COALESCE(SUM(VALOR), 0) as total FROM orcalmentodespesa WHERE ESTADO = 1`
                )
                const orcVal = orcamentoTotal[0][0].total || 0
                const despVal = despesaTotal[0][0].total || 0
                result.execucaoOrcamental = orcVal > 0 ? Math.round((despVal / orcVal) * 100 * 10) / 10 : 0
            }

            return response.json(result)
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/financeiro
     * Returns financial evolution data by year
     */
    async financeiro({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.visaoFinanceira) {
                return response.json({ restricted: true })
            }

            const entidadeId = await this._resolveEntidadeFilter(request)
            const entidadeFilter = entidadeId ? ` AND ENTIDADE_ID = '${entidadeId}'` : ''

            const receita = await DatabaseDB.raw(
                `SELECT ANO as ano, COALESCE(SUM(BRUTO), 0) as receita_bruta, COALESCE(SUM(IMPOSTO), 0) as impostos
                 FROM impostos WHERE ESTADO = 1${entidadeFilter} GROUP BY ANO ORDER BY ANO`
            )

            const contrapartidas = await DatabaseDB.raw(
                `SELECT ANO as ano, COALESCE(SUM(Art_48_percent + Art_49_percent), 0) as contrapartidas
                 FROM contrapartidas WHERE ESTADO = 1${entidadeFilter} GROUP BY ANO ORDER BY ANO`
            )

            const contribuicoes = await DatabaseDB.raw(
                `SELECT ANO as ano, COALESCE(SUM(VALOR), 0) as contribuicoes
                 FROM contribuicoes WHERE ESTADO = 1${entidadeFilter} GROUP BY ANO ORDER BY ANO`
            )

            const premios = await DatabaseDB.raw(
                `SELECT ANO as ano, COALESCE(SUM(VALOR), 0) as premios
                 FROM premios WHERE ESTADO = 1 AND PREMIOS_ID IS NULL${entidadeFilter} GROUP BY ANO ORDER BY ANO`
            )

            const anosSet = new Set()
            const receitaMap = {}
            const contraMap = {}
            const contribMap = {}
            const premiosMap = {}

            receita[0].forEach(r => { anosSet.add(r.ano); receitaMap[r.ano] = r })
            contrapartidas[0].forEach(r => { anosSet.add(r.ano); contraMap[r.ano] = r })
            contribuicoes[0].forEach(r => { anosSet.add(r.ano); contribMap[r.ano] = r })
            premios[0].forEach(r => { anosSet.add(r.ano); premiosMap[r.ano] = r })

            const anos = Array.from(anosSet).sort()
            const result = anos.map(ano => ({
                ano,
                receita_bruta: receitaMap[ano]?.receita_bruta || 0,
                impostos: receitaMap[ano]?.impostos || 0,
                contrapartidas: contraMap[ano]?.contrapartidas || 0,
                contribuicoes: contribMap[ano]?.contribuicoes || 0,
                premios: premiosMap[ano]?.premios || 0
            }))

            return response.json(result)
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/receita-entidade
     * Returns gross revenue per entity
     */
    async receitaEntidade({ request, response }) {
        try {
            const role = getDashboardRole(request.perfilID)
            const sections = getDashboardSections(role)
            if (!sections.entidadesReceita) {
                return response.json({ restricted: true })
            }

            const ano = request.input('ano')
            const entidadeId = await this._resolveEntidadeFilter(request)
            const anoFilter = ano ? ` AND i.ANO = ${parseInt(ano)}` : ''
            const entidadeFilter = entidadeId ? ` AND i.ENTIDADE_ID = '${entidadeId}'` : ''

            const result = await DatabaseDB.raw(
                `SELECT e.DESIG as entidade, COALESCE(SUM(i.BRUTO), 0) as receita_bruta, COALESCE(SUM(i.IMPOSTO), 0) as impostos
                 FROM impostos i
                 INNER JOIN sgigjentidade e ON i.ENTIDADE_ID = e.ID
                 WHERE i.ESTADO = 1${anoFilter}${entidadeFilter}
                 GROUP BY e.ID, e.DESIG
                 ORDER BY receita_bruta DESC
                 LIMIT 15`
            )

            return response.json(result[0])
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/processos
     * Returns process data grouped by status and month
     */
    async processos({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.processosExclusoes) {
                return response.json({ restricted: true })
            }

            const exclusaoStatus = await DatabaseDB.raw(
                `SELECT
                    SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) as ativos,
                    SUM(CASE WHEN ESTADO = 2 THEN 1 ELSE 0 END) as finalizados,
                    SUM(CASE WHEN ESTADO = 3 THEN 1 ELSE 0 END) as arquivados,
                    SUM(CASE WHEN ESTADO = 4 THEN 1 ELSE 0 END) as prescritos,
                    COUNT(*) as total
                 FROM sgigjprocessoexclusao`
            )

            const autoExclusaoStatus = await DatabaseDB.raw(
                `SELECT
                    SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) as ativos,
                    SUM(CASE WHEN ESTADO = 2 THEN 1 ELSE 0 END) as finalizados,
                    COUNT(*) as total
                 FROM sgigjprocessoautoexclusao`
            )

            const exclusaoPorMes = await DatabaseDB.raw(
                `SELECT DATE_FORMAT(DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
                 FROM sgigjprocessoexclusao
                 WHERE DT_REGISTO >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                 GROUP BY DATE_FORMAT(DT_REGISTO, '%Y-%m')
                 ORDER BY mes`
            )

            const autoExclusaoPorMes = await DatabaseDB.raw(
                `SELECT DATE_FORMAT(DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
                 FROM sgigjprocessoautoexclusao
                 WHERE DT_REGISTO >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                 GROUP BY DATE_FORMAT(DT_REGISTO, '%Y-%m')
                 ORDER BY mes`
            )

            return response.json({
                exclusaoStatus: exclusaoStatus[0][0],
                autoExclusaoStatus: autoExclusaoStatus[0][0],
                exclusaoPorMes: exclusaoPorMes[0],
                autoExclusaoPorMes: autoExclusaoPorMes[0]
            })
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/eventos
     * Returns event distribution by status
     */
    async eventos({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.eventosAtividade) {
                return response.json({ restricted: true })
            }

            const entidadeId = await this._resolveEntidadeFilter(request)
            const entidadeFilter = entidadeId ? ` AND ENTIDADE_ID = '${entidadeId}'` : ''

            const statusDistribution = await DatabaseDB.raw(
                `SELECT
                    SUM(CASE WHEN ESTADO = 1 THEN 1 ELSE 0 END) as aprovados,
                    SUM(CASE WHEN ESTADO = 0 THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN ESTADO = 2 THEN 1 ELSE 0 END) as recusados,
                    COUNT(*) as total
                 FROM sgigjentidadeevento WHERE 1=1${entidadeFilter}`
            )

            const eventosPorMes = await DatabaseDB.raw(
                `SELECT DATE_FORMAT(DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
                 FROM sgigjentidadeevento
                 WHERE DT_REGISTO >= DATE_SUB(NOW(), INTERVAL 12 MONTH)${entidadeFilter}
                 GROUP BY DATE_FORMAT(DT_REGISTO, '%Y-%m')
                 ORDER BY mes`
            )

            const eventosPorTipo = await DatabaseDB.raw(
                `SELECT t.DESIG as tipo, COUNT(*) as total
                 FROM sgigjentidadeevento e
                 LEFT JOIN sgigjpreventotp t ON e.PR_EVENTO_TP_ID = t.ID
                 WHERE e.ESTADO = 1${entidadeFilter}
                 GROUP BY t.ID, t.DESIG
                 ORDER BY total DESC`
            )

            return response.json({
                status: statusDistribution[0][0],
                porMes: eventosPorMes[0],
                porTipo: eventosPorTipo[0]
            })
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/entidades
     * Returns entity equipment breakdown
     */
    async entidades({ request, response }) {
        try {
            const role = getDashboardRole(request.perfilID)
            const sections = getDashboardSections(role)
            if (!sections.entidadesReceita) {
                return response.json({ restricted: true })
            }

            const entidadeId = await this._resolveEntidadeFilter(request)
            const entidadeFilter = entidadeId ? ` AND e.ID = '${entidadeId}'` : ''

            const maquinas = await DatabaseDB.raw(
                `SELECT e.DESIG as entidade, COUNT(m.ID) as maquinas
                 FROM sgigjentidade e
                 LEFT JOIN sgigjentidademaquina m ON e.ID = m.ENTIDADE_ID AND m.ESTADO = 1
                 WHERE e.ESTADO = 1${entidadeFilter}
                 GROUP BY e.ID, e.DESIG`
            )

            const bancas = await DatabaseDB.raw(
                `SELECT e.DESIG as entidade, COUNT(b.ID) as bancas
                 FROM sgigjentidade e
                 LEFT JOIN sgigjentidadebanca b ON e.ID = b.ENTIDADE_ID AND b.ESTADO = 1
                 WHERE e.ESTADO = 1${entidadeFilter}
                 GROUP BY e.ID, e.DESIG`
            )

            const equipamentos = await DatabaseDB.raw(
                `SELECT e.DESIG as entidade, COUNT(eq.ID) as equipamentos
                 FROM sgigjentidade e
                 LEFT JOIN sgigjentidadeequipamento eq ON e.ID = eq.ENTIDADE_ID AND eq.ESTADO = 1
                 WHERE e.ESTADO = 1${entidadeFilter}
                 GROUP BY e.ID, e.DESIG`
            )

            const entidadesMap = {}
            maquinas[0].forEach(r => {
                entidadesMap[r.entidade] = { entidade: r.entidade, maquinas: r.maquinas, bancas: 0, equipamentos: 0 }
            })
            bancas[0].forEach(r => {
                if (entidadesMap[r.entidade]) entidadesMap[r.entidade].bancas = r.bancas
                else entidadesMap[r.entidade] = { entidade: r.entidade, maquinas: 0, bancas: r.bancas, equipamentos: 0 }
            })
            equipamentos[0].forEach(r => {
                if (entidadesMap[r.entidade]) entidadesMap[r.entidade].equipamentos = r.equipamentos
                else entidadesMap[r.entidade] = { entidade: r.entidade, maquinas: 0, bancas: 0, equipamentos: r.equipamentos }
            })

            return response.json(Object.values(entidadesMap))
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/atividade
     * Returns system activity heatmap data (audit trail)
     */
    async atividade({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.eventosAtividade) {
                return response.json({ restricted: true })
            }

            const result = await DatabaseDB.raw(
                `SELECT DATE_FORMAT(Created_At, '%Y-%m') as mes, Text_Modulo as modulo, COUNT(*) as total
                 FROM auditoria
                 WHERE Created_At >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                 GROUP BY DATE_FORMAT(Created_At, '%Y-%m'), Text_Modulo
                 ORDER BY mes, modulo`
            )

            return response.json(result[0])
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/handpay
     * Returns handpay data per entity
     */
    async handpay({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.handpayCasos) {
                return response.json({ restricted: true })
            }

            const ano = request.input('ano')
            const entidadeId = await this._resolveEntidadeFilter(request)
            const anoFilter = ano ? ` AND YEAR(h.DT_REGISTO) = ${parseInt(ano)}` : ''
            const entidadeFilter = entidadeId ? ` AND h.ENTIDADE_ID = '${entidadeId}'` : ''

            const result = await DatabaseDB.raw(
                `SELECT e.DESIG as entidade, COUNT(h.ID) as quantidade, COALESCE(SUM(h.VALOR), 0) as valor_total
                 FROM sgigjhandpay h
                 INNER JOIN sgigjentidade e ON h.ENTIDADE_ID = e.ID
                 WHERE h.ESTADO = 1${anoFilter}${entidadeFilter}
                 GROUP BY e.ID, e.DESIG
                 ORDER BY valor_total DESC`
            )

            return response.json(result[0])
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/casos-suspeitos
     * Returns suspicious cases monthly evolution
     */
    async casosSuspeitos({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.handpayCasos) {
                return response.json({ restricted: true })
            }

            const result = await DatabaseDB.raw(
                `SELECT DATE_FORMAT(DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
                 FROM casosuspeito
                 WHERE ESTADO = 1
                 GROUP BY DATE_FORMAT(DT_REGISTO, '%Y-%m')
                 ORDER BY mes`
            )

            return response.json(result[0])
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/orcamento
     * Returns budget vs expenses data
     */
    async orcamento({ request, response }) {
        try {
            const sections = getDashboardSections(getDashboardRole(request.perfilID))
            if (!sections.orcamento) {
                return response.json({ restricted: true })
            }

            const ano = request.input('ano')
            const anoFilter = ano ? ` AND o.ANO = ${parseInt(ano)}` : ''

            const orcamento = await DatabaseDB.raw(
                `SELECT p.NOME as projeto, COALESCE(SUM(o.ORCAMENTO_INICIAL), 0) as orcamento_previsto
                 FROM orcamentos o
                 LEFT JOIN projetos p ON o.PROJETO_ID = p.ID
                 WHERE o.ESTADO = 1${anoFilter}
                 GROUP BY p.ID, p.NOME
                 ORDER BY orcamento_previsto DESC`
            )

            const despesas = await DatabaseDB.raw(
                `SELECT p.NOME as projeto, COALESCE(SUM(d.VALOR), 0) as despesa_real
                 FROM orcalmentodespesa d
                 LEFT JOIN orcamentos o ON d.ORCALMENTO_ID = o.ID
                 LEFT JOIN projetos p ON o.PROJETO_ID = p.ID
                 WHERE d.ESTADO = 1
                 GROUP BY p.ID, p.NOME
                 ORDER BY despesa_real DESC`
            )

            const totalOrcamento = await DatabaseDB.raw(
                `SELECT COALESCE(SUM(ORCAMENTO_INICIAL), 0) as total FROM orcamentos WHERE ESTADO = 1`
            )
            const totalDespesa = await DatabaseDB.raw(
                `SELECT COALESCE(SUM(VALOR), 0) as total FROM orcalmentodespesa WHERE ESTADO = 1`
            )

            const orcTotal = totalOrcamento[0][0].total || 0
            const despTotal = totalDespesa[0][0].total || 0
            const taxaExecucao = orcTotal > 0 ? Math.round((despTotal / orcTotal) * 100 * 10) / 10 : 0

            return response.json({
                porProjeto: {
                    orcamento: orcamento[0],
                    despesas: despesas[0]
                },
                taxaExecucao,
                totalOrcamento: orcTotal,
                totalDespesa: despTotal
            })
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    /**
     * GET /dashboard/filtros
     * Returns available filter options (years, entities)
     */
    async filtros({ request, response }) {
        try {
            const role = getDashboardRole(request.perfilID)
            const sections = getDashboardSections(role)

            const anos = await DatabaseDB.raw(
                `SELECT DISTINCT ANO as ano FROM impostos WHERE ESTADO = 1 ORDER BY ANO`
            )

            let entidades = []
            if (sections.filtroEntidade) {
                const result = await DatabaseDB.raw(
                    `SELECT ID as id, DESIG as nome FROM sgigjentidade WHERE ESTADO = 1 ORDER BY DESIG`
                )
                entidades = result[0]
            }

            return response.json({
                anos: anos[0].map(r => r.ano),
                entidades
            })
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }
}

module.exports = DashboardController
