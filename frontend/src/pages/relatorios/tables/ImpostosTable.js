import React from 'react';

const formatCurrency = (val) => {
    if (!val && val !== 0) return '-';
    return Number(val).toLocaleString('pt-CV', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const MONTH_NAMES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const MONTH_NAME_TO_KEY = {
    'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Marco': '03',
    'Abril': '04', 'Maio': '05', 'Junho': '06',
    'Julho': '07', 'Agosto': '08', 'Setembro': '09',
    'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
};

const getMesKey = (mes) => MONTH_NAME_TO_KEY[mes] || String(mes).padStart(2, '0');

const ImpostosTable = ({ data, loading }) => {
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
                <p>Sem dados de impostos disponiveis</p>
            </div>
        );
    }

    // Extrair anos unicos e ordenar
    const anos = [...new Set(data.map(d => d.ano))].sort((a, b) => a - b);

    // Pivotear dados: mes -> { ano: valor }
    const mesData = {};
    for (let m = 1; m <= 12; m++) {
        const mesKey = String(m).padStart(2, '0');
        mesData[mesKey] = {};
        anos.forEach(ano => {
            const rows = data.filter(d => d.ano === ano && getMesKey(d.mes) === mesKey);
            mesData[mesKey][ano] = rows.reduce((sum, r) => sum + (r.bruto || 0), 0);
        });
    }

    // Calcular totais por ano
    const totaisAno = {};
    anos.forEach(ano => {
        totaisAno[ano] = Object.values(mesData).reduce((acc, m) => acc + (m[ano] || 0), 0);
    });

    // Calcular acumulado
    const acumulado = {};
    for (let m = 1; m <= 12; m++) {
        const mesKey = String(m).padStart(2, '0');
        acumulado[mesKey] = {};
        anos.forEach(ano => {
            let acc = 0;
            for (let pm = 1; pm <= m; pm++) {
                const pmKey = String(pm).padStart(2, '0');
                acc += mesData[pmKey][ano] || 0;
            }
            acumulado[mesKey][ano] = acc;
        });
    }

    // Calcular variacao % entre anos consecutivos
    const variacaoAnos = [];
    for (let i = 1; i < anos.length; i++) {
        variacaoAnos.push({ anoA: anos[i - 1], anoB: anos[i] });
    }

    return (
        <div className="report-table-wrapper">
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Mes</th>
                        {anos.map(ano => (
                            <th key={ano}>{ano}</th>
                        ))}
                        {variacaoAnos.map(v => (
                            <th key={`var-${v.anoA}-${v.anoB}`}>% {String(v.anoA).slice(2)}/{String(v.anoB).slice(2)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Seccao: Realizada */}
                    <tr className="section-header-row">
                        <td colSpan={anos.length + variacaoAnos.length + 1}>Receita Bruta Realizada</td>
                    </tr>
                    {MONTH_NAMES.map((nome, idx) => {
                        const mesKey = String(idx + 1).padStart(2, '0');
                        return (
                            <tr key={`real-${mesKey}`}>
                                <td>{nome}</td>
                                {anos.map(ano => (
                                    <td key={ano}>{mesData[mesKey][ano] ? formatCurrency(mesData[mesKey][ano]) : '-'}</td>
                                ))}
                                {variacaoAnos.map(v => {
                                    const valA = mesData[mesKey][v.anoA];
                                    const valB = mesData[mesKey][v.anoB];
                                    if (!valA || valA === 0) return <td key={`var-${v.anoA}-${mesKey}`}>-</td>;
                                    const pct = ((valB - valA) / valA * 100).toFixed(1);
                                    return (
                                        <td key={`var-${v.anoA}-${mesKey}`} className={parseFloat(pct) >= 0 ? 'variacao-positive' : 'variacao-negative'}>
                                            {pct}%
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}

                    {/* Total Anual */}
                    <tr className="total-row">
                        <td>TOTAL</td>
                        {anos.map(ano => (
                            <td key={ano}>{totaisAno[ano] ? formatCurrency(totaisAno[ano]) : '-'}</td>
                        ))}
                        {variacaoAnos.map(v => {
                            const valA = totaisAno[v.anoA];
                            const valB = totaisAno[v.anoB];
                            if (!valA || valA === 0) return <td key={`var-total-${v.anoA}`}>-</td>;
                            const pct = ((valB - valA) / valA * 100).toFixed(1);
                            return (
                                <td key={`var-total-${v.anoA}`} className={parseFloat(pct) >= 0 ? 'variacao-positive' : 'variacao-negative'}>
                                    {pct}%
                                </td>
                            );
                        })}
                    </tr>

                    {/* Seccao: Acumulada */}
                    <tr className="section-header-row">
                        <td colSpan={anos.length + variacaoAnos.length + 1}>Receita Bruta Acumulada</td>
                    </tr>
                    {MONTH_NAMES.map((nome, idx) => {
                        const mesKey = String(idx + 1).padStart(2, '0');
                        return (
                            <tr key={`acum-${mesKey}`}>
                                <td>{nome}</td>
                                {anos.map(ano => (
                                    <td key={ano}>{acumulado[mesKey][ano] ? formatCurrency(acumulado[mesKey][ano]) : '-'}</td>
                                ))}
                                {variacaoAnos.map(v => {
                                    const valA = acumulado[mesKey][v.anoA];
                                    const valB = acumulado[mesKey][v.anoB];
                                    if (!valA || valA === 0) return <td key={`var-acum-${v.anoA}-${mesKey}`}>-</td>;
                                    const pct = ((valB - valA) / valA * 100).toFixed(1);
                                    return (
                                        <td key={`var-acum-${v.anoA}-${mesKey}`} className={parseFloat(pct) >= 0 ? 'variacao-positive' : 'variacao-negative'}>
                                            {pct}%
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ImpostosTable;
