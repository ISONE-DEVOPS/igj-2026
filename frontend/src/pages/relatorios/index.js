import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// eslint-disable-next-line import/no-unresolved
import Chart from 'react-apexcharts/dist/react-apexcharts.esm';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import KpiCard from '../../components/Widgets/KpiCard';
import ChartCard from '../../components/Widgets/ChartCard';
import { pageEnable } from '../../functions';

import ImpostosTable from './tables/ImpostosTable';
import ImpostosAnuaisTable from './tables/ImpostosAnuaisTable';
import ContrapartidasTable from './tables/ContrapartidasTable';
import ContribuicoesTable from './tables/ContribuicoesTable';

import { getImpostosMensalOptions, getImpostosAcumuladoOptions } from './charts/impostosChart';
import { getImpostosAnuaisOptions, getImpostosVariacaoOptions } from './charts/impostosAnuaisChart';
import { getContrapartidasOptions } from './charts/contrapartidasChart';
import { getContribuicoesOptions } from './charts/contribuicoesChart';

import './relatorios.scss';

const pageAcess = '/relatorios';

const formatCurrency = (val, currency = 'CVE') => {
    if (!val && val !== 0) return '-';
    return `${Number(val).toLocaleString('pt-CV', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
};

const RelatoriosSGIGJ = () => {
    const { permissoes } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [entidadeFiltro, setEntidadeFiltro] = useState('');
    const [anoFiltro, setAnoFiltro] = useState('');
    const [mesFiltro, setMesFiltro] = useState('');
    const [activeTab, setActiveTab] = useState('tabelas');
    const [exporting, setExporting] = useState(false);
    const contentRef = useRef(null);
    const kpiRef = useRef(null);

    const anos = Array.from({ length: new Date().getFullYear() - 2014 + 1 }, (_, i) => 2014 + i);
    const meses = [
        { value: '01', label: 'Janeiro' }, { value: '02', label: 'Fevereiro' },
        { value: '03', label: 'Marco' }, { value: '04', label: 'Abril' },
        { value: '05', label: 'Maio' }, { value: '06', label: 'Junho' },
        { value: '07', label: 'Julho' }, { value: '08', label: 'Agosto' },
        { value: '09', label: 'Setembro' }, { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }
    ];

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (entidadeFiltro) params.entidade_id = entidadeFiltro;
            if (anoFiltro) params.ano = anoFiltro;
            if (mesFiltro) params.mes = mesFiltro;
            const response = await api.get('/relatorios', { params });
            setData(response.data);
        } catch (error) {
            console.error('Erro ao carregar relatorios:', error);
        }
        setLoading(false);
    }, [entidadeFiltro, anoFiltro, mesFiltro]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // KPIs calculados
    const totalReceita = data?.impostosAnual?.reduce((acc, r) => acc + (r.bruto_total || 0), 0) || 0;
    const totalImposto = data?.impostosAnual?.reduce((acc, r) => acc + (r.imposto_total || 0), 0) || 0;
    const totalContrapartidas = data?.contrapartidas?.reduce((acc, r) => acc + (r.art48 || 0) + (r.art49 || 0), 0) || 0;
    const totalContribuicoes = data?.contribuicoes?.reduce((acc, r) => acc + (r.valor_total || 0), 0) || 0;

    // Charts
    const impostosMensalChart = data ? getImpostosMensalOptions(data.impostosMensal) : null;
    const impostosAcumuladoChart = data ? getImpostosAcumuladoOptions(data.impostosMensal) : null;
    const impostosAnuaisChart = data ? getImpostosAnuaisOptions(data.impostosAnual) : null;
    const impostosVariacaoChart = data ? getImpostosVariacaoOptions(data.impostosAnual) : null;
    const contrapartidasChart = data ? getContrapartidasOptions(data.contrapartidas) : null;
    const contribuicoesChart = data ? getContribuicoesOptions(data.contribuicoes) : null;

    const handleExportPDF = useCallback(async () => {
        setExporting(true);
        try {
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 12;
            const headerH = 26;
            const footerH = 12;
            const hoje = new Date().toLocaleDateString('pt-CV', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const entidadeNome = entidadeFiltro
                ? (data?.entidades || []).find(e => e.ID === entidadeFiltro)?.DESIG || ''
                : 'Todas as entidades';
            const anoNome = anoFiltro || 'Todos os anos';
            const mesNome = mesFiltro
                ? (meses.find(m => m.value === mesFiltro)?.label || '')
                : 'Todos os meses';
            const filtrosText = `${entidadeNome}  |  ${anoNome}  |  ${mesNome}`;
            const tabName = activeTab === 'tabelas' ? 'Tabelas' : 'Graficos';

            let pageNum = 0;
            const addPageHeaderFooter = () => {
                pageNum++;
                // Gold accent bar
                pdf.setFillColor(197, 165, 90);
                pdf.rect(margin, 6, pageWidth - margin * 2, 1.2, 'F');
                // Title
                pdf.setFontSize(16);
                pdf.setFont(undefined, 'bold');
                pdf.setTextColor(27, 73, 101);
                pdf.text('Relatorios SGIGJ', margin, 15);
                // Filters
                pdf.setFontSize(9);
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(99, 110, 114);
                pdf.text(filtrosText, margin, 21);
                // Date + tab
                pdf.text(`${tabName}  |  ${hoje}`, pageWidth - margin, 15, { align: 'right' });
                // Header separator
                pdf.setDrawColor(230, 230, 230);
                pdf.setLineWidth(0.3);
                pdf.line(margin, headerH - 2, pageWidth - margin, headerH - 2);
                // Footer
                pdf.setDrawColor(220, 220, 220);
                pdf.line(margin, pageHeight - footerH + 2, pageWidth - margin, pageHeight - footerH + 2);
                pdf.setFontSize(7);
                pdf.setTextColor(170, 170, 170);
                pdf.text('IGJ - Inspeccao Geral do Jogo de Cabo Verde', margin, pageHeight - 5);
                pdf.text(`Pagina ${pageNum}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
            };

            const availableWidth = pageWidth - margin * 2;
            const maxContentH = pageHeight - headerH - footerH - 2;

            addPageHeaderFooter();
            let cursorY = headerH;

            const addElement = async (element) => {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const ratio = availableWidth / canvas.width;
                const imgH = canvas.height * ratio;

                if (cursorY + imgH > pageHeight - footerH - 2 && cursorY > headerH + 2) {
                    pdf.addPage('a4', 'l');
                    addPageHeaderFooter();
                    cursorY = headerH;
                }

                if (imgH > maxContentH) {
                    const scale = maxContentH / imgH;
                    const scaledW = availableWidth * scale;
                    pdf.addImage(imgData, 'PNG', margin + (availableWidth - scaledW) / 2, cursorY, scaledW, maxContentH);
                    cursorY += maxContentH + 3;
                } else {
                    pdf.addImage(imgData, 'PNG', margin, cursorY, availableWidth, imgH);
                    cursorY += imgH + 3;
                }
            };

            // KPI cards
            if (kpiRef.current) {
                await addElement(kpiRef.current);
            }

            // Stats sections from active tab only
            if (contentRef.current) {
                const sections = contentRef.current.querySelectorAll('.tab-pane.active .stats-section');
                for (const section of sections) {
                    await addElement(section);
                }
            }

            pdf.save(`relatorios-sgigj-${hoje.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
        }
        setExporting(false);
    }, [data, entidadeFiltro, anoFiltro, mesFiltro, activeTab]);

    if (!pageEnable(pageAcess, permissoes)) {
        return (
            <div className="relatorios-page">
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
        <div className="relatorios-page">
            <div className="stats-header">
                <h4>Relatorios</h4>
                <div className="stats-actions">
                    <Form.Control
                        as="select"
                        className="filter-select"
                        size="sm"
                        value={entidadeFiltro}
                        onChange={(e) => setEntidadeFiltro(e.target.value)}
                    >
                        <option value="">Todas as entidades</option>
                        {(data?.entidades || []).map(e => (
                            <option key={e.ID} value={e.ID}>{e.DESIG}</option>
                        ))}
                    </Form.Control>
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
                    <Form.Control
                        as="select"
                        className="filter-select filter-select-mes"
                        size="sm"
                        value={mesFiltro}
                        onChange={(e) => setMesFiltro(e.target.value)}
                    >
                        <option value="">Todos os meses</option>
                        {meses.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
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

            {/* KPIs */}
            <Row ref={kpiRef} className="mb-3">
                <Col lg={3} sm={6} className="mb-3">
                    <KpiCard
                        title="Receita Bruta Total"
                        value={totalReceita}
                        icon="fas fa-coins"
                        color="#2B7FB9"
                        format="currency"
                        loading={loading}
                    />
                </Col>
                <Col lg={3} sm={6} className="mb-3">
                    <KpiCard
                        title="Total Impostos"
                        value={totalImposto}
                        icon="fas fa-file-invoice-dollar"
                        color="#E8575A"
                        format="currency"
                        loading={loading}
                    />
                </Col>
                <Col lg={3} sm={6} className="mb-3">
                    <KpiCard
                        title="Total Contrapartidas"
                        value={totalContrapartidas}
                        icon="fas fa-handshake"
                        color="#93BE52"
                        format="currency"
                        loading={loading}
                    />
                </Col>
                <Col lg={3} sm={6} className="mb-3">
                    <KpiCard
                        title="Total Contribuicoes"
                        value={totalContribuicoes}
                        icon="fas fa-donate"
                        color="#FFB64D"
                        format="currency"
                        loading={loading}
                    />
                </Col>
            </Row>

            <div ref={contentRef}>
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    id="relatorios-tabs"
                    className="mb-3 relatorios-tabs"
                >
                    {/* TAB TABELAS */}
                    <Tab eventKey="tabelas" title={<span><i className="fas fa-table" /> Tabelas</span>}>
                        <div className="stats-section">
                            <span className="section-title">Obrigacoes Fiscais - Receita Bruta (Mensal)</span>
                            <ImpostosTable data={data?.impostosMensal} loading={loading} />
                        </div>

                        <div className="stats-section">
                            <span className="section-title">Impostos Anuais</span>
                            <ImpostosAnuaisTable data={data?.impostosAnual} loading={loading} />
                        </div>

                        <div className="stats-section">
                            <span className="section-title">Contrapartidas</span>
                            <ContrapartidasTable data={data?.contrapartidas} loading={loading} />
                        </div>

                        <div className="stats-section">
                            <span className="section-title">Contribuicoes Fiscais</span>
                            <ContribuicoesTable data={data?.contribuicoes} loading={loading} />
                        </div>
                    </Tab>

                    {/* TAB GRAFICOS */}
                    <Tab eventKey="graficos" title={<span><i className="fas fa-chart-bar" /> Graficos</span>}>
                        <div className="stats-section">
                            <span className="section-title">Obrigacoes Fiscais</span>
                            <Row>
                                <Col lg={7} className="mb-3">
                                    <ChartCard title="Receita Bruta Mensal" subtitle="Comparacao por ano" loading={loading}>
                                        {impostosMensalChart ? (
                                            <Chart options={impostosMensalChart.options} series={impostosMensalChart.series} type="bar" height={350} width="100%" />
                                        ) : (
                                            <EmptyState icon="fas fa-chart-bar" />
                                        )}
                                    </ChartCard>
                                </Col>
                                <Col lg={5} className="mb-3">
                                    <ChartCard title="Receita Acumulada" subtitle="Progressao anual" loading={loading}>
                                        {impostosAcumuladoChart ? (
                                            <Chart options={impostosAcumuladoChart.options} series={impostosAcumuladoChart.series} type="line" height={350} width="100%" />
                                        ) : (
                                            <EmptyState icon="fas fa-chart-line" />
                                        )}
                                    </ChartCard>
                                </Col>
                            </Row>
                        </div>

                        <div className="stats-section">
                            <span className="section-title">Impostos Anuais</span>
                            <Row>
                                <Col lg={7} className="mb-3">
                                    <ChartCard title="Receita Bruta Anual" subtitle="Evolucao por ano" loading={loading}>
                                        {impostosAnuaisChart ? (
                                            <Chart options={impostosAnuaisChart.options} series={impostosAnuaisChart.series} type="bar" height={350} width="100%" />
                                        ) : (
                                            <EmptyState icon="fas fa-chart-bar" />
                                        )}
                                    </ChartCard>
                                </Col>
                                <Col lg={5} className="mb-3">
                                    <ChartCard title="Variacao Anual (%)" subtitle="Crescimento ano a ano" loading={loading}>
                                        {impostosVariacaoChart ? (
                                            <Chart options={impostosVariacaoChart.options} series={impostosVariacaoChart.series} type="bar" height={350} width="100%" />
                                        ) : (
                                            <EmptyState icon="fas fa-percentage" />
                                        )}
                                    </ChartCard>
                                </Col>
                            </Row>
                        </div>

                        <div className="stats-section">
                            <span className="section-title">Contrapartidas</span>
                            <Row>
                                <Col lg={12} className="mb-3">
                                    <ChartCard title="Contrapartidas por Entidade" subtitle="Evolucao anual" loading={loading}>
                                        {contrapartidasChart ? (
                                            <Chart options={contrapartidasChart.options} series={contrapartidasChart.series} type="bar" height={380} width="100%" />
                                        ) : (
                                            <EmptyState icon="fas fa-handshake" />
                                        )}
                                    </ChartCard>
                                </Col>
                            </Row>
                        </div>

                        <div className="stats-section">
                            <span className="section-title">Contribuicoes Fiscais</span>
                            <Row>
                                <Col lg={12} className="mb-3">
                                    <ChartCard title="Contribuicoes por Entidade" subtitle="Evolucao anual" loading={loading}>
                                        {contribuicoesChart ? (
                                            <Chart options={contribuicoesChart.options} series={contribuicoesChart.series} type="bar" height={380} width="100%" />
                                        ) : (
                                            <EmptyState icon="fas fa-donate" />
                                        )}
                                    </ChartCard>
                                </Col>
                            </Row>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default RelatoriosSGIGJ;
