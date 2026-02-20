export const getActivityHeatmapOptions = (data) => {
    if (!data || data.length === 0) return null;

    // Group by module, show top 8 modules by activity
    const moduleCount = {};
    data.forEach(d => {
        const modulo = d.modulo || 'Outro';
        moduleCount[modulo] = (moduleCount[modulo] || 0) + d.total;
    });

    const topModules = Object.entries(moduleCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name]) => name);

    // Get unique months
    const meses = [...new Set(data.map(d => d.mes))].sort();

    const formatMonth = (mes) => {
        const [year, month] = mes.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
    };

    // Build data map
    const dataMap = {};
    data.forEach(d => { dataMap[`${d.modulo}-${d.mes}`] = d.total; });

    // Build series (one per module)
    const series = topModules.map(modulo => ({
        name: modulo.replace('sgigj', '').replace('glb', ''),
        data: meses.map(mes => ({
            x: formatMonth(mes),
            y: dataMap[`${modulo}-${mes}`] || 0
        }))
    }));

    return {
        options: {
            chart: {
                type: 'heatmap',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                heatmap: {
                    radius: 4,
                    enableShades: true,
                    shadeIntensity: 0.5,
                    colorScale: {
                        ranges: [
                            { from: 0, to: 0, color: '#f1f1f1', name: 'Nenhuma' },
                            { from: 1, to: 10, color: '#4099FF', name: 'Baixa' },
                            { from: 11, to: 50, color: '#2B7FB9', name: 'Média' },
                            { from: 51, to: 200, color: '#1B4965', name: 'Alta' },
                            { from: 201, to: 10000, color: '#C5A55A', name: 'Muito Alta' }
                        ]
                    }
                }
            },
            dataLabels: { enabled: false },
            xaxis: {
                labels: { style: { colors: '#636E72', fontSize: '10px' } }
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '10px' } }
            },
            grid: { padding: { right: 10 } },
            tooltip: {
                y: { formatter: (val) => `${val} registos` }
            }
        },
        series
    };
};

export default getActivityHeatmapOptions;
