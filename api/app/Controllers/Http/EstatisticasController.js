'use strict'

let DatabaseDB = use("Database")
const functionsDatabase = require('../functionsDatabase')

class EstatisticasController {

  async index({ request, response }) {
    const allowedMethod = await functionsDatabase.allowed('sgigjexclusaoreclamacao', 'index', request.userID, '')

    if (!allowedMethod) {
      return response.status(403).json({ status: '403Error', entity: 'sgigjexclusaoreclamacao', message: 'not allowed', code: '4054' })
    }

    try {
      const ano = request.input('ano')
      const anoInt = ano ? parseInt(ano) : null

      // ── KPIs ──
      const [kpiReclamacoes] = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjexclusaoreclamacao WHERE ESTADO = 1${anoInt ? ` AND YEAR(DATA) = ${anoInt}` : ''}`
      )
      const [kpiContraordenacoes] = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjrelcontraordenacaoinfracao WHERE ESTADO = 1${anoInt ? ` AND YEAR(DT_REGISTO) = ${anoInt}` : ''}`
      )
      const [kpiPessoas] = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjpessoa WHERE ESTADO = 1${anoInt ? ` AND YEAR(DT_REGISTO) = ${anoInt}` : ''}`
      )
      const [kpiDocumentos] = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjreldocumento WHERE ESTADO = 1${anoInt ? ` AND YEAR(DT_REGISTO) = ${anoInt}` : ''}`
      )

