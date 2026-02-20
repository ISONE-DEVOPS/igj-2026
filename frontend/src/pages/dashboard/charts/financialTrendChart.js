const COLORS = ['#2B7FB9', '#C5A55A', '#2ED8B6', '#1B4965', '#4099FF'];

export const getFinancialTrendOptions = (data) => {
    if (!data || data.length === 0) return null;

    const categories = data.map(d => String(d.ano));

    return {
        options: {
            chart: {
                type: 'area',
                height: 320,
                toolbar: { show: true, tools: { download: true, selection: false, zoom: false, pan: false } },
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            colors: COLORS,
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2.5 },
            fill: {
                type: 'gradient',
                gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 95, 100] }
            },
            xaxis: {
                categories,
                labels: { style: { colors: '#636E72', fontSize: '12px' } },
                axisBorder: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#636E72', fontSize: '11px' },
                    formatter: (val) => {
                        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val;
                    }
                }
            },
            legend: { position: 'top', horizontalAlign: 'left', fontSize: '12px', markers: { radius: 3 } },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV')} CVE` }
            }
        },
        series: [
            { name: 'Receita Bruta', data: data.map(d => d.receita_bruta) },
            { name: 'Impostos', data: data.map(d => d.impostos) },
            { name: 'Contrapartidas', data: data.map(d => d.contrapartidas) },
            { name: 'Contribuições', data: data.map(d => d.contribuicoes) },
            { name: 'Prémios', data: data.map(d => d.premios) }
        ]
    };
};

export default getFinancialTrendOptions;
