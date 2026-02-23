export const getHandpayMensalOptions = (data) => {
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
            colors: ['#FFB64D'],
            xaxis: {
                categories: data.map(d => formatMonth(d.mes)),
                labels: { style: { colors: '#636E72', fontSize: '11px' }, rotateAlways: false }
            },
            yaxis: [
                {
                    title: { text: 'Valor (CVE)', style: { color: '#636E72', fontSize: '11px' } },
                    labels: {
                        style: { colors: '#636E72', fontSize: '11px' },
                        formatter: (val) => {
                            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                            if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                            return val;
                        }
                    },
                    forceNiceScale: true
                }
            ],
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV')} CVE` }
            },
            dataLabels: { enabled: false }
        },
        series: [
            { name: 'Valor', data: data.map(d => d.valor) }
        ]
    };
};
