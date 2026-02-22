import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';

const DashboardFilters = ({ filtrosOpcoes, filters, onFilterChange, onRefresh, loading, permissions, onExportPDF, exporting }) => {

    const showEntidadeFilter = permissions?.sections?.filtroEntidade !== false;

    const anoOptions = filtrosOpcoes?.anos
        ? [{ value: '', label: 'Todos os Anos' }, ...filtrosOpcoes.anos.map(a => ({ value: a, label: String(a) }))]
        : [{ value: '', label: 'Todos os Anos' }];

    const entidadeOptions = filtrosOpcoes?.entidades
        ? [{ value: '', label: 'Todas as Entidades' }, ...filtrosOpcoes.entidades.map(e => ({ value: e.id, label: e.nome }))]
        : [{ value: '', label: 'Todas as Entidades' }];

    const customStyles = {
        control: (base) => ({
            ...base,
            borderRadius: '8px',
            borderColor: '#e0e0e0',
            boxShadow: 'none',
            minHeight: '38px',
            '&:hover': { borderColor: '#C5A55A' }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#2B7FB9' : state.isFocused ? '#f0f7ff' : 'white',
            color: state.isSelected ? 'white' : '#2D3436',
            fontSize: '13px'
        }),
        singleValue: (base) => ({ ...base, fontSize: '13px', color: '#2D3436' }),
        placeholder: (base) => ({ ...base, fontSize: '13px' })
    };

    return (
        <div className="dashboard-filters mb-4">
            <Row className="align-items-center">
                <Col xs={12} md={showEntidadeFilter ? 3 : 5}>
                    <h4 className="dashboard-title mb-0">
                        <i className="feather icon-bar-chart-2 mr-2" style={{ color: '#C5A55A' }} />
                        Dashboard
                    </h4>
                </Col>
                <Col xs={6} md={showEntidadeFilter ? 3 : 5}>
                    <Select
                        value={anoOptions.find(o => o.value === (filters.ano || '')) || anoOptions[0]}
                        onChange={(opt) => onFilterChange({ ...filters, ano: opt.value })}
                        options={anoOptions}
                        styles={customStyles}
                        placeholder="Ano"
                        isSearchable={false}
                    />
                </Col>
                {showEntidadeFilter && (
                    <Col xs={6} md={4}>
                        <Select
                            value={entidadeOptions.find(o => o.value === (filters.entidadeId || '')) || entidadeOptions[0]}
                            onChange={(opt) => onFilterChange({ ...filters, entidadeId: opt.value })}
                            options={entidadeOptions}
                            styles={customStyles}
                            placeholder="Entidade"
                        />
                    </Col>
                )}
                <Col xs={12} md={2} className="mt-2 mt-md-0 d-flex" style={{ gap: '8px' }}>
                    <Button
                        variant="outline-secondary"
                        className="btn-refresh flex-fill"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        <i className={`feather icon-refresh-cw ${loading ? 'spin' : ''}`} />
                        {' '}Atualizar
                    </Button>
                    <Button
                        variant="outline-secondary"
                        className="btn-export-pdf"
                        onClick={onExportPDF}
                        disabled={exporting || loading}
                        title="Exportar Dashboard para PDF"
                    >
                        <i className={`feather ${exporting ? 'icon-loader spin' : 'icon-download'}`} />
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardFilters;
