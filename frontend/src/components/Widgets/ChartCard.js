import React from 'react';
import { Card } from 'react-bootstrap';

const ChartCard = ({ title, subtitle, children, loading, height }) => {

    if (loading) {
        return (
            <Card className="chart-card">
                <Card.Header className="chart-card-header">
                    <div className="skeleton-line skeleton-title" style={{ width: '60%' }} />
                </Card.Header>
                <Card.Body className="chart-card-body">
                    <div className="chart-skeleton" style={{ height: height || 300 }}>
                        <div className="skeleton-chart-placeholder" />
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="chart-card">
            <Card.Header className="chart-card-header">
                <h6 className="chart-card-title mb-0">{title}</h6>
                {subtitle && <small className="chart-card-subtitle">{subtitle}</small>}
            </Card.Header>
            <Card.Body className="chart-card-body p-2">
                {children}
            </Card.Body>
        </Card>
    );
};

export default ChartCard;
