export const getRevenueByEntityOptions = (data) => {
    if (!data || data.length === 0) return null;

    const categories = data.map(d => d.entidade || 'N/A');
    const values = data.map(d => d.receita_bruta);

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
                    horizontal: true,
                    borderRadius: 4,
                    barHeight: '60%',
                    distributed: false
                }
            },
            colors: ['#2B7FB9'],
            dataLabels: {
                enabled: true,
                formatter: (val) => {
                    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                    return val;
                },
                style: { fontSize: '11px', colors: ['#fff'] },
                offsetX: -5
            },
            xaxis: {
                labels: {
                    style: { colors: '#636E72', fontSize: '11px' },
                    formatter: (val) => {
                        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val;
                    }
                }
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' }, maxWidth: 150 }
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV')} CVE` }
            }
        },
        series: [{ name: 'Receita Bruta', data: values }],
        categories
    };
};

export default getRevenueByEntityOptions;
