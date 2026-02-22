export const getReclamacaoMensalOptions = (data) => {
    if (!data || !data.length) return null;

    const formatMonth = (mes) => {
        const [year, month] = mes.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
    };

    return {
        options: {
            chart: {
                type: 'bar',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: '55%' }
            },
            colors: ['#FF8C00'],
            xaxis: {
                categories: data.map(d => formatMonth(d.mes)),
                labels: { style: { colors: '#636E72', fontSize: '11px' }, rotateAlways: false }
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' } },
                forceNiceScale: true
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${val} reclamacao(oes)` }
            },
            dataLabels: { enabled: false }
        },
        series: [
            { name: 'Reclamacoes', data: data.map(d => d.total) }
        ]
    };
};

export default getReclamacaoMensalOptions;
