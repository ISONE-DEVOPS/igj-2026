import React from 'react';

const formatCurrency = (val) => {
    if (!val && val !== 0) return '-';
    return Number(val).toLocaleString('pt-CV', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ContrapartidasTable = ({ data, loading }) => {
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
                <p>Sem dados de contrapartidas disponiveis</p>
            </div>
        );
    }

    // Extrair anos e entidades unicas
    const anos = [...new Set(data.map(d => d.ano))].sort((a, b) => a - b);
    const entidades = [...new Set(data.map(d => d.entidade))].sort();

    // Pivotear: entidade -> { ano: valor total (art48 + art49) }
    const pivoted = {};
    entidades.forEach(ent => {
        pivoted[ent] = {};
        anos.forEach(ano => {
            const row = data.find(d => d.entidade === ent && d.ano === ano);
            pivoted[ent][ano] = row ? (row.art48 || 0) + (row.art49 || 0) : 0;
        });
    });

    // Totais por ano
    const totaisAno = {};
    anos.forEach(ano => {
        totaisAno[ano] = entidades.reduce((acc, ent) => acc + (pivoted[ent][ano] || 0), 0);
    });

    // Total geral por entidade
    const totaisEntidade = {};
    entidades.forEach(ent => {
        totaisEntidade[ent] = anos.reduce((acc, ano) => acc + (pivoted[ent][ano] || 0), 0);
    });

    const totalGeral = Object.values(totaisEntidade).reduce((acc, v) => acc + v, 0);

    return (
        <div className="report-table-wrapper">
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Entidade</th>
                        {anos.map(ano => (
                            <th key={ano}>{ano}</th>
                        ))}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {entidades.map(ent => (
                        <tr key={ent}>
                            <td>{ent}</td>
                            {anos.map(ano => (
                                <td key={ano}>{pivoted[ent][ano] ? formatCurrency(pivoted[ent][ano]) : '-'}</td>
                            ))}
                            <td style={{ fontWeight: 600 }}>{formatCurrency(totaisEntidade[ent])}</td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td>TOTAL</td>
                        {anos.map(ano => (
                            <td key={ano}>{formatCurrency(totaisAno[ano])}</td>
                        ))}
                        <td>{formatCurrency(totalGeral)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ContrapartidasTable;
