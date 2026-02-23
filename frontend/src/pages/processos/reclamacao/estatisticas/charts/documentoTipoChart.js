export const getDocumentoTipoOptions = (data) => {
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
            colors: ['#93BE52'],
            xaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' } },
                forceNiceScale: true
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' }, maxWidth: 180 }
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${val} documento(s)` }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '11px', colors: ['#fff'] }
            }
        },
        series: [
            {
                name: 'Documentos',
                data: data.map(d => ({
                    x: d.tipo,
                    y: d.total
                }))
            }
        ]
    };
};
