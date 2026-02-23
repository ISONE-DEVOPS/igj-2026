import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
// eslint-disable-next-line import/no-unresolved
import Chart from 'react-apexcharts/dist/react-apexcharts.esm';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import api from '../../../../services/api';
import useAuth from '../../../../hooks/useAuth';
import KpiCard from '../../../../components/Widgets/KpiCard';
import ChartCard from '../../../../components/Widgets/ChartCard';

import { getReclamacaoMensalOptions } from './charts/reclamacaoMensalChart';
import { getReclamacaoEntidadeOptions } from './charts/reclamacaoEntidadeChart';
import { getContraordenacaoMensalOptions } from './charts/contraordenacaoMensalChart';
import { getInfracaoTipoOptions } from './charts/infracaoTipoChart';
import { getPessoaEntidadeOptions } from './charts/pessoaEntidadeChart';
import { getPessoaCategoriaOptions } from './charts/pessoaCategoriaChart';
import { getDocumentoMensalOptions } from './charts/documentoMensalChart';
import { getDocumentoTipoOptions } from './charts/documentoTipoChart';
import { getDespachoMensalOptions } from './charts/despachoMensalChart';
import { getAutoexclusaoMensalOptions } from './charts/autoexclusaoMensalChart';
import { getAutoexclusaoMotivoOptions } from './charts/autoexclusaoMotivoChart';
import { getHandpayMensalOptions } from './charts/handpayMensalChart';
import { getHandpayPessoaOptions } from './charts/handpayPessoaChart';
import { getAuditoriaModuloOptions } from './charts/auditoriaModuloChart';

import { pageEnable } from '../../../../functions';

import './estatisticas.scss';

const pageAcess = '/processos/reclamacao/estatisticas';

