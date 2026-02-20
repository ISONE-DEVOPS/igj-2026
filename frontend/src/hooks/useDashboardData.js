import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useDashboardData = (filters = {}) => {
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
        if (filters.entidadeId) params.entidade_id = filters.entidadeId;
        return params;
    }, [filters.ano, filters.entidadeId]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const params = buildParams();

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
                api.get('/dashboard/kpis', { ...config, params }),
                api.get('/dashboard/financeiro', { ...config, params }),
                api.get('/dashboard/receita-entidade', { ...config, params }),
                api.get('/dashboard/processos', { ...config, params }),
                api.get('/dashboard/eventos', { ...config, params }),
                api.get('/dashboard/entidades', config),
                api.get('/dashboard/atividade', config),
                api.get('/dashboard/handpay', { ...config, params }),
                api.get('/dashboard/casos-suspeitos', config),
                api.get('/dashboard/orcamento', { ...config, params }),
                api.get('/dashboard/filtros', config)
            ]);

            setData({
                kpis: kpisRes.status === 'fulfilled' ? kpisRes.value.data : null,
                financeiro: financeiroRes.status === 'fulfilled' ? financeiroRes.value.data : null,
                receitaEntidade: receitaEntidadeRes.status === 'fulfilled' ? receitaEntidadeRes.value.data : null,
                processos: processosRes.status === 'fulfilled' ? processosRes.value.data : null,
                eventos: eventosRes.status === 'fulfilled' ? eventosRes.value.data : null,
                entidades: entidadesRes.status === 'fulfilled' ? entidadesRes.value.data : null,
                atividade: atividadeRes.status === 'fulfilled' ? atividadeRes.value.data : null,
                handpay: handpayRes.status === 'fulfilled' ? handpayRes.value.data : null,
                casosSuspeitos: casosSuspeitosRes.status === 'fulfilled' ? casosSuspeitosRes.value.data : null,
                orcamento: orcamentoRes.status === 'fulfilled' ? orcamentoRes.value.data : null,
                filtrosOpcoes: filtrosRes.status === 'fulfilled' ? filtrosRes.value.data : null
            });
        } catch (err) {
            setError(err.message || 'Erro ao carregar dados do dashboard');
        } finally {
            setLoading(false);
        }
    }, [buildParams]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...data, loading, error, refetch: fetchData };
};

export default useDashboardData;
