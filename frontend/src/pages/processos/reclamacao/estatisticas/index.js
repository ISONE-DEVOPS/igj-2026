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
import { getReclamacaoAnualOptions } from './charts/reclamacaoAnualChart';

import { pageEnable } from '../../../../functions';

import './estatisticas.scss';

const pageAcess = '/processos/reclamacao/estatisticas';

const ReclamacaoEstatisticas = () => {
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
            const response = await api.get('/reclamacao/estatisticas', { params });
            setData(response.data);
        } catch (error) {
            console.error('Erro ao carregar estatisticas:', error);
        }
        setLoading(false);
    }, [anoFiltro]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const mensalChart = data ? getReclamacaoMensalOptions(data.porMes) : null;
    const entidadeChart = data ? getReclamacaoEntidadeOptions(data.porEntidade) : null;
    const anualChart = data ? getReclamacaoAnualOptions(data.porAno) : null;

    const handleExportPDF = useCallback(async () => {
        if (!contentRef.current) return;
        setExporting(true);
        try {
            const container = contentRef.current;
            const canvas = await html2canvas(container, {
                scale: 1.5,
                useCORS: true,
                logging: false,
                backgroundColor: '#F5F7FA'
            });

            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;

            pdf.setFontSize(14);
            pdf.setTextColor(27, 73, 101);
            pdf.text('SGIGJ - Estatisticas SGIGJ', margin, 12);
            pdf.setFontSize(9);
            pdf.setTextColor(99, 110, 114);
            const hoje = new Date().toLocaleDateString('pt-CV', { day: '2-digit', month: '2-digit', year: 'numeric' });
            pdf.text(`Exportado em ${hoje}`, pageWidth - margin - 40, 12);

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let cursorY = 18;
            const availableHeight = pageHeight - cursorY - margin;

            if (imgHeight <= availableHeight) {
                pdf.addImage(imgData, 'PNG', margin, cursorY, imgWidth, imgHeight);
            } else {
                // Multi-page
                let srcY = 0;
                const srcWidth = canvas.width;
                const pageImgHeight = (availableHeight * srcWidth) / imgWidth;

                while (srcY < canvas.height) {
                    if (srcY > 0) {
                        pdf.addPage();
                        cursorY = margin;
                    }
                    const sliceHeight = Math.min(pageImgHeight, canvas.height - srcY);
                    const sliceCanvas = document.createElement('canvas');
                    sliceCanvas.width = srcWidth;
                    sliceCanvas.height = sliceHeight;
                    const ctx = sliceCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, srcY, srcWidth, sliceHeight, 0, 0, srcWidth, sliceHeight);

                    const sliceImg = sliceCanvas.toDataURL('image/png');
                    const sliceDisplayHeight = (sliceHeight * imgWidth) / srcWidth;
                    pdf.addImage(sliceImg, 'PNG', margin, cursorY, imgWidth, sliceDisplayHeight);

                    srcY += sliceHeight;
                }
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
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={fetchData}
                        disabled={loading}
                    >
                        <i className="fas fa-sync-alt" />
                    </Button>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleExportPDF}
                        disabled={exporting || loading}
                    >
                        <i className="fas fa-file-pdf" /> {exporting ? 'A exportar...' : 'PDF'}
                    </Button>
                </div>
            </div>

            <div ref={contentRef}>
                {/* KPIs */}
                <Row className="mb-4">
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Total Reclamacoes"
                            value={data?.total || 0}
                            icon="fas fa-exclamation-circle"
                            color="#FF8C00"
                            loading={loading}
                        />
                    </Col>
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Ano Corrente"
                            value={data?.totalAnoCorrente || 0}
                            icon="fas fa-calendar"
                            color="#2B7FB9"
                            subtitle={`${new Date().getFullYear()}`}
                            loading={loading}
                        />
                    </Col>
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Media Mensal"
                            value={data?.mediaMensal || 0}
                            icon="fas fa-chart-line"
                            color="#C5A55A"
                            loading={loading}
                        />
                    </Col>
                    <Col lg={3} sm={6} className="mb-3">
                        <KpiCard
                            title="Top Entidade"
                            value={data?.topEntidade || '-'}
                            icon="fas fa-building"
                            color="#1B4965"
                            loading={loading}
                        />
                    </Col>
                </Row>

                {/* Charts Row 1: Mensal + Anual */}
                <Row className="mb-4">
                    <Col lg={8} className="mb-3">
                        <ChartCard title="Evolucao Mensal" subtitle="Reclamacoes por mes" loading={loading}>
                            {mensalChart ? (
                                <Chart
                                    options={mensalChart.options}
                                    series={mensalChart.series}
                                    type="bar"
                                    height={320}
                                    width="100%"
                                />
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-chart-bar" />
                                    <p>Sem dados disponiveis</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={4} className="mb-3">
                        <ChartCard title="Por Ano" subtitle="Distribuicao anual" loading={loading}>
                            {anualChart ? (
                                <Chart
                                    options={anualChart.options}
                                    series={anualChart.series}
                                    type="bar"
                                    height={320}
                                    width="100%"
                                />
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-chart-bar" />
                                    <p>Sem dados disponiveis</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>

                {/* Charts Row 2: Por Entidade */}
                <Row>
                    <Col lg={12} className="mb-3">
                        <ChartCard title="Top Entidades" subtitle="Entidades com mais reclamacoes" loading={loading}>
                            {entidadeChart ? (
                                <Chart
                                    options={entidadeChart.options}
                                    series={entidadeChart.series}
                                    type="bar"
                                    height={320}
                                    width="100%"
                                />
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-building" />
                                    <p>Sem dados disponiveis</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ReclamacaoEstatisticas;
