const COLORS = ['#2B7FB9', '#C5A55A', '#2ED8B6', '#1B4965', '#4099FF', '#D4A843', '#F39C12'];

export const getEquipmentTreemapOptions = (data) => {
    if (!data || data.length === 0) return null;

    const seriesData = data
        .filter(d => (d.maquinas + d.bancas + d.equipamentos) > 0)
        .map(d => ({
            x: d.entidade || 'N/A',
            y: d.maquinas + d.bancas + d.equipamentos
        }));

    return {
        options: {
            chart: {
                type: 'treemap',
                height: 320,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            colors: COLORS,
            legend: { show: false },
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: false
                }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '12px' },
                formatter: (text, op) => `${text}: ${op.value}`,
                offsetY: -2
            },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const item = data.filter(d => (d.maquinas + d.bancas + d.equipamentos) > 0)[dataPointIndex];
                        if (!item) return `${val} total`;
                        return `Máquinas: ${item.maquinas} | Bancas: ${item.bancas} | Equip.: ${item.equipamentos}`;
                    }
                }
            }
        },
        series: [{ data: seriesData }]
    };
};

export default getEquipmentTreemapOptions;
