import React, { useState, useMemo } from 'react';
import manualSections, { relatorioTecnicoSection } from './sections';
import ArquiteturaSistema from './ArquiteturaSistema';
import useAuth from '../../hooks/useAuth';
import './ajuda.scss';

// Secção especial: Arquitetura do Sistema (admin-only, renderiza componente dedicado)
const arquiteturaSection = {
    id: 'arquitetura-sistema',
    title: 'Arquitetura do Sistema',
    icon: 'fas fa-project-diagram',
    color: '#2563EB',
    adminOnly: true,
    description: 'Diagrama interativo da arquitetura técnica do SGIGJ. Clique em cada camada para explorar detalhes.',
    fullComponent: true,
    subsections: [],
};

// ── Renderizadores de conteúdo especial ──

const RenderTable = ({ data, color }) => (
    <div className="rt-table-wrapper">
        <table className="rt-table">
            <thead>
                <tr>
                    {data[0].map((header, i) => (
                        <th key={i} style={i === 0 ? { borderBottomColor: color } : {}}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.slice(1).map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td key={j} className={j === 1 ? 'rt-value' : ''}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const RenderSteps = ({ steps, color }) => (
    <div className="rt-steps">
        {steps.map((step, i) => (
            <div key={i} className="rt-step">
                <div className="rt-step-number" style={{ background: color, color: '#fff' }}>
                    {step.number}
                </div>
                <div className="rt-step-connector" style={i < steps.length - 1 ? { background: `${color}30` } : { display: 'none' }} />
                <div className="rt-step-content">
                    <div className="rt-step-label">{step.label}</div>
                    <div className="rt-step-desc">{step.desc}</div>
                </div>
            </div>
        ))}
    </div>
);

const RenderKpis = ({ kpis, charts, color }) => (
    <div className="rt-kpis-section">
        <div className="rt-kpi-label">Indicadores-Chave (KPIs)</div>
        <div className="rt-kpis-grid">
            {kpis.map((kpi, i) => (
                <div key={i} className="rt-kpi-card" style={{ borderLeftColor: kpi.color }}>
                    <div className="rt-kpi-name">{kpi.label}</div>
                    <div className="rt-kpi-format">{kpi.format}</div>
                </div>
            ))}
        </div>
        {charts && (
            <>
                <div className="rt-kpi-label" style={{ marginTop: 20 }}>Gráficos Especializados</div>
                <div className="rt-charts-grid">
                    {charts.map((chart, i) => (
                        <div key={i} className="rt-chart-item">
                            <span className="rt-chart-number">{i + 1}</span>
                            {chart}
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
);

const RenderList = ({ items, color }) => (
    <ul className="rt-list">
        {items.map((item, i) => {
            const parts = item.split(' — ');
            return (
                <li key={i} className="rt-list-item">
                    <span className="rt-list-bullet" style={{ background: color }} />
                    {parts.length > 1 ? (
                        <span><strong>{parts[0]}</strong> — {parts.slice(1).join(' — ')}</span>
                    ) : (
                        <span>{item}</span>
                    )}
                </li>
            );
        })}
    </ul>
);

const RenderGroups = ({ groups, color }) => (
    <div className="rt-groups">
        {groups.map((group, i) => (
            <div key={i} className="rt-group">
                <div className="rt-group-label" style={{ color }}>{group.label}</div>
                <div className="rt-group-items">
                    {group.items.map((item, j) => (
                        <span key={j} className="rt-group-tag">{item}</span>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const RenderDiagram = ({ content, color }) => (
    <div className="rt-diagram" style={{ borderColor: `${color}30` }}>
        <div className="rt-diagram-icon" style={{ color }}>
            <i className="fas fa-project-diagram" />
        </div>
        <div className="rt-diagram-content">{content}</div>
    </div>
);

// ── Renderizador de conteúdo de subsecção ──
const SubsectionContent = ({ sub, color }) => {
    return (
        <div className="subsection-content">
            {/* Conteúdo especial conforme o tipo */}
            {sub.contentType === 'table' && sub.tableData && (
                <RenderTable data={sub.tableData} color={color} />
            )}
            {sub.contentType === 'steps' && sub.steps && (
                <RenderSteps steps={sub.steps} color={color} />
            )}
            {sub.contentType === 'kpis' && sub.kpis && (
                <RenderKpis kpis={sub.kpis} charts={sub.charts} color={color} />
            )}
            {sub.contentType === 'list' && sub.listItems && (
                <RenderList items={sub.listItems} color={color} />
            )}
            {sub.contentType === 'groups' && sub.groups && (
                <RenderGroups groups={sub.groups} color={color} />
            )}
            {sub.contentType === 'diagram' && (
                <RenderDiagram content={sub.content} color={color} />
            )}

            {/* Texto descritivo */}
            {sub.content && sub.contentType !== 'diagram' && (
                <p className="rt-text-note">{sub.content}</p>
            )}
        </div>
    );
};

// ── Componente Principal ──

const Ajuda = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState(manualSections[0]?.id || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [openSubsections, setOpenSubsections] = useState({});

    // Verificar se é Admin (pelo DESIG do perfil)
    const isAdmin = user && user.glbperfil && user.glbperfil.DESIG &&
        user.glbperfil.DESIG.toLowerCase().includes('admin');

    // Juntar secções: manual + arquitetura + relatório técnico (se Admin)
    const allSections = useMemo(() => {
        if (isAdmin) {
            return [...manualSections, arquiteturaSection, relatorioTecnicoSection];
        }
        return manualSections;
    }, [isAdmin]);

    // Filter sections by search term
    const filteredSections = useMemo(() => {
        if (!searchTerm.trim()) return allSections;

        const term = searchTerm.toLowerCase();
        return allSections.filter(section => {
            const matchTitle = section.title.toLowerCase().includes(term);
            const matchDesc = section.description.toLowerCase().includes(term);
            const matchSub = section.subsections && section.subsections.length > 0 && section.subsections.some(
                sub => sub.title.toLowerCase().includes(term) || sub.content.toLowerCase().includes(term)
            );
            return matchTitle || matchDesc || matchSub;
        });
    }, [searchTerm, allSections]);

    // Active section data
    const currentSection = useMemo(() => {
        const found = filteredSections.find(s => s.id === activeSection);
        if (found) return found;
        return filteredSections[0] || null;
    }, [activeSection, filteredSections]);

    const toggleSubsection = (idx) => {
        setOpenSubsections(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    // When search changes, auto-select first matching section
    const handleSearch = (value) => {
        setSearchTerm(value);
        if (value.trim()) {
            const term = value.toLowerCase();
            const match = allSections.find(s =>
                s.title.toLowerCase().includes(term) ||
                s.description.toLowerCase().includes(term) ||
                (s.subsections && s.subsections.length > 0 && s.subsections.some(sub =>
                    sub.title.toLowerCase().includes(term) || sub.content.toLowerCase().includes(term)
                ))
            );
            if (match) setActiveSection(match.id);
        }
    };

    // Verificar se a secção atual é especial
    const isRelatorioSection = currentSection?.id === 'relatorio-tecnico';
    const isArquiteturaSection = currentSection?.id === 'arquitetura-sistema';

    return (
        <div className="ajuda-wrapper">
            {/* Header */}
            <div className="ajuda-header">
                <div className="ajuda-title">
                    <h4>Manual do Sistema SGIGJ</h4>
                    <p>Selecione um modulo para ver as instrucoes de utilizacao</p>
                </div>
                <div className="ajuda-search">
                    <i className="fas fa-search search-icon" />
                    <input
                        type="text"
                        placeholder="Pesquisar no manual..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="ajuda-content">
                {/* Sidebar */}
                <div className="ajuda-sidebar">
                    <div className="sidebar-title">Modulos</div>
                    {filteredSections.map(section => (
                        <div
                            key={section.id}
                            className={`sidebar-item ${currentSection?.id === section.id ? 'active' : ''} ${section.adminOnly ? 'admin-only' : ''}`}
                            onClick={() => {
                                setActiveSection(section.id);
                                setOpenSubsections({});
                            }}
                        >
                            <div
                                className="sidebar-icon"
                                style={{
                                    background: `${section.color}15`,
                                    color: section.color
                                }}
                            >
                                <i className={section.icon} />
                            </div>
                            {section.title}
                            {section.adminOnly && (
                                <span className="admin-badge">Admin</span>
                            )}
                        </div>
                    ))}

                    {filteredSections.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#636E72', fontSize: 13 }}>
                            Nenhum resultado
                        </div>
                    )}
                </div>

                {/* Panel */}
                {currentSection ? (
                    isArquiteturaSection ? (
                        /* Painel especial: Arquitetura do Sistema (componente dedicado) */
                        <div className="ajuda-panel arquitetura-panel" key={currentSection.id}>
                            <ArquiteturaSistema />
                        </div>
                    ) : (
                        /* Painel padrão com subsecções em acordeão */
                        <div className={`ajuda-panel ${isRelatorioSection ? 'relatorio-panel' : ''}`} key={currentSection.id}>
                            <div className="panel-header">
                                <div
                                    className="panel-icon"
                                    style={{
                                        background: `${currentSection.color}15`,
                                        color: currentSection.color
                                    }}
                                >
                                    <i className={currentSection.icon} />
                                </div>
                                <h5>{currentSection.title}</h5>
                                {currentSection.adminOnly && (
                                    <span className="admin-badge-panel">
                                        <i className="fas fa-lock" style={{ marginRight: 4 }} /> Acesso Restrito
                                    </span>
                                )}
                            </div>

                            <p className="panel-description">{currentSection.description}</p>

                            <div className="subsection-list">
                                {currentSection.subsections.map((sub, idx) => {
                                    const isOpen = openSubsections[idx];
                                    // Highlight matching subsections
                                    const matchesTerm = searchTerm.trim() && (
                                        sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        sub.content.toLowerCase().includes(searchTerm.toLowerCase())
                                    );

                                    return (
                                        <div
                                            key={idx}
                                            className={`subsection-item ${isOpen ? 'open' : ''}`}
                                            style={matchesTerm ? { borderColor: `${currentSection.color}50` } : {}}
                                        >
                                            <button
                                                className="subsection-header"
                                                onClick={() => toggleSubsection(idx)}
                                            >
                                                <span className="subsection-title">
                                                    <span className="subsection-number">{idx + 1}</span>
                                                    {sub.title}
                                                </span>
                                                <i className={`fas fa-chevron-down chevron ${isOpen ? 'open' : ''}`} />
                                            </button>
                                            {isOpen && (
                                                isRelatorioSection ? (
                                                    <SubsectionContent sub={sub} color={currentSection.color} />
                                                ) : (
                                                    <div className="subsection-content">
                                                        {sub.content}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="ajuda-panel">
                        <div className="ajuda-no-results">
                            <i className="fas fa-search" />
                            <p>Nenhum resultado encontrado para "{searchTerm}"</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="ajuda-footer">
                SGIGJ - Sistema Integrado de Gestao da Inspecao Geral de Jogos | v1.0
            </div>
        </div>
    );
};

export default Ajuda;
