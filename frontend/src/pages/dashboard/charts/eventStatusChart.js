export const getEventStatusOptions = (data) => {
    if (!data || !data.status) return null;

    const { aprovados, pendentes, recusados } = data.status;

    return {
        options: {
            chart: {
                type: 'pie',
                height: 320,
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            colors: ['#2ED8B6', '#C5A55A', '#F39C12'],
            labels: ['Aprovados', 'Pendentes', 'Recusados'],
            legend: {
                position: 'bottom',
                fontSize: '12px',
                markers: { radius: 3 }
            },
            dataLabels: {
                enabled: true,
                formatter: (val, opts) => {
                    const count = opts.w.globals.series[opts.seriesIndex];
                    return `${count} (${val.toFixed(0)}%)`;
                },
                style: { fontSize: '12px' }
            },
            stroke: { width: 2, colors: ['#fff'] },
            tooltip: {
                y: { formatter: (val) => `${val} eventos` }
            }
        },
        series: [aprovados || 0, pendentes || 0, recusados || 0]
    };
};

export default getEventStatusOptions;
