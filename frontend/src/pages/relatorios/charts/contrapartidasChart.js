const COLORS = ['#2B7FB9', '#FF8C00', '#93BE52', '#AB7DF6', '#E8575A', '#69CEC6', '#FFB64D', '#FC6180'];

/**
 * Grafico de barras stacked: Contrapartidas por entidade e ano
 */
export const getContrapartidasOptions = (data) => {
    if (!data || !data.length) return null;

    const anos = [...new Set(data.map(d => d.ano))].sort((a, b) => a - b);
    const entidades = [...new Set(data.map(d => d.entidade))].sort();

    // Criar series por entidade
    const series = entidades.map((ent) => {
        const values = anos.map(ano => {
            const row = data.find(d => d.entidade === ent && d.ano === ano);
            return row ? (row.art48 || 0) + (row.art49 || 0) : 0;
        });
        return { name: ent, data: values };
    });

    return {
        options: {
            chart: {
                type: 'bar',
                height: 380,
                stacked: true,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: '55%' }
            },
            colors: COLORS.slice(0, entidades.length),
            xaxis: {
                categories: anos.map(a => String(a)),
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
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV', { minimumFractionDigits: 2 })} CVE` }
            },
            dataLabels: { enabled: false },
            legend: { position: 'top', fontSize: '12px' }
        },
        series
    };
};
