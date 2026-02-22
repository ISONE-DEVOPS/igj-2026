export const getReclamacaoAnualOptions = (data) => {
    if (!data || !data.length) return null;

    return {
        options: {
            chart: {
                type: 'bar',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: '45%' }
            },
            colors: ['#C5A55A'],
            xaxis: {
                categories: data.map(d => String(d.ano)),
                labels: { style: { colors: '#636E72', fontSize: '11px' } }
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' } },
                forceNiceScale: true
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${val} reclamacao(oes)` }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '12px', colors: ['#1B4965'] },
                offsetY: -20
            }
        },
        series: [
            { name: 'Reclamacoes', data: data.map(d => d.total) }
        ]
    };
};

export default getReclamacaoAnualOptions;
