/**
 * Configuracao de icones e agrupamento do sidebar.
 * Usa Font Awesome 5 (ja carregado no CSS).
 */

// Mapa de URL → { icon, color } para override de icones em todo o sidebar
export const ICON_OVERRIDES = {
  // ── Dashboard & Notificacoes ──
  '/dashboard': { icon: 'fas fa-tachometer-alt', color: '#4680FF' },
  '/notificacoes': { icon: 'fas fa-bell', color: '#FFB64D' },

  // ── Administracao ──
  '/administracao/accoesmenu': { icon: 'fas fa-mouse-pointer', color: '#FC6180' },
  '/administracao/menu': { icon: 'fas fa-bars', color: '#FC6180' },
  '/administracao/perfil': { icon: 'fas fa-id-badge', color: '#FC6180' },
  '/administracao/utilizador': { icon: 'fas fa-user-cog', color: '#FC6180' },
  '/administracao/permissoes': { icon: 'fas fa-lock', color: '#FC6180' },

  // ── Entidades ──
  '/entidades/entidades': { icon: 'fas fa-building', color: '#93BE52' },
  '/entidades/pessoas': { icon: 'fas fa-users', color: '#93BE52' },
  '/entidades/igj': { icon: 'fas fa-landmark', color: '#93BE52' },
  '/entidade/orcamento': { icon: 'fas fa-wallet', color: '#93BE52' },
  '/entidade/auditoria': { icon: 'fas fa-clipboard-check', color: '#93BE52' },
  '/entidade/visaogeral': { icon: 'fas fa-chart-pie', color: '#93BE52' },

  // ── Eventos ──
  '/eventos/aprovados': { icon: 'fas fa-calendar-check', color: '#69CEC6' },
  '/eventos/eventospedidos': { icon: 'fas fa-calendar-plus', color: '#69CEC6' },
  '/eventos/recusados': { icon: 'fas fa-calendar-times', color: '#69CEC6' },

  // ── Processos ──
  '/processos/autoexclusao': { icon: 'fas fa-user-slash', color: '#AB7DF6' },
  '/processos/handpay': { icon: 'fas fa-hand-holding-usd', color: '#AB7DF6' },
  '/processos/exclusaofinalizado': { icon: 'fas fa-check-circle', color: '#AB7DF6' },
  '/processos/exclusaointerdicao': { icon: 'fas fa-ban', color: '#AB7DF6' },
  '/processos/exclusao/arquivados': { icon: 'fas fa-archive', color: '#AB7DF6' },
  '/processos/exclusao/finalizado': { icon: 'fas fa-flag-checkered', color: '#AB7DF6' },

  // ── Configuracao: Pessoas ──
  '/configuracao/estadocivil': { icon: 'fas fa-ring', color: '#4680FF' },
  '/configuracao/genero': { icon: 'fas fa-venus-mars', color: '#4680FF' },
  '/configuracao/lingua': { icon: 'fas fa-language', color: '#4680FF' },
  '/configuracao/nivellinguistico': { icon: 'fas fa-graduation-cap', color: '#4680FF' },
  '/configuracao/nivelescolaridade': { icon: 'fas fa-school', color: '#4680FF' },
  '/configuracao/profissao': { icon: 'fas fa-briefcase', color: '#4680FF' },
  '/configuracao/categoriaprofissional': { icon: 'fas fa-user-tag', color: '#4680FF' },
  '/configuracao/tipocargo': { icon: 'fas fa-user-tie', color: '#4680FF' },
  '/configuracao/tipocontacto': { icon: 'fas fa-phone-alt', color: '#4680FF' },

  // ── Configuracao: Entidades ──
  '/configuracao/tipoentidade': { icon: 'fas fa-sitemap', color: '#FC6180' },
  '/configuracao/tipologia': { icon: 'fas fa-layer-group', color: '#FC6180' },
  '/configuracao/tipobanca': { icon: 'fas fa-dice', color: '#FC6180' },
  '/configuracao/classificacaoequipamento': { icon: 'fas fa-tools', color: '#FC6180' },
  '/configuracao/tipoequipamento': { icon: 'fas fa-hdd', color: '#FC6180' },
  '/configuracao/tipomaquina': { icon: 'fas fa-server', color: '#FC6180' },

  // ── Configuracao: Financeiro ──
  '/configuracao/meiopagamento': { icon: 'fas fa-credit-card', color: '#93BE52' },
  '/configuracao/modalidadepagamento': { icon: 'fas fa-money-check-alt', color: '#93BE52' },
  '/configuracao/divisas': { icon: 'fas fa-exchange-alt', color: '#93BE52' },
  '/configuracao/banco': { icon: 'fas fa-university', color: '#93BE52' },
  '/configuracao/taxacasino': { icon: 'fas fa-percentage', color: '#93BE52' },

  // ── Configuracao: Processos ──
  '/configuracao/pecasprocessuais': { icon: 'fas fa-file-alt', color: '#FFB64D' },
  '/configuracao/campos': { icon: 'fas fa-clipboard-list', color: '#FFB64D' },
  '/configuracao/infracao': { icon: 'fas fa-exclamation-triangle', color: '#FFB64D' },
  '/configuracao/coima': { icon: 'fas fa-file-invoice-dollar', color: '#FFB64D' },
  '/configuracao/exclusaoperiodo': { icon: 'fas fa-calendar-minus', color: '#FFB64D' },
  '/configuracao/motivoexclusao': { icon: 'fas fa-ban', color: '#FFB64D' },
  '/configuracao/tipodecisao': { icon: 'fas fa-balance-scale', color: '#FFB64D' },
  '/configuracao/tipoparecer': { icon: 'fas fa-comment-dots', color: '#FFB64D' },
  '/configuracao/tipoorigem': { icon: 'fas fa-map-marker-alt', color: '#FFB64D' },
  '/configuracao/tipoevento': { icon: 'fas fa-calendar-day', color: '#FFB64D' },
  '/configuracao/status': { icon: 'fas fa-tasks', color: '#FFB64D' },

  // ── Configuracao: Geral ──
  '/configuracao/tipodocumento': { icon: 'fas fa-folder-open', color: '#69CEC6' },
  '/configuracao/projetos': { icon: 'fas fa-project-diagram', color: '#69CEC6' },
  '/configuracao/rubricas': { icon: 'fas fa-receipt', color: '#69CEC6' },
  '/configuracao/predefinicoes/tempolimitedecisao': { icon: 'fas fa-clock', color: '#69CEC6' },

  // ── Ajuda ──
  '/ajuda': { icon: 'fas fa-question-circle', color: '#4680FF' },
};

