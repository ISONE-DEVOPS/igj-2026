import React from 'react';

const formatCurrency = (val) => {
    if (!val && val !== 0) return '-';
    return Number(val).toLocaleString('pt-CV', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ImpostosAnuaisTable = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="table-loading">
                <i className="fas fa-spinner" />
                <p>A carregar dados...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-table" />
                <p>Sem dados de impostos anuais disponiveis</p>
            </div>
        );
    }

    const totalBruto = data.reduce((acc, r) => acc + (r.bruto_total || 0), 0);
    const totalImposto = data.reduce((acc, r) => acc + (r.imposto_total || 0), 0);

    return (
        <div className="report-table-wrapper">
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Receita Bruta</th>
                        <th>Imposto</th>
                        <th>Variacao (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.ano}>
                            <td>{row.ano}</td>
                            <td>{formatCurrency(row.bruto_total)}</td>
                            <td>{formatCurrency(row.imposto_total)}</td>
                            <td className={
                                row.variacao_percent === null ? '' :
                                row.variacao_percent >= 0 ? 'variacao-positive' : 'variacao-negative'
                            }>
                                {row.variacao_percent !== null ? `${row.variacao_percent}%` : '-'}
                            </td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td>TOTAL</td>
                        <td>{formatCurrency(totalBruto)}</td>
                        <td>{formatCurrency(totalImposto)}</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ImpostosAnuaisTable;
