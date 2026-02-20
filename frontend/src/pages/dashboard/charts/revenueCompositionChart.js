const COLORS = ['#2B7FB9', '#C5A55A', '#2ED8B6', '#1B4965', '#4099FF'];

export const getRevenueCompositionOptions = (data) => {
    if (!data || data.length === 0) return null;

    const totals = data.reduce((acc, d) => ({
        premios: acc.premios + (d.premios || 0),
        impostos: acc.impostos + (d.impostos || 0),
        contrapartidas: acc.contrapartidas + (d.contrapartidas || 0),
        contribuicoes: acc.contribuicoes + (d.contribuicoes || 0)
    }), { premios: 0, impostos: 0, contrapartidas: 0, contribuicoes: 0 });

    const labels = ['Prémios', 'Impostos', 'Contrapartidas', 'Contribuições IGJ'];
    const series = [totals.premios, totals.impostos, totals.contrapartidas, totals.contribuicoes];

    return {
        options: {
            chart: {
                type: 'donut',
                height: 320,
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            colors: COLORS,
            labels,
            legend: {
                position: 'bottom',
                fontSize: '12px',
                markers: { radius: 3 }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: true,
                            name: { show: true, fontSize: '14px', color: '#2D3436' },
                            value: {
                                show: true,
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#2D3436',
                                formatter: (val) => {
                                    const num = Number(val);
                                    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                                    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
                                    return num.toLocaleString('pt-CV');
                                }
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                fontSize: '13px',
                                color: '#636E72',
                                formatter: (w) => {
                                    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                    if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M CVE`;
                                    return `${(total / 1000).toFixed(0)}K CVE`;
                                }
                            }
                        }
                    }
                }
            },
            dataLabels: { enabled: false },
            tooltip: {
                y: { formatter: (val) => `${Number(val).toLocaleString('pt-CV')} CVE` }
            },
            stroke: { width: 2, colors: ['#fff'] }
        },
        series
    };
};

export default getRevenueCompositionOptions;
