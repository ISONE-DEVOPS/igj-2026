export const getProcessTrendOptions = (data) => {
    if (!data) return null;

    const { exclusaoPorMes, autoExclusaoPorMes } = data;

    // Merge months
    const mesesSet = new Set();
    (exclusaoPorMes || []).forEach(d => mesesSet.add(d.mes));
    (autoExclusaoPorMes || []).forEach(d => mesesSet.add(d.mes));
    const meses = Array.from(mesesSet).sort();

    const exclusaoMap = {};
    const autoMap = {};
    (exclusaoPorMes || []).forEach(d => { exclusaoMap[d.mes] = d.total; });
    (autoExclusaoPorMes || []).forEach(d => { autoMap[d.mes] = d.total; });

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
                stacked: true,
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: '50%' }
            },
            colors: ['#1B4965', '#C5A55A'],
            xaxis: {
                categories: meses.map(formatMonth),
                labels: { style: { colors: '#636E72', fontSize: '11px' }, rotateAlways: false }
            },
            yaxis: {
                labels: { style: { colors: '#636E72', fontSize: '11px' } }
            },
            legend: { position: 'top', horizontalAlign: 'left', fontSize: '12px', markers: { radius: 3 } },
            grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
            tooltip: { shared: true, intersect: false }
        },
        series: [
            { name: 'Exclusão', data: meses.map(m => exclusaoMap[m] || 0) },
            { name: 'Auto-exclusão', data: meses.map(m => autoMap[m] || 0) }
        ]
    };
};

export default getProcessTrendOptions;
