/**
 * Secções do Manual do Sistema SGIGJ
 * Estrutura placeholder para preenchimento posterior.
 */

const manualSections = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        color: '#4680FF',
        description: 'Painel principal com indicadores de desempenho e visão geral do sistema.',
        subsections: [
            {
                title: 'Visão Geral',
                content: 'O Dashboard apresenta uma visão executiva com KPIs, gráficos financeiros, processos, eventos e atividade do sistema. Os dados são atualizados em tempo real a partir da base de dados.'
            },
            {
                title: 'Filtros Globais',
                content: 'Utilize os filtros de Ano e Entidade no topo do dashboard para filtrar todos os dados apresentados. Clique em "Atualizar" para aplicar os filtros.'
            },
            {
                title: 'KPIs (Indicadores)',
                content: 'Os cards no topo mostram: Receita Bruta, Impostos, Processos Ativos, Entidades, Eventos, Casos Suspeitos e Execução Orçamental.'
            },
            {
                title: 'Gráficos',
                content: 'Os gráficos estão organizados em 6 secções: Visão Financeira, Entidades & Receita, Processos & Exclusões, Eventos & Atividade, Handpay & Casos Suspeitos, e Orçamento IGJ.'
            }
        ]
    },
    {
        id: 'entidades',
        title: 'Entidades',
        icon: 'fas fa-building',
        color: '#93BE52',
        description: 'Gestão de casinos, entidades de jogo, pessoas e organização IGJ.',
        subsections: [
            {
                title: 'Casinos / Entidades',
                content: 'Lista todas as entidades registadas no sistema. Permite criar, editar, visualizar e remover entidades. Cada entidade tem detalhes, colaboradores, equipamentos, máquinas, bancas e dados financeiros.'
            },
            {
                title: 'Detalhes da Entidade',
                content: 'Ao aceder aos detalhes de uma entidade, pode gerir: Dados gerais, Handpay, Eventos, Processos, Casos Suspeitos e Financeiro (Impostos, Prémios, Contrapartidas, Contribuições).'
            },
            {
                title: 'Colaboradores',
                content: 'Gestão dos colaboradores associados a cada entidade. Permite adicionar, editar e remover colaboradores com informações pessoais e profissionais.'
            },
            {
                title: 'Equipamentos e Máquinas',
                content: 'Gestão do parque de equipamentos, máquinas de jogo e bancas de cada entidade. Inclui classificação, tipo e estado de cada equipamento.'
            },
            {
                title: 'Pessoas',
                content: 'Registo e gestão de pessoas individuais no sistema. Inclui dados pessoais, documentos, contactos e historial.'
            },
            {
                title: 'IGJ - Organização',
                content: 'Gestão interna da IGJ: orçamento, auditoria e visão geral. Permite acompanhar a execução orçamental e os registos de auditoria do sistema.'
            }
        ]
    },
    {
        id: 'eventos',
        title: 'Eventos',
        icon: 'fas fa-calendar-alt',
        color: '#69CEC6',
        description: 'Gestão de pedidos de eventos, aprovações e recusas.',
        subsections: [
            {
                title: 'Pedidos de Eventos',
                content: 'Lista todos os pedidos de eventos submetidos pelas entidades. O utilizador pode aprovar, recusar ou solicitar mais informações sobre cada pedido.'
            },
            {
                title: 'Eventos Aprovados',
                content: 'Lista os eventos que foram aprovados. Permite visualizar os detalhes do evento e o histórico de aprovação.'
            },
            {
                title: 'Eventos Recusados',
                content: 'Lista os eventos que foram recusados com o motivo da recusa. Permite rever os detalhes e eventualmente reavaliar.'
            }
        ]
    },
    {
        id: 'processos',
        title: 'Processos',
        icon: 'fas fa-gavel',
        color: '#AB7DF6',
        description: 'Gestão de processos de exclusão, auto-exclusão, interdição e handpay.',
        subsections: [
            {
                title: 'Auto-exclusão',
                content: 'Gestão dos pedidos de auto-exclusão. Permite registar, consultar e gerir processos de auto-exclusão de jogadores. Suporta exportação para PDF e Excel.'
            },
            {
                title: 'Exclusão / Interdição',
                content: 'Processos de exclusão e interdição com workflow completo: Despacho Inicial, Instrução, Peças Processuais, Notas de Comunicação, Despacho Final e Termo de Encerramento.'
            },
            {
                title: 'Peças Processuais',
                content: 'Dentro de um processo de exclusão, permite criar e gerir peças processuais (documentos do processo). Cada peça pode conter campos dinâmicos configurados na secção de Configuração.'
            },
            {
                title: 'Handpay',
                content: 'Registo e gestão de pagamentos handpay realizados pelas entidades. Inclui valor, data, entidade e detalhes do pagamento.'
            },
            {
                title: 'Processos Finalizados',
                content: 'Lista de processos que foram finalizados. Permite consultar o histórico completo do processo e os documentos associados.'
            },
            {
                title: 'Processos Arquivados',
                content: 'Lista de processos arquivados. Processos que foram encerrados e guardados para referência futura.'
            }
        ]
    },
    {
        id: 'configuracao',
        title: 'Configuração',
        icon: 'fas fa-sliders-h',
        color: '#69CEC6',
        description: 'Parametrizações do sistema: tabelas de referência, campos e definições.',
        subsections: [
            {
                title: 'Pessoas',
                content: 'Configuração de dados de referência para pessoas: Estado Civil, Género, Língua, Nível Linguístico, Nível de Escolaridade, Profissão, Categoria Profissional, Tipo de Cargo e Tipo de Contacto.'
            },
            {
                title: 'Entidades',
                content: 'Configuração de dados de referência para entidades: Tipo de Entidade, Tipologia, Tipo de Banca, Classificação de Equipamento, Tipo de Equipamento e Tipo de Máquina.'
            },
            {
                title: 'Financeiro',
                content: 'Configuração de dados financeiros: Meio de Pagamento, Modalidade de Pagamento, Divisas, Banco e Taxa de Casino.'
            },
            {
                title: 'Processos',
                content: 'Configuração de processos: Peças Processuais, Campos, Infração, Coima, Período de Exclusão, Motivo de Exclusão, Tipo de Decisão, Tipo de Parecer, Tipo de Origem, Tipo de Evento e Status.'
            },
            {
                title: 'Geral',
                content: 'Configurações gerais: Tipo de Documento, Projetos, Rubricas e Predefinições (Tempo Limite de Decisão).'
            }
        ]
    },
    {
        id: 'administracao',
        title: 'Administração',
        icon: 'fas fa-shield-alt',
        color: '#FC6180',
        description: 'Gestão de utilizadores, perfis, permissões e estrutura de menus.',
        subsections: [
            {
                title: 'Utilizadores',
                content: 'Gestão dos utilizadores do sistema. Permite criar, editar e desativar contas. Cada utilizador tem um perfil associado que define as suas permissões.'
            },
            {
                title: 'Perfis',
                content: 'Gestão dos perfis/roles do sistema. Cada perfil define um conjunto de permissões que podem ser atribuídas aos utilizadores.'
            },
            {
                title: 'Permissões',
                content: 'Configuração granular das permissões por perfil. Define quais ações (Criar, Ler, Editar, Remover) cada perfil pode executar em cada página do sistema.'
            },
            {
                title: 'Menus',
                content: 'Configuração da estrutura de menus do sidebar. Permite adicionar, reordenar e configurar itens de menu com grupos, subgrupos e itens.'
            },
            {
                title: 'Ações de Menu',
                content: 'Gestão das ações disponíveis em cada item de menu (Criar, Ler, Editar, Remover). Estas ações são usadas pelo sistema de permissões.'
            }
        ]
    }
];

