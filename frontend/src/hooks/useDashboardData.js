import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const EMPTY = Promise.resolve({ data: null });

const useDashboardData = (filters = {}, permissions = null) => {
    const [data, setData] = useState({
        kpis: null,
        financeiro: null,
        receitaEntidade: null,
        processos: null,
        eventos: null,
        entidades: null,
        atividade: null,
        handpay: null,
        casosSuspeitos: null,
        orcamento: null,
        filtrosOpcoes: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const buildParams = useCallback(() => {
        const params = {};
        if (filters.ano) params.ano = filters.ano;

        // Para utilizadores CASINO, o backend forca a entidade automaticamente
        // Para outros, usa o filtro do UI
        if (permissions && permissions.role === 'CASINO') {
            // Nao enviar entidade_id - o backend resolve automaticamente
        } else if (filters.entidadeId) {
            params.entidade_id = filters.entidadeId;
        }

        return params;
    }, [filters.ano, filters.entidadeId, permissions]);

    const fetchData = useCallback(async () => {
        if (!permissions) return;

        setLoading(true);
        setError(null);

        const config = {};
        const params = buildParams();
        const s = permissions.sections;

        // So chamar endpoints permitidos
        const needsKpis = s.kpiReceita || s.kpiImpostos || s.kpiProcessos || s.kpiEntidades || s.kpiEventos || s.kpiCasosSuspeitos || s.kpiOrcamento;

        try {
            const [
                kpisRes,
                financeiroRes,
                receitaEntidadeRes,
                processosRes,
                eventosRes,
                entidadesRes,
                atividadeRes,
                handpayRes,
                casosSuspeitosRes,
                orcamentoRes,
                filtrosRes
            ] = await Promise.allSettled([
                needsKpis ? api.get('/dashboard/kpis', { ...config, params }) : EMPTY,
                s.visaoFinanceira ? api.get('/dashboard/financeiro', { ...config, params }) : EMPTY,
                s.entidadesReceita ? api.get('/dashboard/receita-entidade', { ...config, params }) : EMPTY,
                s.processosExclusoes ? api.get('/dashboard/processos', { ...config, params }) : EMPTY,
                s.eventosAtividade ? api.get('/dashboard/eventos', { ...config, params }) : EMPTY,
                s.entidadesReceita ? api.get('/dashboard/entidades', config) : EMPTY,
                s.eventosAtividade ? api.get('/dashboard/atividade', config) : EMPTY,
                s.handpayCasos ? api.get('/dashboard/handpay', { ...config, params }) : EMPTY,
                s.handpayCasos ? api.get('/dashboard/casos-suspeitos', config) : EMPTY,
                s.orcamento ? api.get('/dashboard/orcamento', { ...config, params }) : EMPTY,
                api.get('/dashboard/filtros', config)
            ]);

            const getValue = (res) => {
                if (res.status === 'fulfilled' && res.value && res.value.data) {
                    // Ignorar respostas com { restricted: true }
                    if (res.value.data.restricted) return null;
                    return res.value.data;
                }
                return null;
            };

            setData({
                kpis: getValue(kpisRes),
                financeiro: getValue(financeiroRes),
                receitaEntidade: getValue(receitaEntidadeRes),
                processos: getValue(processosRes),
                eventos: getValue(eventosRes),
                entidades: getValue(entidadesRes),
                atividade: getValue(atividadeRes),
                handpay: getValue(handpayRes),
                casosSuspeitos: getValue(casosSuspeitosRes),
                orcamento: getValue(orcamentoRes),
                filtrosOpcoes: getValue(filtrosRes)
            });
        } catch (err) {
            setError(err.message || 'Erro ao carregar dados do dashboard');
        } finally {
            setLoading(false);
        }
    }, [buildParams, permissions]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...data, loading, error, refetch: fetchData };
};

export default useDashboardData;
