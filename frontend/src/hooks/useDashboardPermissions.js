import { useState, useEffect } from 'react';
import api from '../services/api';

const useDashboardPermissions = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await api.get('/dashboard/config');
                setConfig(response.data);
            } catch (err) {
                // Fallback: sem permissoes especificas, mostrar tudo (admin)
                setConfig({
                    role: 'ADMIN',
                    entidadeId: null,
                    sections: {
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
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return { config, loading };
};

export default useDashboardPermissions;