// Mapa de titulo → { icon, color } para menus pai (collapses) sem URL unico
export const COLLAPSE_OVERRIDES = {
  'administração': { icon: 'fas fa-shield-alt', color: '#FC6180' },
  'administracao': { icon: 'fas fa-shield-alt', color: '#FC6180' },
  'configuração': { icon: 'fas fa-sliders-h', color: '#69CEC6' },
  'configuracao': { icon: 'fas fa-sliders-h', color: '#69CEC6' },
  'entidades': { icon: 'fas fa-building', color: '#93BE52' },
  'eventos': { icon: 'fas fa-calendar-alt', color: '#69CEC6' },
  'processos': { icon: 'fas fa-gavel', color: '#AB7DF6' },
  'casinos': { icon: 'fas fa-dice', color: '#d4a843' },
  'base dados': { icon: 'fas fa-database', color: '#4680FF' },
  'igj': { icon: 'fas fa-landmark', color: '#93BE52' },
  'autoexclusão': { icon: 'fas fa-user-slash', color: '#AB7DF6' },
  'autoexclusao': { icon: 'fas fa-user-slash', color: '#AB7DF6' },
  'handpay': { icon: 'fas fa-hand-holding-usd', color: '#FFB64D' },
  'exclusão finalizado': { icon: 'fas fa-check-double', color: '#AB7DF6' },
  'exclusao finalizado': { icon: 'fas fa-check-double', color: '#AB7DF6' },
  'exclusão interdição': { icon: 'fas fa-ban', color: '#FC6180' },
  'exclusao interdicao': { icon: 'fas fa-ban', color: '#FC6180' },
  'arquivados': { icon: 'fas fa-archive', color: '#999' },
  'notificações': { icon: 'fas fa-bell', color: '#FFB64D' },
  'notificacoes': { icon: 'fas fa-bell', color: '#FFB64D' },
  'pessoas': { icon: 'fas fa-users', color: '#4680FF' },
  'tipo': { icon: 'fas fa-tags', color: '#FC6180' },
  'nível': { icon: 'fas fa-layer-group', color: '#4680FF' },
  'nivel': { icon: 'fas fa-layer-group', color: '#4680FF' },
  'predefinições': { icon: 'fas fa-cog', color: '#69CEC6' },
  'predefinicoes': { icon: 'fas fa-cog', color: '#69CEC6' },
  'ajuda': { icon: 'fas fa-question-circle', color: '#4680FF' },
};

