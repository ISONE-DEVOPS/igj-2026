export const getHandpayOptions = (data) => {
    if (!data || data.length === 0) return null;

    const categories = data.map(d => d.entidade || 'N/A');
    const valores = data.map(d => d.valor_total);
    const quantidades = data.map(d => d.quantidade);

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
            colors: ['#1B4965', '#C5A55A'],
            xaxis: {
                categories,
                labels: {
                    style: { colors: '#636E72', fontSize: '10px' },
                    rotate: -45,
                    trim: true,
                    maxHeight: 80
                }
            },
            yaxis: [
                {
                    title: { text: 'Valor (CVE)', style: { color: '#1B4965', fontSize: '11px' } },
                    labels: {
                        style: { colors: '#636E72', fontSize: '11px' },
                        formatter: (val) => {
                            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                            if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                            return val;
                        }
                    }
                },
                {
                    opposite: true,
                    title: { text: 'Quantidade', style: { color: '#C5A55A', fontSize: '11px' } },
                    labels: { style: { colors: '#636E72', fontSize: '11px' } }
                }
            ],
            legend: { position: 'top', horizontalAlign: 'left', fontSize: '12px', markers: { radius: 3 } },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val, { seriesIndex }) => {
                        if (seriesIndex === 0) return `${Number(val).toLocaleString('pt-CV')} CVE`;
                        return `${val} registos`;
                    }
                }
            },
            stroke: { width: [0, 3], curve: 'smooth' }
        },
        series: [
            { name: 'Valor Total', type: 'bar', data: valores },
            { name: 'Quantidade', type: 'line', data: quantidades }
        ]
    };
};

export default getHandpayOptions;
