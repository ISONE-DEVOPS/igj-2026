const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const COLORS = ['#2B7FB9', '#FF8C00', '#93BE52', '#AB7DF6', '#E8575A', '#69CEC6', '#FFB64D', '#FC6180'];

/**
 * Grafico de barras agrupadas: Receita bruta mensal comparada por ano
 */
export const getImpostosMensalOptions = (data) => {
    if (!data || !data.length) return null;

    // Agrupar por ano
    const anos = [...new Set(data.map(d => d.ano))].sort((a, b) => a - b);

    // Criar series por ano
    const series = anos.map((ano, idx) => {
        const mesValues = [];
        for (let m = 1; m <= 12; m++) {
            const mesKey = String(m).padStart(2, '0');
            const row = data.find(d => d.ano === ano && String(d.mes).padStart(2, '0') === mesKey);
            mesValues.push(row ? row.bruto : 0);
        }
        return { name: String(ano), data: mesValues };
    });

    return {
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: { borderRadius: 3, columnWidth: '70%' }
            },
            colors: COLORS.slice(0, anos.length),
            xaxis: {
                categories: MONTH_NAMES,
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
            legend: { position: 'top', fontSize: '12px' }
        },
        series
    };
};

/**
 * Grafico de linha: Receita bruta acumulada por ano
 */
export const getImpostosAcumuladoOptions = (data) => {
    if (!data || !data.length) return null;

    const anos = [...new Set(data.map(d => d.ano))].sort((a, b) => a - b);

    const series = anos.map((ano) => {
        const acumulado = [];
        let acc = 0;
        for (let m = 1; m <= 12; m++) {
            const mesKey = String(m).padStart(2, '0');
            const row = data.find(d => d.ano === ano && String(d.mes).padStart(2, '0') === mesKey);
            acc += row ? row.bruto : 0;
            acumulado.push(acc);
        }
        return { name: String(ano), data: acumulado };
    });

    return {
        options: {
            chart: {
                type: 'line',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            stroke: { curve: 'smooth', width: 2.5 },
            colors: COLORS.slice(0, anos.length),
            xaxis: {
                categories: MONTH_NAMES,
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
            legend: { position: 'top', fontSize: '12px' },
            markers: { size: 3 }
        },
        series
    };
};
