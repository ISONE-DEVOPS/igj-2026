export const getBudgetOptions = (data) => {
    if (!data || !data.porProjeto) return null;

    const { orcamento, despesas } = data.porProjeto;
    if (!orcamento || orcamento.length === 0) return null;

    // Merge projects
    const projetosSet = new Set();
    orcamento.forEach(o => projetosSet.add(o.projeto || 'Sem Projeto'));
    despesas.forEach(d => projetosSet.add(d.projeto || 'Sem Projeto'));
    const projetos = Array.from(projetosSet);

    const orcMap = {};
    const despMap = {};
    orcamento.forEach(o => { orcMap[o.projeto || 'Sem Projeto'] = o.orcamento_previsto; });
    despesas.forEach(d => { despMap[d.projeto || 'Sem Projeto'] = d.despesa_real; });

    return {
        options: {
            chart: {
                type: 'bar',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                    columnWidth: '55%',
                    dataLabels: { position: 'top' }
                }
            },
            colors: ['#2B7FB9', '#C5A55A'],
            dataLabels: { enabled: false },
            xaxis: {
                categories: projetos,
                labels: {
                    style: { colors: '#636E72', fontSize: '10px' },
                    rotate: -45,
                    trim: true,
                    maxHeight: 80
                }
            },
            yaxis: {
                labels: {
                    style: { colors: '#636E72', fontSize: '11px' },
                    formatter: (val) => {
                        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val;
                    }
                }
            },
            legend: { position: 'top', horizontalAlign: 'left', fontSize: '12px', markers: { radius: 3 } },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV')} CVE` }
            }
        },
        series: [
            { name: 'Orçamento Previsto', data: projetos.map(p => orcMap[p] || 0) },
            { name: 'Despesa Real', data: projetos.map(p => despMap[p] || 0) }
        ]
    };
};

export default getBudgetOptions;