// Mapa de titulo → { icon, color } para grupos (section headers)
export const GROUP_OVERRIDES = {
  'sigigj': { icon: 'fas fa-home', color: '#4680FF' },
  'sistema': { icon: 'fas fa-cogs', color: '#FC6180' },
  'gestão': { icon: 'fas fa-briefcase', color: '#93BE52' },
  'gestao': { icon: 'fas fa-briefcase', color: '#93BE52' },
};

// Sub-grupos para reorganizar o menu Configuracoes
export const CONFIGURACOES_SUBGROUPS = [
  {
    id: 'config-sub-pessoas',
    title: 'Pessoas',
    icon: 'fas fa-users',
    iconColor: '#4680FF',
    urls: [
      '/configuracao/estadocivil',
      '/configuracao/genero',
      '/configuracao/lingua',
      '/configuracao/nivellinguistico',
      '/configuracao/nivelescolaridade',
      '/configuracao/profissao',
      '/configuracao/categoriaprofissional',
      '/configuracao/tipocargo',
      '/configuracao/tipocontacto',
    ]
  },
  {
    id: 'config-sub-entidades',
    title: 'Entidades',
    icon: 'fas fa-building',
    iconColor: '#FC6180',
    urls: [
      '/configuracao/tipoentidade',
      '/configuracao/tipologia',
      '/configuracao/tipobanca',
      '/configuracao/classificacaoequipamento',
      '/configuracao/tipoequipamento',
      '/configuracao/tipomaquina',
    ]
  },
  {
    id: 'config-sub-financeiro',
    title: 'Financeiro',
    icon: 'fas fa-coins',
    iconColor: '#93BE52',
    urls: [
      '/configuracao/meiopagamento',
      '/configuracao/modalidadepagamento',
      '/configuracao/divisas',
      '/configuracao/banco',
      '/configuracao/taxacasino',
    ]
  },
  {
    id: 'config-sub-processos',
    title: 'Processos',
    icon: 'fas fa-gavel',
    iconColor: '#FFB64D',
    urls: [
      '/configuracao/pecasprocessuais',
      '/configuracao/campos',
      '/configuracao/infracao',
      '/configuracao/coima',
      '/configuracao/exclusaoperiodo',
      '/configuracao/motivoexclusao',
      '/configuracao/tipodecisao',
      '/configuracao/tipoparecer',
      '/configuracao/tipoorigem',
      '/configuracao/tipoevento',
      '/configuracao/status',
    ]
  },
  {
    id: 'config-sub-geral',
    title: 'Geral',
    icon: 'fas fa-cogs',
    iconColor: '#69CEC6',
    urls: [
      '/configuracao/tipodocumento',
      '/configuracao/projetos',
      '/configuracao/rubricas',
      '/configuracao/predefinicoes/tempolimitedecisao',
    ]
  },
];
