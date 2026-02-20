'use strict'

const Database = use('Database')

// Mapa de perfis para categorias do dashboard
const PERFIL_CATEGORIAS = {
    // ADMIN - vê tudo
    'c55fc99dc15b5f5e22abb36d3eb393db4082': 'ADMIN',    // Administrador de Sistema
    '85c24ffab0137705617aa94b250866471dc2': 'ADMIN',     // Inspetor Geral

    // INSPETOR - tudo excepto financeiro
    'f8382845e6dad3fb2d2e14aa45b14f0f85de': 'INSPETOR',  // Inspetor(a)

    // CASINO - só dados do seu casino
    '668229b0122fda948b8c887b433aa2a907cf': 'CASINO',    // Administrador de Casino
    '6bfa0a42d20f272c4b1e5388b352efcb25ba': 'CASINO',    // Concessionário
    'f97fd62bda7d24f2edff087d0fb702e36eca': 'CASINO',    // Director Casino
}

// Visibilidade por categoria
const VISIBILIDADE = {
    ADMIN: {
        kpiReceita: true,
        kpiImpostos: true,
        kpiProcessos: true,
        kpiEntidades: true,
        kpiEventos: true,
        kpiCasosSuspeitos: true,
        kpiOrcamento: true,
        visaoFinanceira: true,
        entidadesReceita: true,
        processosExclusoes: true,
        eventosAtividade: true,
        handpayCasos: true,
        orcamento: true,
        filtroEntidade: true
    },
    INSPETOR: {
        kpiReceita: false,
        kpiImpostos: false,
        kpiProcessos: true,
        kpiEntidades: true,
        kpiEventos: true,
        kpiCasosSuspeitos: true,
        kpiOrcamento: false,
        visaoFinanceira: false,
        entidadesReceita: false,
        processosExclusoes: true,
        eventosAtividade: true,
        handpayCasos: false,
        orcamento: false,
        filtroEntidade: true
    },
    CASINO: {
        kpiReceita: true,
        kpiImpostos: true,
        kpiProcessos: false,
        kpiEntidades: false,
        kpiEventos: true,
        kpiCasosSuspeitos: false,
        kpiOrcamento: false,
        visaoFinanceira: true,
        entidadesReceita: true,
        processosExclusoes: false,
        eventosAtividade: true,
        handpayCasos: true,
        orcamento: false,
        filtroEntidade: false
    },
    OUTRO: {
        kpiReceita: false,
        kpiImpostos: false,
        kpiProcessos: false,
        kpiEntidades: true,
        kpiEventos: true,
        kpiCasosSuspeitos: false,
        kpiOrcamento: false,
        visaoFinanceira: false,
        entidadesReceita: false,
        processosExclusoes: false,
        eventosAtividade: true,
        handpayCasos: false,
        orcamento: false,
        filtroEntidade: false
    }
}

function getDashboardRole(perfilID) {
    return PERFIL_CATEGORIAS[perfilID] || 'OUTRO'
}

function getDashboardSections(role) {
    return VISIBILIDADE[role] || VISIBILIDADE.OUTRO
}

async function getUserEntidadeId(userID) {
    const result = await Database
        .table('glbuser as u')
        .innerJoin('sgigjrelpessoaentidade as rpe', 'u.REL_PESSOA_ENTIDADE_ID', 'rpe.ID')
        .where('u.ID', userID)
        .select('rpe.ENTIDADE_ID')
        .limit(1)

    return result.length > 0 ? result[0].ENTIDADE_ID : null
}

module.exports = {
    getDashboardRole,
    getDashboardSections,
    getUserEntidadeId
}
