export const getProcessStatusOptions = (data) => {
    if (!data) return null;

    const { exclusaoStatus } = data;
    if (!exclusaoStatus) return null;

    const total = exclusaoStatus.total || 1;
    const ativos = Math.round(((exclusaoStatus.ativos || 0) / total) * 100);
    const finalizados = Math.round(((exclusaoStatus.finalizados || 0) / total) * 100);
    const arquivados = Math.round(((exclusaoStatus.arquivados || 0) / total) * 100);
    const prescritos = Math.round(((exclusaoStatus.prescritos || 0) / total) * 100);

    return {
        options: {
            chart: {
                type: 'radialBar',
                height: 320,
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            plotOptions: {
                radialBar: {
                    offsetY: -10,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: { size: '30%' },
                    dataLabels: {
                        name: { fontSize: '13px', color: '#636E72' },
                        value: { fontSize: '16px', fontWeight: 700, color: '#2D3436' },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => exclusaoStatus.total
                        }
                    },
                    track: { background: '#f1f1f1', strokeWidth: '100%' }
                }
            },
            colors: ['#2B7FB9', '#2ED8B6', '#C5A55A', '#F39C12'],
            labels: ['Ativos', 'Finalizados', 'Arquivados', 'Prescritos'],
            legend: {
                show: true,
                position: 'bottom',
                fontSize: '12px',
                markers: { radius: 3 },
                formatter: (seriesName, opts) => {
                    const counts = [
                        exclusaoStatus.ativos || 0,
                        exclusaoStatus.finalizados || 0,
                        exclusaoStatus.arquivados || 0,
                        exclusaoStatus.prescritos || 0
                    ];
                    return `${seriesName}: ${counts[opts.seriesIndex]}`;
                }
            }
        },
        series: [ativos, finalizados, arquivados, prescritos]
    };
};

export default getProcessStatusOptions;
