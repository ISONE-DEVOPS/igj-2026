import React from 'react';
import { Card } from 'react-bootstrap';
// eslint-disable-next-line import/no-unresolved
import Chart from 'react-apexcharts/dist/react-apexcharts.esm';

const KpiCard = ({ title, value, icon, color, subtitle, change, sparklineData, loading, format }) => {

    const formatValue = (val) => {
        if (format === 'currency') {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M CVE`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}K CVE`;
            return `${Number(val).toLocaleString('pt-CV')} CVE`;
        }
        if (format === 'percent') return `${val}%`;
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
        return Number(val).toLocaleString('pt-CV');
    };

    const sparklineOptions = {
        chart: {
            type: 'area',
            height: 40,
            sparkline: { enabled: true },
            animations: { enabled: true, easing: 'easeinout', speed: 800 }
        },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 100] }
        },
        colors: [color || '#2B7FB9'],
        tooltip: { enabled: false }
    };

    const sparklineSeries = sparklineData ? [{
        name: title,
        data: sparklineData.map(d => d.total || d)
    }] : [];

    if (loading) {
        return (
            <Card className="kpi-card">
                <Card.Body>
                    <div className="kpi-skeleton">
                        <div className="skeleton-line skeleton-title" />
                        <div className="skeleton-line skeleton-value" />
                        <div className="skeleton-line skeleton-sparkline" />
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="kpi-card" style={{ borderLeft: `4px solid ${color || '#2B7FB9'}` }}>
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <p className="kpi-title mb-0">{title}</p>
                        <h3 className="kpi-value mb-0">{formatValue(value || 0)}</h3>
                    </div>
                    <div className="kpi-icon" style={{ color: color || '#2B7FB9' }}>
                        <i className={icon} />
                    </div>
                </div>
                {subtitle && (
                    <p className="kpi-subtitle mb-1">
                        {change !== undefined && (
                            <span className={`kpi-change ${change >= 0 ? 'positive' : 'negative'}`}>
                                <i className={`feather ${change >= 0 ? 'icon-trending-up' : 'icon-trending-down'}`} />
                                {' '}{Math.abs(change)}%
                            </span>
                        )}
                        {' '}{subtitle}
                    </p>
                )}
                {sparklineData && sparklineData.length > 1 && (
                    <div className="kpi-sparkline">
                        <Chart options={sparklineOptions} series={sparklineSeries} type="area" height={40} />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default KpiCard;
