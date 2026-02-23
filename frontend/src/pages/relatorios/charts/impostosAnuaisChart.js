const COLORS = ['#2B7FB9', '#FF8C00', '#93BE52', '#AB7DF6', '#E8575A', '#69CEC6', '#FFB64D', '#FC6180'];

/**
 * Grafico de barras: Receita bruta anual
 */
export const getImpostosAnuaisOptions = (data) => {
    if (!data || !data.length) return null;

    return {
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: '55%', distributed: true }
            },
            colors: COLORS,
            xaxis: {
                categories: data.map(d => String(d.ano)),
                labels: { style: { colors: '#636E72', fontSize: '11px' } }
            },
            yaxis: {
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
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV', { minimumFractionDigits: 2 })} EUR` }
            },
            dataLabels: { enabled: false },
            legend: { show: false }
        },
        series: [
            { name: 'Receita Bruta', data: data.map(d => d.bruto_total || 0) }
        ]
    };
};

/**
 * Grafico de barras horizontais: Variacao % ano a ano
 */
export const getImpostosVariacaoOptions = (data) => {
    if (!data || !data.length) return null;

    // Filtrar apenas dados com variacao definida
    const filtered = data.filter(d => d.variacao_percent !== null);
    if (filtered.length === 0) return null;

    const colors = filtered.map(d => d.variacao_percent >= 0 ? '#27ae60' : '#e74c3c');

    return {
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    barHeight: '55%',
                    distributed: true,
                    colors: {
                        ranges: [
                            { from: -10000, to: 0, color: '#e74c3c' },
                            { from: 0, to: 100000, color: '#27ae60' }
                        ]
                    }
                }
            },
            colors: colors,
            xaxis: {
                labels: {
                    style: { colors: '#636E72', fontSize: '11px' },
                    formatter: (val) => `${val}%`
                }
            },
            yaxis: {
                categories: filtered.map(d => String(d.ano)),
                labels: { style: { colors: '#636E72', fontSize: '11px' } }
            },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: {
                y: { formatter: (val) => `${val}%` }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => `${val}%`,
                style: { fontSize: '11px', colors: ['#fff'] }
            },
            legend: { show: false }
        },
        series: [
            {
                name: 'Variacao',
                data: filtered.map(d => ({
                    x: String(d.ano),
                    y: d.variacao_percent
                }))
            }
        ]
    };
};
