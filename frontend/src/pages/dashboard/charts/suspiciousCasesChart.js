export const getSuspiciousCasesOptions = (data) => {
    if (!data || data.length === 0) return null;

    const formatMonth = (mes) => {
        const [year, month] = mes.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
    };

    const categories = data.map(d => formatMonth(d.mes));
    const mensais = data.map(d => d.total);

    // Calculate cumulative
    let cumulative = 0;
    const acumulados = data.map(d => {
        cumulative += d.total;
        return cumulative;
    });

    return {
        options: {
            chart: {
                type: 'area',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            colors: ['#F39C12', '#1B4965'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: [2.5, 2] },
            fill: {
                type: ['gradient', 'gradient'],
                gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 95, 100] }
            },
            xaxis: {
                categories,
                labels: { style: { colors: '#636E72', fontSize: '11px' } }
            },
            yaxis: [
                {
                    title: { text: 'Mensal', style: { color: '#F39C12', fontSize: '11px' } },
                    labels: { style: { colors: '#636E72', fontSize: '11px' } }
                },
                {
                    opposite: true,
                    title: { text: 'Acumulado', style: { color: '#1B4965', fontSize: '11px' } },
                    labels: { style: { colors: '#636E72', fontSize: '11px' } }
                }
            ],
            legend: { position: 'top', horizontalAlign: 'left', fontSize: '12px', markers: { radius: 3 } },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: { shared: true, intersect: false }
        },
        series: [
            { name: 'Casos Mensais', data: mensais },
            { name: 'Acumulado', data: acumulados }
        ]
    };
};

export default getSuspiciousCasesOptions;