// ── Secção exclusiva para Admin: Relatório Técnico ──
const relatorioTecnicoSection = {
    id: 'relatorio-tecnico',
    title: 'Relatório Técnico',
    icon: 'fas fa-file-alt',
    color: '#1B4965',
    adminOnly: true,
    description: 'Relatório técnico detalhado do Sistema Integrado de Gestão da Inspeção Geral de Jogos (SGIGJ). Documento confidencial — acesso restrito ao Administrador.',
    subsections: [
        {
            title: 'Sumário Executivo',
            content: 'O SGIGJ é uma plataforma empresarial de larga escala concebida para a gestão integral das atividades de inspeção, regulação e fiscalização do setor de jogos em Cabo Verde. O sistema encontra-se substancialmente desenvolvido e operacional, com a infraestrutura de produção ativa e acessível em sgigj.igj.cv.'
        },
        {
            title: 'Métricas Globais do Projeto',
            contentType: 'table',
            tableData: [
                ['Indicador', 'Valor'],
                ['Total de linhas de código', '139.565 linhas'],
                ['Linhas de código — Frontend', '105.622 linhas'],
                ['Linhas de código — Backend', '33.943 linhas'],
                ['Ficheiros de código — Frontend', '219 ficheiros'],
                ['Ficheiros de código — Backend', '217 ficheiros'],
                ['Total de ficheiros de código', '436 ficheiros'],
                ['Controladores de API', '103 controladores'],
                ['Modelos de base de dados', '92 modelos'],
                ['Rotas/Endpoints de API', '200+ rotas'],
                ['Páginas de interface', '56 páginas'],
                ['Tabelas na base de dados', '150+ tabelas'],
                ['Migrações de base de dados', '93 migrações'],
                ['Gráficos no Dashboard', '12 gráficos'],
            ],
            content: 'O projeto totaliza 139.565 linhas de código distribuídas por 436 ficheiros, 103 controladores de API, 92 modelos de dados e 56 páginas de interface.'
        },
        {
            title: 'Stack Tecnológica',
            contentType: 'table',
            tableData: [
                ['Camada', 'Tecnologia'],
                ['Backend (API)', 'AdonisJS 4.1 (Node.js), Lucid ORM'],
                ['Frontend (Interface)', 'React 17, Redux, React Router, Bootstrap 4'],
                ['Base de Dados', 'MySQL 8.0 (Cloud SQL)'],
                ['Alojamento Frontend', 'Firebase Hosting'],
                ['Alojamento API', 'Cloud Run (Google Cloud Platform)'],
                ['Armazenamento', 'Firebase Cloud Storage'],
                ['Autenticação', 'JWT (JSON Web Tokens)'],
                ['Tempo Real', 'Socket.io (WebSocket)'],
                ['Geração de Documentos', 'html-pdf (servidor), jsPDF (cliente)'],
                ['Notificações Email', 'Nodemailer (SMTP)'],
                ['Gráficos', 'React ApexCharts'],
                ['Editor de Texto Rico', 'Jodit Editor'],
                ['CI/CD', 'Google Cloud Build'],
            ],
            content: 'O sistema utiliza uma stack moderna com React 17 no frontend, AdonisJS 4.1 no backend, MySQL 8.0 como base de dados e Google Cloud Platform como infraestrutura cloud.'
        },
        {
            title: 'Ambientes de Produção e Testes',
            contentType: 'table',
            tableData: [
                ['Ambiente', 'Frontend', 'API'],
                ['Produção', 'sgigj.igj.cv', 'api.igj.cv'],
                ['Sandbox (Testes)', 'dev.igj.cv', 'dev.api.igj.cv'],
            ],
            content: 'O sistema possui dois ambientes completos e independentes: produção (sgigj.igj.cv / api.igj.cv) e sandbox para testes (dev.igj.cv / dev.api.igj.cv), ambos com pipeline CI/CD automatizado via Cloud Build.'
        },
        {
            title: 'Diagrama de Arquitetura',
            contentType: 'diagram',
            content: 'Utilizador (Browser) → Firebase Hosting (Frontend React SPA com Dashboard, Entidades, Processos, Configuração) → Cloud Run API (103 Controladores, 92 Modelos, Auth JWT, Socket.io, 200+ APIs) → Cloud SQL MySQL 8.0 (150+ tabelas, 93 migrações) + Firebase Storage (Documentos e Ficheiros: PDFs, DOCX, Imagens).'
        },
        {
            title: 'Módulo de Administração — 5 páginas',
            contentType: 'list',
            listItems: [
                'Gestão de Utilizadores — Criar, editar e desativar contas de utilizadores com perfil associado',
                'Gestão de Perfis — Definição de perfis/roles com permissões específicas',
                'Gestão de Permissões — Atribuição granular de permissões por ação (Criar, Ler, Editar, Remover) e por perfil',
                'Gestão de Menus — Configuração dinâmica dos menus de navegação por perfil',
                'Ações de Menu — Associação de ações específicas a cada item de menu',
            ],
            content: 'Módulo de gestão interna com controlo total de acessos. O sistema RBAC verifica permissões ao nível da página (pageEnable) e ao nível de cada ação (taskEnable), com menus gerados dinamicamente com base no perfil autenticado.'
        },
        {
            title: 'Módulo de Entidades — 12 páginas',
            contentType: 'list',
            listItems: [
                'Listagem de Entidades — Tabela com filtros, pesquisa global e paginação',
                'Detalhes da Entidade — Ficha completa com todos os dados',
                'Gestão de Bancas — Informação bancária por entidade',
                'Gestão de Colaboradores — Staff e funcionários por entidade',
                'Gestão de Equipamentos — Equipamentos de jogo com classificação tipificada',
                'Gestão de Grupos — Agrupamento de entidades',
                'Gestão de Máquinas — Máquinas de jogo registadas',
                'Gestão de Pessoas — Contactos e stakeholders',
                'Impostos por Entidade — Impostos de jogo aplicáveis',
                'Contribuições e Contrapartidas — Obrigações financeiras',
                'Prémios — Gestão de prémios por entidade',
                'Casos Suspeitos — Alertas de compliance',
            ],
            content: 'Gestão completa de todas as entidades do setor de jogos. Inclui sub-módulo IGJ com gestão orçamental (projetos, rubricas, cabimentação), auditoria e visão geral financeira.'
        },
        {
            title: 'Módulo de Eventos — 3 páginas',
            contentType: 'list',
            listItems: [
                'Pedidos de Eventos — Submissão e análise de novos pedidos',
                'Eventos Aprovados — Listagem e gestão de eventos autorizados com histórico',
                'Eventos Recusados — Histórico com motivo de recusa',
                'Decisões e Pareceres — Registo formal de decisões e pareceres técnicos',
                'Dados e Prémios — Datas dos eventos e prémios associados',
            ],
            content: 'Ciclo completo de gestão de eventos de jogo autorizados pela IGJ, com fluxo de pedido, aprovação/recusa, decisões e pareceres.'
        },
        {
            title: 'Módulo de Processos — 8 páginas (Módulo Principal)',
            contentType: 'steps',
            steps: [
                { number: 1, label: 'Auto de Exclusão', desc: 'Abertura formal do processo' },
                { number: 2, label: 'Despacho Inicial', desc: 'Atribuição de instrutor e definição de prazos' },
                { number: 3, label: 'Instrução', desc: 'Fase de investigação com recolha de provas' },
                { number: 4, label: 'Peças Processuais', desc: '7 tipos de documentos: Nota de Comunicação, Autodeclaração, Prova, Reclamação, Relatório Final, Juntada, Termo' },
                { number: 5, label: 'Despacho Final', desc: 'Decisão: Exclusão, Interdição ou Arquivamento' },
                { number: 6, label: 'Notificação da Decisão', desc: 'Notificação formal com PDF gerado automaticamente' },
                { number: 7, label: 'Decisão Tutelar/Tribunal', desc: 'Recursos e decisões de apelação' },
                { number: 8, label: 'Termo de Encerramento', desc: 'Fecho formal do processo' },
            ],
            content: 'O módulo mais complexo do sistema (~2.660 linhas na página principal). Inclui também: Auto-Exclusão (fluxo simplificado), Handpay, processos finalizados, arquivados e prescritos (controlo automático de prazos). Funcionalidades: gerador de texto automático, fusão de PDFs (juntada), notificações formais por email com anexo, editor de texto rico e visualizador integrado de documentos.'
        },
        {
            title: 'Módulo de Configuração — 35 páginas',
            contentType: 'groups',
            groups: [
                {
                    label: 'Entidades e Recursos',
                    items: ['Tipos de Entidade', 'Tipos de Banca', 'Classificação de Equipamentos', 'Tipos de Equipamento', 'Tipos de Máquina', 'Tipologias']
                },
                {
                    label: 'Pessoas',
                    items: ['Géneros', 'Estados Civis', 'Profissões', 'Categorias Profissionais', 'Níveis de Escolaridade', 'Línguas', 'Níveis Linguísticos', 'Tipos de Cargo', 'Tipos de Contacto', 'Tipos de Documento']
                },
                {
                    label: 'Processos',
                    items: ['Infrações', 'Coimas', 'Motivos de Exclusão', 'Períodos de Exclusão', 'Tipos de Origem', 'Status', 'Peças Processuais', 'Campos Personalizados', 'Tempos Limite de Decisão']
                },
                {
                    label: 'Financeiro',
                    items: ['Projetos', 'Rubricas', 'Bancos', 'Meios de Pagamento', 'Modalidades de Pagamento', 'Divisas/Moedas', 'Taxas de Casino', 'Predefinições']
                },
                {
                    label: 'Eventos e Decisões',
                    items: ['Tipos de Evento', 'Tipos de Decisão', 'Tipos de Parecer', 'Parametrização de Pareceres']
                }
            ],
            content: 'Mais de 50 tabelas de dados mestres configuráveis, permitindo a parametrização completa do sistema sem necessidade de intervenção técnica.'
        },
        {
            title: 'Dashboard Analítico — 7 KPIs e 12 Gráficos',
            contentType: 'kpis',
            kpis: [
                { label: 'Receita Bruta', format: 'Moeda (CVE)', color: '#2B7FB9' },
                { label: 'Impostos', format: 'Moeda (CVE)', color: '#C5A55A' },
                { label: 'Processos Ativos', format: 'Número', color: '#1B4965' },
                { label: 'Entidades', format: 'Número', color: '#2ED8B6' },
                { label: 'Eventos', format: 'Número', color: '#4099FF' },
                { label: 'Casos Suspeitos', format: 'Número', color: '#F39C12' },
                { label: 'Exec. Orçamental', format: 'Percentagem', color: '#D4A843' },
            ],
            charts: [
                'Evolução Financeira (Área)',
                'Composição da Receita (Donut)',
                'Receita por Entidade (Barras)',
                'Treemap de Equipamentos',
                'Tendência de Processos (Barras)',
                'Estado dos Processos (Barras Radiais)',
                'Estado dos Eventos (Circular)',
                'Heatmap de Atividade',
                'Handpay por Entidade (Eixo Duplo)',
                'Evolução Casos Suspeitos (Área)',
                'Orçamento vs. Despesas (Barras)',
                'Taxa de Execução Orçamental (Radial)',
            ],
            content: 'Dashboard com 7 KPIs em tempo real, 12 gráficos especializados organizados em 6 secções, filtros dinâmicos por ano e entidade. Biblioteca de gráficos: React ApexCharts.'
        },
        {
            title: 'Segurança e Controlo de Acessos',
            contentType: 'list',
            listItems: [
                'Autenticação JWT — JSON Web Tokens com armazenamento seguro',
                'RBAC — Controlo de acesso baseado em perfis com permissões granulares',
                'Trilha de Auditoria — Registo automático de todas as ações no sistema',
                'Soft Delete — Marcação de estado em vez de eliminação física',
                'Validação de Formulários — Formik + Yup para validação robusta',
                'Sessão Expirada — Página de Lock com reautenticação',
                'Tratamento de Erros — Credenciais incorretas, conta desativada, erro genérico',
            ],
            content: 'Sistema de segurança robusto com autenticação JWT, controlo de acesso RBAC por perfil, trilha de auditoria completa e validação em todas as camadas.'
        },
        {
            title: 'Gestão Documental e Geração de PDFs',
            contentType: 'list',
            listItems: [
                'Geração servidor — Conversão de templates HTML para PDF (html-pdf)',
                'Geração cliente — PDFs gerados diretamente no browser (jsPDF)',
                'Fusão de PDFs — Compilação de múltiplos documentos num único ficheiro (Juntada)',
                'Visualização integrada — PDFs visualizados no browser via Iframe + Blob API',
                'Envio por email — Anexo automático de PDFs em notificações (Nodemailer)',
                '11 modelos DOCX — Templates para despachos, formulários e processos administrativos',
                'Gerador de Texto — Geração automática de comunicações formais com variáveis dinâmicas',
            ],
            content: 'Sistema completo de gestão documental com geração automática de PDFs, fusão de documentos, modelos DOCX e envio por email.'
        },
        {
            title: 'Base de Dados — 92 Modelos e 150+ Tabelas',
            contentType: 'groups',
            groups: [
                { label: 'Processos (15+)', items: ['Exclusão', 'Auto-Exclusão', 'Handpay', 'Despacho', 'Instrução', 'Peças Processuais', 'Notificações', 'Decisões Tribunal/Tutelar'] },
                { label: 'Entidades (8+)', items: ['Entidade', 'Banca', 'Grupo', 'Máquina', 'Equipamento', 'Casino'] },
                { label: 'Eventos (5+)', items: ['Evento', 'Decisão', 'Parecer', 'Prémios', 'Datas'] },
                { label: 'Financeiro (12+)', items: ['Imposto', 'Contribuição', 'Contrapartida', 'Orçamento', 'Despesa', 'Cabimentação', 'Projeto', 'Rubrica'] },
                { label: 'Pessoas (5+)', items: ['Pessoa', 'Relação Pessoa-Entidade', 'Documentos', 'Contactos', 'Línguas'] },
                { label: 'Configuração (35+)', items: ['Todas as tabelas de tipificação e parametrização'] },
                { label: 'Sistema (8+)', items: ['Utilizador', 'Perfil', 'Menu', 'Permissões', 'Notificação', 'Auditoria', 'Token', 'Predefinição'] },
            ],
            content: '92 modelos de dados com relações hasMany, belongsTo e belongsToMany. 93 migrações documentando a evolução do schema desde outubro de 2021. Suporte a soft delete e rastreamento completo de referências.'
        },
        {
            title: 'Infraestrutura de Implantação (CI/CD)',
            contentType: 'list',
            listItems: [
                'Pipeline CI/CD — Cloud Build com triggers automáticos em git push',
                'Docker — Imagens containerizadas para a API',
                'Cloud Run — Auto-scaling de 0 a 10 instâncias',
                'Firebase Hosting — Alojamento do frontend SPA',
                'Cloud SQL — Instâncias MySQL geridas (sandbox + produção)',
                'Firebase Storage — Armazenamento de documentos e ficheiros',
                'SSL/TLS — Certificados HTTPS automáticos',
                'Domínios personalizados — igj.cv configurado',
                'Scripts de deploy — deploy-sandbox.sh e deploy-production.sh',
                'Backups — Procedimentos de backup da base de dados configurados',
            ],
            content: 'Infraestrutura cloud completa no Google Cloud Platform com pipeline CI/CD automatizado, auto-scaling, alta disponibilidade e domínios personalizados.'
        },
        {
            title: 'Funcionalidades Transversais',
            contentType: 'list',
            listItems: [
                'Notificações em Tempo Real — Socket.io para notificações instantâneas',
                'Notificações por Email — Nodemailer SMTP com anexos PDF',
                'Presença Online — Estado online/offline dos utilizadores',
                'Exportação PDF/CSV/Excel — Exportação de dados em múltiplos formatos',
                'Tabela Dinâmica — Paginação (5-50), ordenação e pesquisa global (React Table)',
                'KPI Cards — Indicadores com formatação de moeda/percentagem e sparklines',
                'Editor de Texto Rico — Jodit Editor para despachos formatados',
                'Hooks Personalizados — useAuth, useDashboardData, useColumnVisibility, useTable, useWindowSize',
                'Funções utilitárias — Permissões, datas, moeda, temporizadores',
                'Interface Responsiva — Bootstrap 4 com layout adaptável a dispositivos móveis',
            ],
            content: 'Conjunto abrangente de funcionalidades transversais que garantem uma experiência de utilização moderna e eficiente.'
        },
    ]
};

export { relatorioTecnicoSection };
export default manualSections;
