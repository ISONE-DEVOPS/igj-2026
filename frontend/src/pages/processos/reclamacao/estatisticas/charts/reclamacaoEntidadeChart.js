export const getReclamacaoEntidadeOptions = (data) => {
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
                bar: { borderRadius: 4, horizontal: true, barHeight: '60%' }
            },
            colors: ['#1B4965'],
            xaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' } },
                forceNiceScale: true
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' }, maxWidth: 160 }
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${val} reclamacao(oes)` }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '11px', colors: ['#fff'] }
            }
        },
        series: [
            {
                name: 'Reclamacoes',
                data: data.map(d => ({
                    x: d.entidade,
                    y: d.total
                }))
            }
        ]
    };
};

export default getReclamacaoEntidadeOptions;
