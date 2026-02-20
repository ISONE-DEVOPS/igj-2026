export const getBudgetExecutionOptions = (data) => {
    if (!data) return null;

    const taxaExecucao = data.taxaExecucao || 0;

    const getColor = (rate) => {
        if (rate >= 80) return '#2ED8B6';
        if (rate >= 50) return '#C5A55A';
        if (rate >= 25) return '#F39C12';
        return '#E74C3C';
    };

    return {
        options: {
            chart: {
                type: 'radialBar',
                height: 320,
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: { size: '65%' },
                    track: {
                        background: '#f1f1f1',
                        strokeWidth: '100%',
                        margin: 5,
                        dropShadow: { enabled: false }
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: '14px',
                            color: '#636E72',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '32px',
                            fontWeight: 700,
                            color: '#2D3436',
                            offsetY: 5,
                            formatter: (val) => `${val}%`
                        }
                    }
                }
            },
            colors: [getColor(taxaExecucao)],
            labels: ['Execução Orçamental'],
            stroke: { lineCap: 'round' }
        },
        series: [taxaExecucao],
        totalOrcamento: data.totalOrcamento,
        totalDespesa: data.totalDespesa
    };
};

export default getBudgetExecutionOptions;