      // ── Reclamacoes por mes ──
      const [reclamacoesMes] = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(DATA, '%Y-%m') as mes, COUNT(*) as total
         FROM sgigjexclusaoreclamacao
         WHERE ESTADO = 1${anoInt ? ` AND YEAR(DATA) = ${anoInt}` : ''}
         GROUP BY DATE_FORMAT(DATA, '%Y-%m')
         ORDER BY mes`
      )

      // ── Reclamacoes top entidades ──
      const [reclamacoesEntidade] = await DatabaseDB.raw(
        `SELECT e.DESIG as entidade, COUNT(*) as total
         FROM sgigjexclusaoreclamacao r
         INNER JOIN sgigjprocessoexclusao p ON r.PROCESSO_EXCLUSAO_ID = p.ID
         INNER JOIN sgigjentidade e ON p.ENTIDADE_ID = e.ID
         WHERE r.ESTADO = 1${anoInt ? ` AND YEAR(r.DATA) = ${anoInt}` : ''}
         GROUP BY e.ID, e.DESIG
         ORDER BY total DESC
         LIMIT 10`
      )

      // ── Contra-ordenacoes por mes ──
      const [contraordenacoesMes] = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(co.DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
         FROM sgigjrelcontraordenacaoinfracao co
         WHERE co.ESTADO = 1${anoInt ? ` AND YEAR(co.DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY DATE_FORMAT(co.DT_REGISTO, '%Y-%m')
         ORDER BY mes`
      )

      // ── Infracoes por tipo ──
      const [infracoesTipo] = await DatabaseDB.raw(
        `SELECT it.DESIG as tipo, COUNT(*) as total
         FROM sgigjrelcontraordenacaoinfracao co
         INNER JOIN sgigjinfracaocoima ic ON co.INFRACAO_COIMA_ID = ic.ID
         INNER JOIN sgigjprinfracaotp it ON ic.PR_INFRACAO_TP_ID = it.ID
         WHERE co.ESTADO = 1${anoInt ? ` AND YEAR(co.DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY it.ID, it.DESIG
         ORDER BY total DESC`
      )

      // ── Pessoas: top entidades por numero de pessoas ──
      const [pessoasEntidade] = await DatabaseDB.raw(
        `SELECT e.DESIG as entidade, COUNT(DISTINCT pe.PESSOA_ID) as total
         FROM sgigjrelpessoaentidade pe
         INNER JOIN sgigjentidade e ON pe.ENTIDADE_ID = e.ID
         WHERE pe.ESTADO = 1${anoInt ? ` AND YEAR(pe.DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY e.ID, e.DESIG
         ORDER BY total DESC
         LIMIT 10`
      )

      // ── Pessoas por categoria profissional ──
      const [pessoasCategoria] = await DatabaseDB.raw(
        `SELECT cp.DESIG as categoria, COUNT(*) as total
         FROM sgigjrelpessoaentidade pe
         INNER JOIN sgigjprcategoriaprofissional cp ON pe.PR_CATEGORIA_PROFISSIONAL_ID = cp.ID
         WHERE pe.ESTADO = 1${anoInt ? ` AND YEAR(pe.DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY cp.ID, cp.DESIG
         ORDER BY total DESC`
      )

      // ── Documentos por mes ──
      const [documentosMes] = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
         FROM sgigjreldocumento
         WHERE ESTADO = 1${anoInt ? ` AND YEAR(DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY DATE_FORMAT(DT_REGISTO, '%Y-%m')
         ORDER BY mes`
      )

      // ── Documentos por tipo ──
      const [documentosTipo] = await DatabaseDB.raw(
        `SELECT dt.DESIG as tipo, COUNT(*) as total
         FROM sgigjreldocumento d
         INNER JOIN sgigjprdocumentotp dt ON d.PR_DOCUMENTO_TP_ID = dt.ID
         WHERE d.ESTADO = 1${anoInt ? ` AND YEAR(d.DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY dt.ID, dt.DESIG
         ORDER BY total DESC
         LIMIT 10`
      )

      // ── Despachos por mes ──
      const [despachosMes] = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(DT_REGISTO, '%Y-%m') as mes, COUNT(*) as total
         FROM sgigjprocessodespacho
         WHERE ESTADO = 1${anoInt ? ` AND YEAR(DT_REGISTO) = ${anoInt}` : ''}
         GROUP BY DATE_FORMAT(DT_REGISTO, '%Y-%m')
         ORDER BY mes`
      )

      // ── Auto-exclusao: total ──
      const [kpiAutoexclusao] = await DatabaseDB.raw(
        `SELECT COUNT(*) as total FROM sgigjprocessoautoexclusao WHERE ESTADO = 1${anoInt ? ` AND YEAR(DATA) = ${anoInt}` : ''}`
      )

      // ── Auto-exclusao por mes ──
      const [autoexclusaoMes] = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(DATA, '%Y-%m') as mes, COUNT(*) as total
         FROM sgigjprocessoautoexclusao
         WHERE ESTADO = 1${anoInt ? ` AND YEAR(DATA) = ${anoInt}` : ''}
         GROUP BY DATE_FORMAT(DATA, '%Y-%m')
         ORDER BY mes`
      )

      // ── Auto-exclusao por motivo ──
      const [autoexclusaoMotivo] = await DatabaseDB.raw(
        `SELECT m.DESIG as motivo, COUNT(*) as total
         FROM sgigjprocessoautoexclusao a
         INNER JOIN sgigjprmotivoesclusaotp m ON a.PR_MOTIVO_ESCLUSAO_TP_ID = m.ID
         WHERE a.ESTADO = 1${anoInt ? ` AND YEAR(a.DATA) = ${anoInt}` : ''}
         GROUP BY m.ID, m.DESIG
         ORDER BY total DESC`
      )

      // ── Auto-exclusao por periodo ──
      const [autoexclusaoPeriodo] = await DatabaseDB.raw(
        `SELECT p.DESIG as periodo, COUNT(*) as total
         FROM sgigjprocessoautoexclusao a
         INNER JOIN sgigjprexclusaoperiodo p ON a.PR_EXCLUSAO_PERIODO_ID = p.ID
         WHERE a.ESTADO = 1${anoInt ? ` AND YEAR(a.DATA) = ${anoInt}` : ''}
         GROUP BY p.ID, p.DESIG
         ORDER BY total DESC`
      )

      // ── Handpay: KPIs ──
      const [kpiHandpay] = await DatabaseDB.raw(
        `SELECT COUNT(*) as total, COALESCE(SUM(VALOR), 0) as valorTotal
         FROM sgigjhandpay
         WHERE ESTADO = 1${anoInt ? ` AND YEAR(DATA) = ${anoInt}` : ''}`
      )

      // ── Handpay por mes (quantidade e valor) ──
      const [handpayMes] = await DatabaseDB.raw(
        `SELECT DATE_FORMAT(DATA, '%Y-%m') as mes, COUNT(*) as quantidade, SUM(VALOR) as valor
         FROM sgigjhandpay
         WHERE ESTADO = 1${anoInt ? ` AND YEAR(DATA) = ${anoInt}` : ''}
         GROUP BY DATE_FORMAT(DATA, '%Y-%m')
         ORDER BY mes`
      )

      // ── Handpay: top pessoas ──
      const [handpayPessoas] = await DatabaseDB.raw(
        `SELECT p.NOME as pessoa, COUNT(*) as quantidade, SUM(h.VALOR) as valor
         FROM sgigjhandpay h
         INNER JOIN sgigjpessoa p ON h.PESSOA_ID = p.ID
         WHERE h.ESTADO = 1${anoInt ? ` AND YEAR(h.DATA) = ${anoInt}` : ''}
         GROUP BY p.ID, p.NOME
         ORDER BY valor DESC
         LIMIT 10`
      )

      // ── Auditoria: actividade por modulo (top 10) ──
      const nickNames = {
        "bancos": "Banco", "cabimentacaos": "Cabimentação", "casosuspeito": "Caso Suspeito",
        "contrapartidaentidade": "Contrapartida Entidade", "contrapartidapagamentos": "Pagamentos Contrapartida",
        "contrapartidas": "Contrapartida", "contribuicoes": "Contribuições", "divisa": "Divisa",
        "glbgeografia": "Geografia", "glbmenu": "Menu", "glbnotificacao": "Notificação",
        "glbperfil": "Perfil", "glbperfilmenu": "Menu de Perfil", "glbpredefinicao": "Predefinição",
        "glbuser": "Utilizador", "impostos": "Impostos", "orcamentos": "Orçamentos",
        "sgigjdespachofinal": "Despacho Final", "sgigjdespachointerrompido": "Despacho Interrompido",
        "sgigjentidade": "Entidade", "sgigjentidadebanca": "Banca", "sgigjentidadeequipamento": "Equipamento",
        "sgigjentidadeevento": "Evento", "sgigjentidadegrupo": "Grupo Entidade",
        "sgigjentidademaquina": "Máquina", "sgigjexclusaoreclamacao": "Reclamação",
        "sgigjhandpay": "Handpay", "sgigjinfracaocoima": "Coima Infração",
        "sgigjpessoa": "Pessoa", "sgigjprocessoautoexclusao": "Auto-exclusão",
        "sgigjprocessodespacho": "Despacho", "sgigjprocessodespachofinal": "Despacho Final",
        "sgigjprocessoexclusao": "Processo Exclusão", "sgigjrelcontacto": "Contacto",
        "sgigjrelcontraordenacaoinfracao": "Contra-ordenação", "sgigjreldocumento": "Documento",
        "sgigjrelenteventodecisao": "Decisão Evento", "sgigjreleventodespacho": "Despacho Evento",
        "sgigjreleventoparecer": "Parecer Evento", "sgigjrelinterveniente": "Interveniente",
        "sgigjrelpessoaentidade": "Pessoa Entidade", "sgigjrelprocessoinstrucao": "Instrução Processo",
        "sgigjrelprocessoinstrutor": "Instrutor Processo", "sgigjrelreclamacaopeca": "Peça Reclamação",
        "statusSendEmail": "Envio de Email"
      }
      const [auditoriModulo] = await DatabaseDB.raw(
        `SELECT Model as modulo, COUNT(*) as total
         FROM auditoria
         WHERE Model IS NOT NULL${anoInt ? ` AND YEAR(Created_At) = ${anoInt}` : ''}
         GROUP BY Model
         ORDER BY total DESC
         LIMIT 10`
      )
      const auditoriModuloNamed = auditoriModulo.map(row => ({
        modulo: nickNames[row.modulo] || row.modulo,
        total: row.total
      }))

      return response.json({
        kpis: {
          reclamacoes: kpiReclamacoes[0].total,
          contraordenacoes: kpiContraordenacoes[0].total,
          pessoas: kpiPessoas[0].total,
          documentos: kpiDocumentos[0].total
        },
        reclamacoes: {
          porMes: reclamacoesMes,
          porEntidade: reclamacoesEntidade
        },
        contraordenacoes: {
          porMes: contraordenacoesMes,
          porTipo: infracoesTipo
        },
        pessoas: {
          porEntidade: pessoasEntidade,
          porCategoria: pessoasCategoria
        },
        documentos: {
          porMes: documentosMes,
          porTipo: documentosTipo
        },
        despachos: {
          porMes: despachosMes
        },
        autoexclusao: {
          total: kpiAutoexclusao[0].total,
          porMes: autoexclusaoMes,
          porMotivo: autoexclusaoMotivo,
          porPeriodo: autoexclusaoPeriodo
        },
        handpay: {
          total: kpiHandpay[0].total,
          valorTotal: kpiHandpay[0].valorTotal,
          porMes: handpayMes,
          porPessoa: handpayPessoas
        },
        auditoria: {
          porModulo: auditoriModuloNamed
        }
      })

    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

}

module.exports = EstatisticasController
