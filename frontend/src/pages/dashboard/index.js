import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
// eslint-disable-next-line import/no-unresolved
import Chart from 'react-apexcharts/dist/react-apexcharts.esm';

import KpiCard from '../../components/Widgets/KpiCard';
import ChartCard from '../../components/Widgets/ChartCard';
import DashboardFilters from './DashboardFilters';
import useDashboardData from '../../hooks/useDashboardData';

import { getFinancialTrendOptions } from './charts/financialTrendChart';
import { getRevenueCompositionOptions } from './charts/revenueCompositionChart';
import { getRevenueByEntityOptions } from './charts/revenueByEntityChart';
import { getEquipmentTreemapOptions } from './charts/equipmentTreemapChart';
import { getProcessTrendOptions } from './charts/processTrendChart';
import { getProcessStatusOptions } from './charts/processStatusChart';
import { getEventStatusOptions } from './charts/eventStatusChart';
import { getActivityHeatmapOptions } from './charts/activityHeatmapChart';
import { getHandpayOptions } from './charts/handpayChart';
import { getSuspiciousCasesOptions } from './charts/suspiciousCasesChart';
import { getBudgetOptions } from './charts/budgetChart';
import { getBudgetExecutionOptions } from './charts/budgetExecutionChart';

import './dashboard.scss';

