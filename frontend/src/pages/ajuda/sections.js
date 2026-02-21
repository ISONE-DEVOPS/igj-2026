/**
 * Secções do Manual do Utilizador — SGIGJ v2.0
 * Baseado no Manual do Utilizador de Fevereiro de 2026.
 */

const manualSections = [
    {
        id: 'acesso',
        title: 'Acesso ao Sistema',
        icon: 'fas fa-sign-in-alt',
        color: '#2B7FB9',
        description: 'Como iniciar sessão, bloquear e terminar sessão no SGIGJ.',
        subsections: [
            {
                title: 'Início de Sessão (Login)',
                content: 'Ao aceder ao endereço web do SGIGJ, será apresentada a página de início de sessão com o logótipo da IGJ e a mensagem "Bem-vindo de volta!".\n\nPara iniciar sessão:\n1. Introduza o seu Utilizador no campo correspondente (representado pelo ícone de pessoa).\n2. Introduza a sua Palavra-passe no campo correspondente (representado pelo ícone de cadeado).\n3. Caso pretenda visualizar a palavra-passe, clique no ícone do olho situado à direita do campo.\n4. Clique no botão Entrar.\n\nSe as credenciais estiverem incorretas, o sistema apresenta a mensagem "Credenciais incorretas". Se a sua conta estiver desativada, o sistema apresenta a mensagem "Conta desativada" — contacte o Administrador do Sistema.'
            },
            {
                title: 'Bloqueio de Sessão (Lock Screen)',
                content: 'Por motivos de segurança, o sistema pode bloquear a sua sessão após um período de inatividade. Neste caso, será apresentado o ecrã de bloqueio, onde deverá introduzir novamente a sua palavra-passe para retomar a sessão.'
            },
            {
                title: 'Terminar Sessão (Logout)',
                content: 'Para terminar a sessão:\n1. Clique no ícone do seu perfil, situado no canto superior direito do ecrã.\n2. Selecione a opção Sair ou Logout.'
            }
        ]
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        color: '#4680FF',
        description: 'Painel principal com indicadores de desempenho e visão geral do sistema. As secções visíveis dependem do perfil e das permissões atribuídas ao utilizador.',
        subsections: [
            {
                title: 'Visão Geral',
                content: 'O Dashboard é a página principal do sistema, acessível após o início de sessão através do menu lateral ou pelo caminho /dashboard. Apresenta uma visão consolidada das principais métricas e indicadores da IGJ, organizada em secções temáticas.\n\nNota: As secções visíveis no Dashboard dependem do perfil e das permissões atribuídas ao utilizador. Nem todos os utilizadores terão acesso a todas as secções.'
            },
            {
                title: 'Filtros Globais',
                content: 'No topo do Dashboard, encontram-se os filtros globais que permitem refinar os dados apresentados:\n\n• Ano — Filtrar dados por ano específico.\n• Entidade — Filtrar dados por entidade (casino) específica.\n• Atualizar — Botão para recarregar os dados com os filtros selecionados.'
            },
            {
                title: 'Indicadores-Chave de Desempenho (KPIs)',
                content: 'A primeira faixa do Dashboard apresenta os cartões de KPI, cada um com o título, o valor atual e um subtítulo descritivo:\n\n• Receita Bruta — Total de receita bruta acumulada (em CVE).\n• Impostos — Total de impostos arrecadados (em CVE).\n• Processos Ativos — Número de processos de exclusão e auto-exclusão em curso.\n• Entidades — Número de entidades ativas registadas.\n• Eventos — Número de eventos registados.\n• Casos Suspeitos — Número de casos suspeitos ativos.\n• Exec. Orçamental — Taxa de execução orçamental (em percentagem).'
            },
            {
                title: 'Visão Financeira',
                content: '• Evolução Financeira Anual — Gráfico de área que mostra a evolução de receita, impostos, contrapartidas e contribuições ao longo do tempo.\n• Composição da Receita — Gráfico circular (donut) com a distribuição da receita por categoria.'
            },
            {
                title: 'Entidades e Receita por Casino',
                content: '• Receita Bruta por Entidade — Gráfico de barras com os principais casinos por volume de receita.\n• Equipamentos por Entidade — Mapa de árvore (treemap) com a distribuição de máquinas, bancas e equipamentos por entidade.'
            },
            {
                title: 'Processos e Exclusões',
                content: '• Processos por Mês — Gráfico de barras comparando processos de exclusão com auto-exclusão nos últimos 12 meses.\n• Status dos Processos — Gráfico radial com a distribuição de processos por estado.'
            },
            {
                title: 'Eventos e Atividade',
                content: '• Eventos por Status — Gráfico circular com a distribuição de eventos por estado (aprovados, pendentes, recusados).\n• Atividade do Sistema — Mapa de calor (heatmap) com os registos por módulo nos últimos 12 meses.'
            },
            {
                title: 'Handpay e Casos Suspeitos',
                content: '• Handpay por Entidade — Gráfico de barras com o valor total e a quantidade de registos de handpay por entidade.\n• Casos Suspeitos - Evolução — Gráfico de área com a evolução mensal e acumulada de casos suspeitos.'
            },
            {
                title: 'Orçamento IGJ',
                content: '• Orçamento vs Despesa — Gráfico de barras comparando orçamento previsto com despesa efetiva, por projeto/rubrica.\n• Taxa de Execução Orçamental — Gráfico radial com a percentagem de execução, acompanhado dos valores totais de orçamento e despesa.'
            }
        ]
    },
    {
        id: 'entidades',
        title: 'Entidades',
        icon: 'fas fa-building',
        color: '#93BE52',
        description: 'Gestão de todas as entidades (empresas de jogo, casinos), pessoas singulares e a organização interna da IGJ.',
        subsections: [
            {
                title: 'Lista de Entidades',
                content: 'Caminho: Entidades > Entidades (/entidades/entidades)\n\nA página apresenta a lista de todas as entidades registadas no sistema.\n\nPara consultar: Utilize a caixa de pesquisa para filtrar por nome, código ou tipo. Clique numa entidade para aceder aos seus detalhes.\n\nCriar Entidade:\n1. Clique em Adicionar.\n2. Preencha: Denominação/Razão Social, Tipo de Entidade e dados adicionais.\n3. Clique em Guardar.'
            },
            {
                title: 'Bancas, Máquinas e Equipamentos',
                content: 'Bancas (/entidades/entidades/banca/:id): Gestão das bancas de jogo (mesas). Visualize, adicione, edite ou elimine. Exporte em PDF ou CSV.\n\nMáquinas (/entidades/entidades/maquina/:id): Gestão das máquinas de jogo (slot machines e similares). Visualize, adicione com dados técnicos. Exporte em PDF ou CSV.\n\nEquipamentos (/entidades/entidades/equipamento/:id): Gestão de outros equipamentos. Cada equipamento possui classificação e tipo. Exporte em PDF ou CSV.'
            },
            {
                title: 'Grupos e Colaboradores',
                content: 'Grupos (/entidades/entidades/grupo/:id): Gestão dos grupos empresariais a que a entidade pertence. Consulte, adicione ou remova associações.\n\nColaboradores (/entidades/entidades/colaboradores/:id): Gestão do pessoal afeto à entidade. Adicione novos colaboradores indicando a pessoa, o cargo e a relação com a entidade. Exporte em PDF ou CSV.'
            },
            {
                title: 'Gestão de Pessoas',
                content: 'Caminho: Entidades > Pessoas (/entidades/pessoas)\n\nRegisto de todas as pessoas singulares referenciadas no sistema.\n\nConsultar: Pesquise por nome, código ou documento de identificação.\n\nCriar Pessoa:\n1. Clique em Adicionar.\n2. Preencha: Nome completo, Género, Estado civil, Data de nascimento, Profissão, Nível de escolaridade, Documentos de identificação, Contactos e Línguas.\n3. Clique em Guardar.\n\nNota: O componente de criação de pessoa está disponível em diversos pontos do sistema (processos, handpay, etc.).'
            },
            {
                title: 'Organização IGJ',
                content: 'Caminho: Entidades > IGJ (/entidades/igj)\n\nGestão da estrutura organizativa interna da IGJ, incluindo colaboradores e cargos.\n\nSub-páginas:\n• Orçamento (/entidade/orcamento) — Gestão orçamental da IGJ.\n• Auditoria (/entidade/auditoria) — Registo de auditoria de todas as operações.\n• Visão Geral (/entidade/visaogeral) — Visão consolidada da informação da IGJ.'
            }
        ]
    },
    {
        id: 'eventos',
        title: 'Eventos',
        icon: 'fas fa-calendar-alt',
        color: '#69CEC6',
        description: 'Gestão de pedidos de eventos submetidos pelas entidades de jogo, bem como os respetivos pareceres e decisões.',
        subsections: [
            {
                title: 'Eventos Pedidos (Pendentes)',
                content: 'Caminho: Eventos > Pedidos (/eventos/eventospedidos)\n\nLista de eventos que aguardam apreciação e decisão.\n\nRegistar Evento:\n1. Clique em Adicionar.\n2. Preencha: Entidade requerente, Tipo de evento, Data pretendida, Descrição/Observações.\n3. Clique em Guardar.\n\nApreciar Evento:\n1. Clique no ícone de edição do evento pendente.\n2. Analise os dados do pedido.\n3. Emita o parecer: Aprovar ou Recusar.\n4. Clique em Guardar.'
            },
            {
                title: 'Eventos Aprovados',
                content: 'Caminho: Eventos > Aprovados (/eventos/aprovados)\n\nLista de todos os eventos aprovados. Permite consultar, filtrar e exportar.\n\nFuncionalidades: Pesquisa por texto livre, ordenação por qualquer coluna, exportação em PDF ou CSV.'
            },
            {
                title: 'Eventos Recusados',
                content: 'Caminho: Eventos > Recusados (/eventos/recusados)\n\nLista de todos os eventos cuja aprovação foi recusada. Permite consulta e exportação.'
            }
        ]
    },
    {
        id: 'processos',
        title: 'Processos',
        icon: 'fas fa-gavel',
        color: '#AB7DF6',
        description: 'Núcleo funcional do SGIGJ, abrangendo todos os processos administrativos da IGJ: auto-exclusão, exclusão/interdição, handpay, reclamações e contra-ordenações.',
        subsections: [
            {
                title: 'Auto-Exclusão',
                content: 'Caminho: Processos > Auto-Exclusão (/processos/autoexclusao)\n\nGere os pedidos voluntários de exclusão de salas de jogo.\n\nA tabela apresenta: Referência, Pessoa, Entidade, Data do Pedido, Motivo, Período, Número de Dias, Data de Início e Data de Fim.\n\nFiltros: Ativos/Inativos, Despacho (Sim/Não/Todos), Ano e Pesquisa.\n\nRegistar Pedido:\n1. Clique em Adicionar.\n2. Preencha: Pessoa, Entidade, Motivo de Exclusão, Período de Exclusão, Data de Início, Observações e Documentos.\n3. Clique em Guardar.\n\nDespacho:\n1. Clique no ícone de edição.\n2. Selecione tipo de decisão, preencha referência, data, prazo e texto do despacho (com geração automática de texto).\n3. Clique em Guardar.\n\nExportação: PDF e Excel.'
            },
            {
                title: 'Handpay',
                content: 'Caminho: Processos > Handpay (/processos/handpay)\n\nRegistos de pagamentos manuais de valores elevados nas máquinas de jogo.\n\nA tabela apresenta: Código, Pessoa, Entidade, Valor e Data.\nFiltros: Ano e Pesquisa. O sistema calcula o Total automaticamente.\n\nRegistar:\n1. Clique em Adicionar.\n2. Preencha: Pessoa, Entidade, Valor (CVE), Data e Documentos.\n3. Clique em Guardar.\n\nExportação: PDF e Excel.'
            },
            {
                title: 'Exclusão/Interdição — Ciclo de Vida',
                content: 'Caminho: Processos > Exclusão/Interdição (/processos/exclusaointerdicao)\n\nCiclo de vida completo dos processos de exclusão e interdição.\n\nFluxo: Instauração → Despacho Inicial → Instrução → Despacho Final → Notificação → Encerramento\n\nFases:\n1. Instauração — Criação do auto de exclusão/notícia.\n2. Despacho Inicial — Emissão de despacho, nomeação do instrutor e definição de prazo.\n3. Instrução — Investigação com recolha de provas e peças processuais.\n4. Despacho Final — Decisão final (exclusão, interdição, arquivamento ou devolução).\n5. Notificação — Notificação formal ao visado.\n6. Decisão Tutelar/Tribunal — Decisões de instâncias superiores (se aplicável).\n7. Termo de Encerramento — Encerramento formal.'
            },
            {
                title: 'Exclusão/Interdição — Instauração',
                content: 'Para criar um processo:\n1. Clique em Adicionar.\n2. Preencha:\n   • Pessoa/Visado — Selecione ou crie uma nova.\n   • Entidade — Selecione a entidade de jogo.\n   • Descrição dos Factos — Descreva os factos.\n   • Tipo de Pedido — Selecione o tipo.\n   • Observações — Editor de texto rico.\n   • Documentos — Anexe comprovativos.\n3. Clique em Guardar.\n\nReferência automática no formato AAAA.NNNN (ano.número sequencial).'
            },
            {
                title: 'Exclusão/Interdição — Despacho Inicial',
                content: 'Para emitir o Despacho Inicial:\n1. Abra o processo (ícone de edição).\n2. Aceda à secção Despacho Inicial.\n3. Preencha: Referência, Data, Instrutor, Tipo de Decisão, Prazo e Texto do Despacho.\n4. O botão Gerar texto preenche automaticamente com base nos dados do processo.\n5. Clique em Guardar.\n\nResultado: O instrutor recebe notificação interna e por email. O processo avança para instrução.'
            },
            {
                title: 'Instrução e Peças Processuais',
                content: 'O instrutor conduz a fase de instrução.\n\nPeças Processuais:\n1. Clique em Adicionar Peça.\n2. Selecione o Tipo: Nota de Comunicação, Auto-declaração, Prova, Reclamação do Visado, Relatório Final, Juntada ou Termo de Encerramento.\n3. Preencha os campos dinâmicos: Pessoa/Destinatário, Observações, Documentos, Infração/Coima, Decisão.\n4. Clique em Guardar.\n\nNota de Comunicação: Gera PDF automaticamente e envia por email, com templates para Visado, Entidade Decisora e Entidade Visada.\n\nInterrupção: Clique em Interromper, indique o motivo e Guardar. Pode ser retomada posteriormente.'
            },
            {
                title: 'Despacho Final e Notificação',
                content: 'Despacho Final:\n1. Aceda à secção Despacho Final.\n2. Preencha: Data, Tipo de Decisão (Exclusão, Interdição, Arquivamento ou Devolução), Período de Exclusão, Infração/Coima e Texto.\n3. Clique em Guardar.\n\nNotificação da Decisão:\n1. Aceda à secção Notificação.\n2. Preencha: Corpo, Documentos e Visados a notificar.\n3. Guardar para rascunho. Concluir para gerar PDF e enviar email.\n\nDecisão Tutelar/Tribunal: Registe decisões de instâncias superiores nas secções correspondentes.'
            },
            {
                title: 'Juntada, Encerramento e Resgate',
                content: 'Juntada: Compila todos os documentos do processo num único PDF.\n1. Clique em Juntada.\n2. PDF gerado automaticamente com capa e todos os documentos.\n\nTermo de Encerramento:\n1. Aceda à secção Termo de Encerramento.\n2. Redija o texto e clique em Guardar.\n\nResgatar Processo: Para processos finalizados por engano, localize na lista de finalizados e clique em Resgatar — o processo regressa à lista de ativos.'
            },
            {
                title: 'Processos Finalizados, Arquivados e Prescritos',
                content: 'Finalizados (/processos/exclusaofinalizado): Processos concluídos. Consulte detalhes, pesquise e exporte.\n\nArquivados (/processos/exclusao/arquivados): Processos encerrados sem decisão de exclusão/interdição.\n\nPrescritos (/processos/exclusao/prescritos): Processos cujo prazo máximo de instrução expirou sem decisão. O sistema monitoriza automaticamente os prazos.'
            },
            {
                title: 'Reclamações',
                content: 'Caminho: Processos > Reclamações (/processos/reclamacao)\n\nReclamações contra entidades de jogo.\n\nRegistar:\n1. Clique em Adicionar.\n2. Preencha: Reclamante, Entidade reclamada, Descrição, Data e Documentos.\n3. Clique em Guardar.\n\nTratar: Abra a reclamação, analise os dados, emita parecer/decisão, atualize o estado e Guardar.'
            },
            {
                title: 'Contra-Ordenações',
                content: 'Caminho: Processos > Contra-Ordenação (/processos/contraordenacao)\n\nProcessos de contra-ordenação por infrações detetadas.\n\nFiltros: Ano e pesquisa textual.\n\nGerir:\n1. Abra o processo.\n2. Consulte e gira: Dados, Instrução, Peças processuais, Documentos e Despachos.\n3. Atualize e clique em Guardar.'
            }
        ]
    },
    {
        id: 'configuracao',
        title: 'Configuração',
        icon: 'fas fa-sliders-h',
        color: '#69CEC6',
        description: 'Gestão das tabelas paramétricas do sistema. Estas tabelas definem os valores disponíveis nos campos de seleção (listas pendentes) utilizados em todo o sistema.',
        subsections: [
            {
                title: 'Funcionamento Geral',
                content: 'Caminho geral: Configuração > [Nome da Tabela] (/configuracao/[tabela])\n\nTodas as tabelas paramétricas seguem o mesmo padrão:\n\nConsultar: Aceda à tabela pelo menu lateral. Colunas típicas: Código, Designação, Descrição e Ações. Utilize pesquisa e o seletor Mostrar.\n\nCriar: Clique em Adicionar, preencha os campos obrigatórios (asterisco vermelho), clique em Guardar.\n\nEditar: Clique no ícone de edição, altere e Guardar.\n\nEliminar: Clique no ícone de eliminação (vermelho) e confirme. Atenção: Registos em uso noutras tabelas não podem ser eliminados.'
            },
            {
                title: 'Tabelas de Pessoas',
                content: '• Género (/configuracao/genero) — Géneros\n• Estado Civil (/configuracao/estadocivil) — Estados civis\n• Tipo de Documento (/configuracao/tipodocumento) — Tipos de documento de identificação\n• Tipo de Contacto (/configuracao/tipocontacto) — Tipos de contacto\n• Língua (/configuracao/lingua) — Idiomas\n• Nível Linguístico (/configuracao/nivellinguistico) — Níveis de proficiência\n• Nível de Escolaridade (/configuracao/nivelescolaridade) — Níveis de escolaridade\n• Categoria Profissional (/configuracao/categoriaprofissional) — Categorias profissionais\n• Profissão (/configuracao/profissao) — Profissões\n• Tipo de Cargo (/configuracao/tipocargo) — Tipos de cargo profissional'
            },
            {
                title: 'Tabelas de Entidades',
                content: '• Tipo de Entidade (/configuracao/tipoentidade) — Tipos de entidade (Casino, Empresa de Jogo, etc.)\n• Tipo de Banca (/configuracao/tipobanca) — Tipos de bancas de jogo\n• Tipo de Máquina (/configuracao/tipomaquina) — Tipos de máquinas de jogo\n• Tipo de Equipamento (/configuracao/tipoequipamento) — Tipos de equipamentos\n• Classificação de Equipamento (/configuracao/classificacaoequipamento) — Classificações\n• Tipologia (/configuracao/tipologia) — Tipologias gerais'
            },
            {
                title: 'Tabelas de Processos',
                content: '• Tipo de Decisão (/configuracao/tipodecisao) — Tipos de decisão processual\n• Tipo de Parecer (/configuracao/tipoparecer) — Tipos de parecer\n• Tipo de Origem (/configuracao/tipoorigem) — Origens dos processos\n• Tipo de Evento (/configuracao/tipoevento) — Tipos de eventos\n• Infração (/configuracao/infracao) — Tipos de infração\n• Coima (/configuracao/coima) — Valores de coima\n• Motivo de Exclusão (/configuracao/motivoexclusao) — Motivos para exclusão/interdição\n• Período de Exclusão (/configuracao/exclusaoperiodo) — Períodos (com número de dias)\n• Peças Processuais (/configuracao/pecasprocessuais) — Tipos de peças e campos\n• Status (/configuracao/status) — Estados gerais\n• Campos (/configuracao/campos) — Campos dinâmicos para peças processuais'
            },
            {
                title: 'Tabelas Financeiras',
                content: '• Divisas (/configuracao/divisas) — Moedas/divisas\n• Banco (/configuracao/banco) — Instituições bancárias\n• Meio de Pagamento (/configuracao/meiopagamento) — Meios de pagamento\n• Modalidade de Pagamento (/configuracao/modalidadepagamento) — Modalidades\n• Taxa Casino (/configuracao/taxacasino) — Taxas aplicáveis a casinos\n• Projetos (/configuracao/projetos) — Projetos orçamentais\n• Rubricas (/configuracao/rubricas) — Rubricas orçamentais'
            },
            {
                title: 'Predefinições',
                content: 'Caminho: Configuração > Predefinições > Tempo Limite Decisão (/configuracao/predefinicoes/tempolimitedecisao)\n\nPermite definir o tempo limite para decisão em processos administrativos (prazo de prescrição). O sistema monitoriza automaticamente os processos que ultrapassam o prazo.'
            }
        ]
    },
    {
        id: 'administracao',
        title: 'Administração',
        icon: 'fas fa-shield-alt',
        color: '#FC6180',
        description: 'Gestão de utilizadores, perfis, permissões e estrutura de menus do sistema. Acessível apenas a utilizadores com permissões administrativas (perfil Super Admin ou Administrador).',
        subsections: [
            {
                title: 'Gestão de Utilizadores',
                content: 'Caminho: Administração > Utilizadores (/administracao/utilizador)\n\nA página apresenta a lista de todos os utilizadores numa tabela com: Foto, Nome, Utilizador, Perfil, Estado e Ações.\n\nConsultar: Caixa de pesquisa para filtrar. Seletor Mostrar para entradas por página. Paginação e ordenação por cabeçalhos.\n\nCriar Utilizador:\n1. Clique em Adicionar (ícone +).\n2. Preencha: Foto Perfil, Notificações (interruptor), Nome, Utilizador, Perfil e Password.\n3. Clique em Guardar.\n\nEditar: Ícone de edição na coluna Ações. Altere os campos (exceto código) e Guardar.\n\nAtivar/Desativar: Interruptor na coluna Estado.\n\nEliminar: Ícone de eliminação (vermelho) e confirmar.\n\nVisualizar: Ícone de visualização para modo somente leitura.'
            },
            {
                title: 'Gestão de Perfis',
                content: 'Caminho: Administração > Perfil (/administracao/perfil)\n\nOs perfis definem os níveis de acesso dos utilizadores. Código gerado automaticamente.\n\nCriar:\n1. Clique em Adicionar.\n2. Preencha: Designação (obrigatório, máx. 256 caracteres) e Descrição (máx. 64.000 caracteres).\n3. Guardar.\n\nEditar: Ícone de edição, altere e Guardar.\n\nEliminar: Ícone de eliminação e confirmar. Perfis associados a utilizadores não podem ser eliminados.'
            },
            {
                title: 'Gestão de Permissões',
                content: 'Caminho: Administração > Permissões (/administracao/permissoes)\n\nPermite atribuir ou remover acessos a menus e funcionalidades para cada perfil.\n\n1. Selecione o Perfil na lista pendente no topo.\n2. O sistema apresenta a árvore completa de menus.\n3. Cada item possui caixa de seleção: Marcado = acesso; Desmarcado = sem acesso.\n4. A alteração é gravada automaticamente.\n5. Utilize + e - para expandir ou recolher sub-menus.'
            },
            {
                title: 'Gestão de Menus',
                content: 'Caminho: Administração > Menu (/administracao/menu)\n\nPermite gerir a estrutura de menus do sistema (destinado a utilizadores técnicos). Adicionar, reordenar e configurar itens com grupos, subgrupos e itens.'
            },
            {
                title: 'Ações de Menu',
                content: 'Caminho: Administração > Ações Menu (/administracao/accoesmenu)\n\nPermite gerir as ações disponíveis para cada item de menu (Criar, Ler, Editar, Eliminar, entre outras). Usadas pelo sistema de permissões para controlo de acesso granular.'
            }
        ]
    },
    {
        id: 'financeiro',
        title: 'Módulo Financeiro',
        icon: 'fas fa-coins',
        color: '#C5A55A',
        description: 'Gestão de todos os aspetos financeiros: contrapartidas, contribuições, impostos, prémios e orçamento.',
        subsections: [
            {
                title: 'Contrapartidas',
                content: 'Valores devidos pelas entidades de jogo ao Estado.\n\nA tabela apresenta: Valor bruto, Artigo 48 (% e valor), Artigo 49 (% e valor) e Total a receber. Filtro por Ano. Totais automáticos.\n\nRegistar:\n1. Clique em Adicionar.\n2. Preencha: Entidade, Período, Valor bruto e Percentagens.\n3. Guardar.\n\nPagamento: Abra a contrapartida, clique em Pagamento, preencha Valor pago, Data, Meio de pagamento e Comprovativo. Guardar.\n\nExportação: PDF ou Excel.'
            },
            {
                title: 'Contribuições',
                content: 'Contribuições fiscais devidas pelas entidades de jogo.\n\nAceda à secção dentro dos detalhes da entidade. Visualize a lista, filtre por ano.\n\nRegistar: Clique em Adicionar, preencha entidade, período e valor. Guardar.\n\nPagamento: Abra a contribuição, registe valor pago, data e meio de pagamento.\n\nExportação: PDF ou CSV.'
            },
            {
                title: 'Impostos',
                content: 'Impostos sobre o jogo devidos pelas entidades.\n\nVisualizar: Lista com valores por entidade e período.\n\nParametrização: Configure taxas aplicáveis por tipo de jogo/entidade.\n\nPagamento: Registe com os mesmos campos das demais obrigações.\n\nExportação: PDF ou CSV.'
            },
            {
                title: 'Prémios',
                content: 'Prémios pagos pelas entidades aos jogadores.\n\nVisualizar: Lista com valores, datas e beneficiários. Filtre por ano ou pesquise.\n\nRegistar: Clique em Adicionar, preencha entidade, valor, beneficiário e data. Guardar.\n\nExportação: PDF ou CSV.'
            },
            {
                title: 'Orçamento',
                content: 'Caminho: Entidade > Orçamento (/entidade/orcamento)\n\nOrçamento da IGJ, organizado por projetos e rubricas.\n\nColunas: Orçamento Inicial, Corrigido, Disponível, Cabimentado (valor e %), Pago (valor e %) e Saldo Disponível.\nFiltros: Projeto e Ano. Totais automáticos.\n\nRubricas: Selecione projeto e ano, adicione/edite rubricas.\n\nCabimentação: Abra a rubrica, clique em Cabimentar, preencha valor e descrição. Guardar.\n\nPagamento: Abra o cabimento, registe com data, valor e comprovativo.\n\nExportação: PDF ou CSV.'
            }
        ]
    },
    {
        id: 'casos-suspeitos',
        title: 'Casos Suspeitos',
        icon: 'fas fa-exclamation-triangle',
        color: '#F39C12',
        description: 'Prevenção e combate ao branqueamento de capitais e financiamento do terrorismo.',
        subsections: [
            {
                title: 'Consultar Casos Suspeitos',
                content: 'Acessíveis dentro dos detalhes de cada entidade.\n\n1. Aceda aos detalhes da entidade.\n2. Selecione a secção Casos Suspeitos.\n3. A tabela apresenta a lista de casos.\n4. Filtre por data ou pesquise por texto.'
            },
            {
                title: 'Registar Caso Suspeito',
                content: '1. Clique em Adicionar.\n2. Preencha: Pessoa envolvida, Descrição da atividade suspeita, Data da ocorrência, Valor envolvido e Documentos de suporte.\n3. Clique em Guardar.'
            },
            {
                title: 'Gerar Comunicado',
                content: '1. Abra o caso suspeito pretendido.\n2. Clique em Gerar Comunicado.\n3. O sistema gera automaticamente o documento de comunicação em PDF.\n\nExportação: Lista exportável em PDF ou CSV.'
            }
        ]
    },
    {
        id: 'notificacoes',
        title: 'Notificações',
        icon: 'fas fa-bell',
        color: '#4099FF',
        description: 'Sistema de notificações em tempo real que informa os utilizadores sobre eventos e ações relevantes.',
        subsections: [
            {
                title: 'Tipos de Notificação',
                content: '• Notificações do Sistema — Geradas automaticamente (processo atribuído, despacho emitido, prazo a expirar).\n• Notificações por Email — Enviadas automaticamente com documentos PDF quando aplicável.'
            },
            {
                title: 'Consultar Notificações',
                content: '1. Clique no ícone de sino no cabeçalho para ver as mais recentes.\n2. Para ver todas, aceda a /notificacoes.\n3. A lista apresenta: Foto do remetente, Mensagem, Data/hora e Link para o registo.\n4. Clique numa notificação para aceder ao registo relacionado.\n\nAs notificações são automaticamente marcadas como lidas quando consultadas.'
            },
            {
                title: 'Configurar Notificações',
                content: 'Na edição do seu perfil de utilizador, ative ou desative a receção de notificações através do interruptor Notificações.'
            }
        ]
    },
    {
        id: 'funcionalidades',
        title: 'Funcionalidades Transversais',
        icon: 'fas fa-tools',
        color: '#636E72',
        description: 'Funcionalidades comuns a todo o sistema: pesquisa, exportação, ordenação, paginação, upload e editor de texto.',
        subsections: [
            {
                title: 'Pesquisa e Filtragem',
                content: '• Caixa de pesquisa global — No canto superior direito da tabela. Pesquisa em todas as colunas visíveis simultaneamente.\n• Filtros específicos — Algumas páginas disponibilizam filtros adicionais (ano, estado, data, etc.) acima da tabela.'
            },
            {
                title: 'Exportação de Dados',
                content: 'PDF: Localize o seletor de download, selecione PDF. O ficheiro abre numa nova janela.\n\nExcel/CSV: Selecione Excel ou CSV no seletor. O ficheiro é descarregado automaticamente.\n\nNota: Os ficheiros refletem os filtros ativos no momento da exportação.'
            },
            {
                title: 'Ordenação e Paginação',
                content: 'Ordenação: Clique no cabeçalho de qualquer coluna. Clique novamente para inverter a ordem.\n\nPaginação: Seletor Mostrar (5, 10, 20, 30, 40 ou 50 entradas). Botões: Primeira, Anterior, Próxima, Última. Campo Ir para a página. Indicador "Página X de Y".'
            },
            {
                title: 'Upload de Documentos',
                content: '1. Clique no campo ou botão de upload.\n2. Selecione o(s) ficheiro(s).\n3. Aguarde o upload (armazenamento na nuvem).\n4. Os documentos ficam associados ao registo.\n\nFormatos aceites: PDF, imagens (JPG, PNG), documentos Office e outros formatos comuns.'
            },
            {
                title: 'Editor de Texto Rico',
                content: 'Editor WYSIWYG para despachos, observações e pareceres. Permite:\n• Formatação (negrito, itálico, sublinhado)\n• Listas numeradas e com marcadores\n• Alinhamento de texto\n• Inserção de tabelas\n• Copiar e colar de outros documentos'
            },
            {
                title: 'Auditoria',
                content: 'Caminho: Entidade > Auditoria (/entidade/auditoria)\n\nRegisto automático de todas as operações (criação, edição, eliminação).\n\nPermite consultar: Quem realizou a ação, Quando foi realizada e Que dados foram alterados.\n\nO registo é imutável e não pode ser alterado ou eliminado.'
            }
        ]
    },
    {
        id: 'perfis-permissoes',
        title: 'Perfis e Permissões',
        icon: 'fas fa-users-cog',
        color: '#1B4965',
        description: 'Sistema de permissões baseado em perfis. Cada utilizador é associado a um perfil que determina os seus acessos.',
        subsections: [
            {
                title: 'Perfis Pré-definidos',
                content: '• Super Admin — Acesso total. Pode gerir utilizadores, perfis, permissões e todas as configurações.\n\n• Administrador — Acesso abrangente. Administração, Configuração e todos os módulos operacionais.\n\n• Gabinete — Participa na gestão de processos e eventos. Dashboard, Processos (consulta e edição), Eventos, Entidades.\n\n• Inspetor — Pode instaurar processos e emitir despachos. Dashboard, Processos (gestão completa), Entidades, Eventos.\n\n• Instrutor — Conduz a fase de instrução. Processos (instrução), Peças processuais.\n\n• Entidade — Utilizador externo, acesso limitado aos dados da sua entidade.'
            },
            {
                title: 'Ações por Página',
                content: 'Para cada funcionalidade, um perfil pode ter:\n\n• Ler — Visualizar registos.\n• Criar — Adicionar novos registos.\n• Editar — Alterar registos existentes.\n• Eliminar — Remover registos.\n• Atribuir — Atribuir permissões (apenas na página de Permissões).'
            },
            {
                title: 'Comportamento do Sistema',
                content: '• Sem permissão para uma página: redirecionamento automático para a página principal.\n• Botões de ação (Adicionar, Editar, Eliminar) só visíveis com a permissão correspondente.\n• As secções do Dashboard são apresentadas conforme as permissões do perfil.'
            }
        ]
    },
    {
        id: 'faq',
        title: 'Perguntas Frequentes',
        icon: 'fas fa-question-circle',
        color: '#2ED8B6',
        description: 'Respostas às perguntas mais frequentes sobre o SGIGJ.',
        subsections: [
            {
                title: 'Acesso e Autenticação',
                content: 'P: Esqueci a minha palavra-passe. Como posso recuperá-la?\nR: Contacte o Administrador do Sistema para reposição da palavra-passe.\n\nP: A minha sessão foi bloqueada. O que devo fazer?\nR: Introduza a sua palavra-passe no ecrã de bloqueio. Se persistir, termine a sessão e inicie uma nova.\n\nP: Não consigo aceder a uma página específica.\nR: O acesso depende do perfil e das permissões. Contacte o Administrador do Sistema.'
            },
            {
                title: 'Processos',
                content: 'P: Como sei o estado atual de um processo?\nR: O estado é indicado por cores/etiquetas. Ativos na página Exclusão/Interdição, finalizados, arquivados e prescritos nas respetivas páginas.\n\nP: Posso recuperar um processo finalizado por engano?\nR: Sim, através da funcionalidade Resgatar na lista de finalizados.\n\nP: Como funciona a prescrição?\nR: O sistema monitoriza automaticamente o prazo nas Predefinições. Quando ultrapassado, o processo move para Prescritos.\n\nP: Como gero o PDF de um despacho?\nR: O sistema gera automaticamente ao emitir o despacho. Use Gerar texto para pré-preencher.'
            },
            {
                title: 'Entidades e Financeiro',
                content: 'P: Como registo um pagamento?\nR: Aceda aos detalhes da entidade, selecione a secção financeira, localize o registo e clique em Pagamento.\n\nP: Como exporto um relatório financeiro?\nR: Utilize o seletor de download em qualquer página de listagem financeira.'
            },
            {
                title: 'Notificações',
                content: 'P: Não estou a receber notificações.\nR: Verifique se o interruptor de Notificações está ativo na edição do seu utilizador.'
            }
        ]
    },
    {
        id: 'glossario',
        title: 'Glossário',
        icon: 'fas fa-book',
        color: '#8E44AD',
        description: 'Definição dos termos técnicos e siglas utilizados no SGIGJ.',
        subsections: [
            {
                title: 'Termos A–E',
                content: '• Auto de Exclusão — Documento que inicia formalmente o processo de exclusão/interdição.\n• Auto-Exclusão — Pedido voluntário para ser impedido de aceder a salas de jogo.\n• Banca — Mesa de jogo de casino (roleta, blackjack, poker).\n• Cabimentação — Reserva de dotação orçamental para despesa futura.\n• Coima — Sanção pecuniária por infração administrativa.\n• Contrapartida — Valor devido pelas entidades ao Estado.\n• Contra-Ordenação — Procedimento por violação de normas.\n• Despacho — Decisão formal da autoridade competente.\n• Entidade — Empresa que explora atividades de jogo.\n• Exclusão — Impedimento de acesso às salas de jogo.'
            },
            {
                title: 'Termos H–P',
                content: '• Handpay — Pagamento manual de prémios de valor elevado.\n• IGJ — Inspeção Geral de Jogos de Cabo Verde.\n• Instrução — Fase de recolha de provas e produção de peças processuais.\n• Instrutor — Funcionário nomeado para conduzir a instrução.\n• Interdição — Proibição de acesso às salas de jogo.\n• Juntada — Compilação de todos os documentos num único ficheiro.\n• KPI — Key Performance Indicator.\n• Peça Processual — Documento produzido durante a instrução.\n• Perfil — Conjunto de permissões de um utilizador.\n• Prescrição — Extinção por decurso do prazo legal.'
            },
            {
                title: 'Termos R–V',
                content: '• Rubrica — Linha do orçamento que especifica a natureza de receita ou despesa.\n• SGIGJ — Sistema Integrado de Gestão da Inspeção Geral de Jogos.\n• Visado — Pessoa sobre quem recai um processo.'
            }
        ]
    },
    {
        id: 'contactos',
        title: 'Contactos e Suporte',
        icon: 'fas fa-headset',
        color: '#E74C3C',
        description: 'Informações de contacto e suporte técnico para o SGIGJ.',
        subsections: [
            {
                title: 'Suporte Técnico',
                content: 'Para questões técnicas ou de utilização do sistema, contacte:\n\nAdministração do Sistema SGIGJ\nInspeção Geral de Jogos de Cabo Verde\n\nEm caso de dificuldades de acesso, problemas técnicos ou sugestões de melhoria, dirija-se ao Administrador do Sistema ou utilize os canais internos de comunicação da IGJ.'
            },
            {
                title: 'Página de Ajuda',
                content: 'O SGIGJ disponibiliza esta página de ajuda integrada, acessível através do menu Ajuda (/ajuda).\n\nPara questões não contempladas neste manual, contacte o Administrador do Sistema.'
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