const EstatisticasSGIGJ = () => {
    const { permissoes } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anoFiltro, setAnoFiltro] = useState('');
    const [exporting, setExporting] = useState(false);
    const contentRef = useRef(null);

    const anos = Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (anoFiltro) params.ano = anoFiltro;
            const response = await api.get('/estatisticas', { params });
            setData(response.data);
        } catch (error) {
            console.error('Erro ao carregar estatisticas:', error);
        }
        setLoading(false);
    }, [anoFiltro]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Charts
    const reclamacoesMesChart = data ? getReclamacaoMensalOptions(data.reclamacoes?.porMes) : null;
    const reclamacoesEntChart = data ? getReclamacaoEntidadeOptions(data.reclamacoes?.porEntidade) : null;
    const contraordMesChart = data ? getContraordenacaoMensalOptions(data.contraordenacoes?.porMes) : null;
    const infracaoTipoChart = data ? getInfracaoTipoOptions(data.contraordenacoes?.porTipo) : null;
    const pessoaEntChart = data ? getPessoaEntidadeOptions(data.pessoas?.porEntidade) : null;
    const pessoaCatChart = data ? getPessoaCategoriaOptions(data.pessoas?.porCategoria) : null;
    const docMesChart = data ? getDocumentoMensalOptions(data.documentos?.porMes) : null;
    const docTipoChart = data ? getDocumentoTipoOptions(data.documentos?.porTipo) : null;
    const despachoMesChart = data ? getDespachoMensalOptions(data.despachos?.porMes) : null;
    const autoexMesChart = data ? getAutoexclusaoMensalOptions(data.autoexclusao?.porMes) : null;
    const autoexMotivoChart = data ? getAutoexclusaoMotivoOptions(data.autoexclusao?.porMotivo) : null;
    const handpayMesChart = data ? getHandpayMensalOptions(data.handpay?.porMes) : null;
    const handpayPessoaChart = data ? getHandpayPessoaOptions(data.handpay?.porPessoa) : null;
    const auditModuloChart = data ? getAuditoriaModuloOptions(data.auditoria?.porModulo) : null;

    const handleExportPDF = useCallback(async () => {
        if (!contentRef.current) return;
        setExporting(true);
        try {
            const container = contentRef.current;
            const sections = Array.from(container.children).filter(el => el.offsetHeight > 0);

            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const headerH = 18;

            pdf.setFontSize(14);
            pdf.setTextColor(27, 73, 101);
            pdf.text('Estatisticas SGIGJ', margin, 12);
            pdf.setFontSize(9);
            pdf.setTextColor(99, 110, 114);
            const hoje = new Date().toLocaleDateString('pt-CV', { day: '2-digit', month: '2-digit', year: 'numeric' });
            pdf.text(`Exportado em ${hoje}`, pageWidth - margin - 40, 12);

            let cursorY = headerH;
            const availableWidth = pageWidth - margin * 2;

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const canvas = await html2canvas(section, {
                    scale: 1.5,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#F5F7FA'
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.85);
                const ratio = availableWidth / canvas.width;
                const imgH = canvas.height * ratio;

                if (cursorY + imgH > pageHeight - margin && cursorY > headerH + 5) {
                    pdf.addPage('a4', 'l');
                    cursorY = margin;
                }

                pdf.addImage(imgData, 'JPEG', margin, cursorY, availableWidth, imgH);
                cursorY += imgH + 2;
            }

            pdf.save(`estatisticas-sgigj-${hoje.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
        }
        setExporting(false);
    }, []);

    if (!pageEnable(pageAcess, permissoes)) {
        return (
            <div className="reclamacao-stats">
                <div className="empty-state">
                    <i className="fas fa-lock" />
                    <p>Sem permissao para aceder a esta pagina.</p>
                </div>
            </div>
        );
    }

    const EmptyState = ({ icon, text }) => (
        <div className="empty-state">
            <i className={icon} />
            <p>{text || 'Sem dados disponiveis'}</p>
        </div>
    );

    return (
        <div className="reclamacao-stats">
            <div className="stats-header">
                <h4>Estatisticas SGIGJ</h4>
                <div className="stats-actions">
                    <Form.Control
                        as="select"
                        className="filter-select"
                        size="sm"
                        value={anoFiltro}
                        onChange={(e) => setAnoFiltro(e.target.value)}
                    >
                        <option value="">Todos os anos</option>
                        {anos.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </Form.Control>
                    <Button variant="outline-secondary" size="sm" onClick={fetchData} disabled={loading}>
                        <i className="fas fa-sync-alt" />
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={handleExportPDF} disabled={exporting || loading}>
                        <i className="fas fa-file-pdf" /> {exporting ? 'A exportar...' : 'PDF'}
                    </Button>
                </div>
            </div>

            <div ref={contentRef}>
                {/* KPIs */}
                <Row className="mb-3">
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Reclamacoes"
                            value={data?.kpis?.reclamacoes || 0}
                            icon="fas fa-exclamation-circle"
                            color="#FF8C00"
                            loading={loading}
                        />
                    </Col>
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Contra-ordenacoes"
                            value={data?.kpis?.contraordenacoes || 0}
                            icon="fas fa-gavel"
                            color="#E8575A"
                            loading={loading}
                        />
                    </Col>
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Pessoas Registadas"
                            value={data?.kpis?.pessoas || 0}
                            icon="fas fa-users"
                            color="#4680FF"
                            loading={loading}
                        />
                    </Col>
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Documentos"
                            value={data?.kpis?.documentos || 0}
                            icon="fas fa-file-alt"
                            color="#69CEC6"
                            loading={loading}
                        />
                    </Col>
                </Row>

                {/* SECCAO 1: Reclamacoes */}
                <div className="stats-section">
                    <span className="section-title">Reclamacoes</span>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Evolucao Mensal" subtitle="Reclamacoes por mes" loading={loading}>
                                {reclamacoesMesChart ? (
                                    <Chart options={reclamacoesMesChart.options} series={reclamacoesMesChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-chart-bar" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Top Entidades" subtitle="Com mais reclamacoes" loading={loading}>
                                {reclamacoesEntChart ? (
                                    <Chart options={reclamacoesEntChart.options} series={reclamacoesEntChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-building" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                {/* SECCAO 2: Contra-ordenacoes & Infracoes */}
                <div className="stats-section">
                    <span className="section-title">Contra-ordenacoes & Infracoes</span>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Evolucao Mensal" subtitle="Contra-ordenacoes por mes" loading={loading}>
                                {contraordMesChart ? (
                                    <Chart options={contraordMesChart.options} series={contraordMesChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-gavel" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Tipos de Infracao" subtitle="Distribuicao por tipo" loading={loading}>
                                {infracaoTipoChart ? (
                                    <Chart options={infracaoTipoChart.options} series={infracaoTipoChart.series} type="donut" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-balance-scale" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                {/* SECCAO 3: Pessoas */}
                <div className="stats-section">
                    <span className="section-title">Pessoas</span>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Pessoas por Entidade" subtitle="Top entidades" loading={loading}>
                                {pessoaEntChart ? (
                                    <Chart options={pessoaEntChart.options} series={pessoaEntChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-users" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Categorias Profissionais" subtitle="Distribuicao por categoria" loading={loading}>
                                {pessoaCatChart ? (
                                    <Chart options={pessoaCatChart.options} series={pessoaCatChart.series} type="donut" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-user-tag" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                {/* SECCAO 4: Documentos */}
                <div className="stats-section">
                    <span className="section-title">Documentos</span>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Volume Mensal" subtitle="Documentos registados por mes" loading={loading}>
                                {docMesChart ? (
                                    <Chart options={docMesChart.options} series={docMesChart.series} type="area" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-file-alt" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Tipos de Documento" subtitle="Top tipos mais frequentes" loading={loading}>
                                {docTipoChart ? (
                                    <Chart options={docTipoChart.options} series={docTipoChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-folder-open" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                {/* SECCAO 5: Auto-exclusao */}
                <div className="stats-section">
                    <span className="section-title">Auto-exclusao</span>
                    <Row className="mb-2">
                        <Col lg={4} sm={6} className="mb-3">
                            <KpiCard
                                title="Total Auto-exclusoes"
                                value={data?.autoexclusao?.total || 0}
                                icon="fas fa-user-slash"
                                color="#AB7DF6"
                                loading={loading}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Evolucao Mensal" subtitle="Auto-exclusoes por mes" loading={loading}>
                                {autoexMesChart ? (
                                    <Chart options={autoexMesChart.options} series={autoexMesChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-user-slash" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Motivos" subtitle="Distribuicao por motivo" loading={loading}>
                                {autoexMotivoChart ? (
                                    <Chart options={autoexMotivoChart.options} series={autoexMotivoChart.series} type="donut" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-question-circle" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                {/* SECCAO 6: Handpay */}
                <div className="stats-section">
                    <span className="section-title">Handpay</span>
                    <Row className="mb-2">
                        <Col lg={4} sm={6} className="mb-3">
                            <KpiCard
                                title="Total Handpays"
                                value={data?.handpay?.total || 0}
                                icon="fas fa-hand-holding-usd"
                                color="#FFB64D"
                                loading={loading}
                            />
                        </Col>
                        <Col lg={4} sm={6} className="mb-3">
                            <KpiCard
                                title="Valor Total"
                                value={data?.handpay?.valorTotal || 0}
                                icon="fas fa-coins"
                                color="#C5A55A"
                                format="currency"
                                loading={loading}
                            />
                        </Col>
                        <Col lg={4} sm={6} className="mb-3">
                            <KpiCard
                                title="Valor Medio"
                                value={data?.handpay?.total > 0 ? Math.round(data.handpay.valorTotal / data.handpay.total) : 0}
                                icon="fas fa-calculator"
                                color="#2B7FB9"
                                format="currency"
                                loading={loading}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Evolucao Mensal" subtitle="Valor de handpay por mes" loading={loading}>
                                {handpayMesChart ? (
                                    <Chart options={handpayMesChart.options} series={handpayMesChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-hand-holding-usd" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Top Pessoas" subtitle="Maiores valores de handpay" loading={loading}>
                                {handpayPessoaChart ? (
                                    <Chart options={handpayPessoaChart.options} series={handpayPessoaChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-users" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                {/* SECCAO 6: Despachos & Auditoria */}
                <div className="stats-section">
                    <span className="section-title">Despachos & Actividade</span>
                    <Row>
                        <Col lg={7} className="mb-3">
                            <ChartCard title="Despachos por Mes" subtitle="Evolucao mensal" loading={loading}>
                                {despachoMesChart ? (
                                    <Chart options={despachoMesChart.options} series={despachoMesChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-stamp" />
                                )}
                            </ChartCard>
                        </Col>
                        <Col lg={5} className="mb-3">
                            <ChartCard title="Actividade por Modulo" subtitle="Top modulos com mais registos" loading={loading}>
                                {auditModuloChart ? (
                                    <Chart options={auditModuloChart.options} series={auditModuloChart.series} type="bar" height={320} width="100%" />
                                ) : (
                                    <EmptyState icon="fas fa-database" />
                                )}
                            </ChartCard>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default EstatisticasSGIGJ;
