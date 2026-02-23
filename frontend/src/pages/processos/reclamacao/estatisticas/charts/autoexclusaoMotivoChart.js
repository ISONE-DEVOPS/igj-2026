export const getAutoexclusaoMotivoOptions = (data) => {
    if (!data || !data.length) return null;

    return {
        options: {
            chart: {
                type: 'donut',
                height: 320,
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            labels: data.map(d => d.motivo),
            colors: ['#AB7DF6', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#69CEC6', '#93BE52', '#FFB64D'],
            legend: {
                position: 'bottom',
                fontSize: '12px',
                labels: { colors: '#636E72' }
            },
            tooltip: {
                y: { formatter: (val) => `${val} processo(s)` }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => `${val.toFixed(0)}%`
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '55%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#636E72'
                            }
                        }
                    }
                }
            }
        },
        series: data.map(d => d.total)
    };
};
