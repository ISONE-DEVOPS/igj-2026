export const getHandpayPessoaOptions = (data) => {
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
            colors: ['#C5A55A'],
            xaxis: {
                labels: {
                    style: { colors: '#636E72', fontSize: '11px' },
                    formatter: (val) => {
                        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val;
                    }
                },
                forceNiceScale: true
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' }, maxWidth: 160 }
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV')} CVE` }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '11px', colors: ['#fff'] },
                formatter: (val) => {
                    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                    return val;
                }
            }
        },
        series: [
            {
                name: 'Valor',
                data: data.map(d => ({
                    x: d.pessoa,
                    y: d.valor
                }))
            }
        ]
    };
};
