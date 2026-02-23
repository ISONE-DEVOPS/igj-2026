export const getInfracaoTipoOptions = (data) => {
    if (!data || !data.length) return null;

    return {
        options: {
            chart: {
                type: 'donut',
                height: 320,
                animations: { enabled: true, easing: 'easeinout', speed: 600 }
            },
            labels: data.map(d => d.tipo),
            colors: ['#E8575A', '#FF8C00', '#FFB64D', '#AB7DF6', '#4680FF', '#69CEC6', '#93BE52', '#FC6180'],
            legend: {
                position: 'bottom',
                fontSize: '12px',
                labels: { colors: '#636E72' }
            },
            tooltip: {
                y: { formatter: (val) => `${val} infracao(oes)` }
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
