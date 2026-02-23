export const getDocumentoMensalOptions = (data) => {
    if (!data || !data.length) return null;

    const formatMonth = (mes) => {
        const [year, month] = mes.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
    };

    return {
        options: {
            chart: {
                type: 'area',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            colors: ['#69CEC6'],
            stroke: { curve: 'smooth', width: 2 },
            fill: {
                type: 'gradient',
                gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] }
            },
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
                y: { formatter: (val) => `${val} documento(s)` }
            },
            dataLabels: { enabled: false }
        },
        series: [
            { name: 'Documentos', data: data.map(d => d.total) }
        ]
    };
};