const DashAnalytics = () => {
    const [filters, setFilters] = useState({ ano: '', entidadeId: '' });
    const {
        kpis, financeiro, receitaEntidade, processos, eventos,
        entidades, atividade, handpay, casosSuspeitos, orcamento,
        filtrosOpcoes, loading, refetch
    } = useDashboardData(filters);

    // Build chart configs from data
    const financialTrend = getFinancialTrendOptions(financeiro);
    const revenueComposition = getRevenueCompositionOptions(financeiro);
    const revenueByEntity = getRevenueByEntityOptions(receitaEntidade);
    const equipmentTreemap = getEquipmentTreemapOptions(entidades);
    const processTrend = getProcessTrendOptions(processos);
    const processStatus = getProcessStatusOptions(processos);
    const eventStatus = getEventStatusOptions(eventos);
    const activityHeatmap = getActivityHeatmapOptions(atividade);
    const handpayChart = getHandpayOptions(handpay);
    const suspiciousCases = getSuspiciousCasesOptions(casosSuspeitos);
    const budgetChart = getBudgetOptions(orcamento);
    const budgetExecution = getBudgetExecutionOptions(orcamento);

    const formatCurrency = (val) => {
        if (!val) return '0 CVE';
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M CVE`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}K CVE`;
        return `${Number(val).toLocaleString('pt-CV')} CVE`;
    };

    return (
        <div className="dashboard-wrapper">
            {/* Filtros Globais */}
            <DashboardFilters
                filtrosOpcoes={filtrosOpcoes}
                filters={filters}
                onFilterChange={setFilters}
                onRefresh={refetch}
                loading={loading}
            />

            {/* KPIs */}
            <Row className="mt-3">
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Receita Bruta"
                        value={kpis?.receitaBruta}
                        icon="feather icon-dollar-sign"
                        color="#2B7FB9"
                        format="currency"
                        subtitle="Total acumulado"
                        sparklineData={kpis?.sparklines?.receita}
                        loading={loading}
                    />
                </Col>
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Impostos"
                        value={kpis?.impostos}
                        icon="feather icon-trending-up"
                        color="#C5A55A"
                        format="currency"
                        subtitle="Arrecadados"
                        loading={loading}
                    />
                </Col>
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Processos Ativos"
                        value={kpis?.processosAtivos}
                        icon="feather icon-file-text"
                        color="#1B4965"
                        subtitle="Exclusão + Auto-exclusão"
                        sparklineData={kpis?.sparklines?.processos}
                        loading={loading}
                    />
                </Col>
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Entidades"
                        value={kpis?.entidadesAtivas}
                        icon="feather icon-home"
                        color="#2ED8B6"
                        subtitle="Ativas"
                        loading={loading}
                    />
                </Col>
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Eventos"
                        value={kpis?.eventosAprovados}
                        icon="feather icon-calendar"
                        color="#4099FF"
                        subtitle="Registados"
                        loading={loading}
                    />
                </Col>
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Casos Suspeitos"
                        value={kpis?.casosSuspeitos}
                        icon="feather icon-alert-triangle"
                        color="#F39C12"
                        subtitle="Ativos"
                        loading={loading}
                    />
                </Col>
                <Col xs={6} lg={3} xl className="mb-3">
                    <KpiCard
                        title="Exec. Orçamental"
                        value={kpis?.execucaoOrcamental}
                        icon="feather icon-pie-chart"
                        color="#D4A843"
                        format="percent"
                        subtitle="Taxa de execução"
                        loading={loading}
                    />
                </Col>
            </Row>

            {/* SEÇÃO 1: Visão Financeira */}
            <div className="dashboard-section">
                <span className="section-title">Visão Financeira</span>
                <Row>
                    <Col lg={7} className="mb-3">
                        <ChartCard title="Evolução Financeira Anual" subtitle="Receita, impostos, contrapartidas e contribuições" loading={loading}>
                            {financialTrend ? (
                                <Chart options={financialTrend.options} series={financialTrend.series} type="area" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-bar-chart-2" />
                                    <p>Sem dados financeiros disponíveis</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={5} className="mb-3">
                        <ChartCard title="Composição da Receita" subtitle="Distribuição por categoria" loading={loading}>
                            {revenueComposition ? (
                                <Chart options={revenueComposition.options} series={revenueComposition.series} type="donut" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-pie-chart" />
                                    <p>Sem dados disponíveis</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>

            {/* SEÇÃO 2: Entidades & Receita */}
            <div className="dashboard-section">
                <span className="section-title">Entidades & Receita por Casino</span>
                <Row>
                    <Col lg={7} className="mb-3">
                        <ChartCard title="Receita Bruta por Entidade" subtitle="Top casinos por volume" loading={loading}>
                            {revenueByEntity ? (
                                <Chart
                                    options={{ ...revenueByEntity.options, xaxis: { ...revenueByEntity.options.xaxis, categories: revenueByEntity.categories } }}
                                    series={revenueByEntity.series}
                                    type="bar"
                                    height={320}
                                />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-bar-chart" />
                                    <p>Sem dados de receita por entidade</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={5} className="mb-3">
                        <ChartCard title="Equipamentos por Entidade" subtitle="Máquinas, bancas e equipamentos" loading={loading}>
                            {equipmentTreemap ? (
                                <Chart options={equipmentTreemap.options} series={equipmentTreemap.series} type="treemap" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-grid" />
                                    <p>Sem dados de equipamentos</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>

            {/* SEÇÃO 3: Processos & Exclusões */}
            <div className="dashboard-section">
                <span className="section-title">Processos & Exclusões</span>
                <Row>
                    <Col lg={7} className="mb-3">
                        <ChartCard title="Processos por Mês" subtitle="Exclusão vs Auto-exclusão (últimos 12 meses)" loading={loading}>
                            {processTrend ? (
                                <Chart options={processTrend.options} series={processTrend.series} type="bar" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-file-text" />
                                    <p>Sem dados de processos</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={5} className="mb-3">
                        <ChartCard title="Status dos Processos" subtitle="Distribuição por estado" loading={loading}>
                            {processStatus ? (
                                <Chart options={processStatus.options} series={processStatus.series} type="radialBar" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-activity" />
                                    <p>Sem dados de processos</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>

            {/* SEÇÃO 4: Eventos & Atividade */}
            <div className="dashboard-section">
                <span className="section-title">Eventos & Atividade</span>
                <Row>
                    <Col lg={5} className="mb-3">
                        <ChartCard title="Eventos por Status" subtitle="Aprovados, pendentes e recusados" loading={loading}>
                            {eventStatus ? (
                                <Chart options={eventStatus.options} series={eventStatus.series} type="pie" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-calendar" />
                                    <p>Sem dados de eventos</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={7} className="mb-3">
                        <ChartCard title="Atividade do Sistema" subtitle="Registos por módulo (últimos 12 meses)" loading={loading}>
                            {activityHeatmap ? (
                                <Chart options={activityHeatmap.options} series={activityHeatmap.series} type="heatmap" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-activity" />
                                    <p>Sem dados de atividade</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>

            {/* SEÇÃO 5: Handpay & Casos Suspeitos */}
            <div className="dashboard-section">
                <span className="section-title">Handpay & Casos Suspeitos</span>
                <Row>
                    <Col lg={7} className="mb-3">
                        <ChartCard title="Handpay por Entidade" subtitle="Valor total e quantidade de registos" loading={loading}>
                            {handpayChart ? (
                                <Chart options={handpayChart.options} series={handpayChart.series} type="bar" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-credit-card" />
                                    <p>Sem dados de handpay</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={5} className="mb-3">
                        <ChartCard title="Casos Suspeitos - Evolução" subtitle="Mensal e acumulado" loading={loading}>
                            {suspiciousCases ? (
                                <Chart options={suspiciousCases.options} series={suspiciousCases.series} type="area" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-alert-triangle" />
                                    <p>Sem casos suspeitos registados</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>

            {/* SEÇÃO 6: Orçamento IGJ */}
            <div className="dashboard-section">
                <span className="section-title">Orçamento IGJ</span>
                <Row>
                    <Col lg={7} className="mb-3">
                        <ChartCard title="Orçamento vs Despesa" subtitle="Por projeto/rubrica" loading={loading}>
                            {budgetChart ? (
                                <Chart options={budgetChart.options} series={budgetChart.series} type="bar" height={320} />
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-book" />
                                    <p>Sem dados de orçamento</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                    <Col lg={5} className="mb-3">
                        <ChartCard title="Taxa de Execução Orçamental" subtitle="Progresso de execução" loading={loading}>
                            {budgetExecution ? (
                                <>
                                    <Chart options={budgetExecution.options} series={budgetExecution.series} type="radialBar" height={280} />
                                    <Row className="budget-info">
                                        <Col xs={6}>
                                            <span className="budget-label">Orçamento</span>
                                            <span className="budget-value">{formatCurrency(budgetExecution.totalOrcamento)}</span>
                                        </Col>
                                        <Col xs={6}>
                                            <span className="budget-label">Despesa</span>
                                            <span className="budget-value">{formatCurrency(budgetExecution.totalDespesa)}</span>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <div className="dashboard-empty-state">
                                    <i className="feather icon-pie-chart" />
                                    <p>Sem dados de execução</p>
                                </div>
                            )}
                        </ChartCard>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DashAnalytics;
