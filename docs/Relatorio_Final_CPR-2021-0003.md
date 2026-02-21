# RELATORIO FINAL DE PROJECTO

## Sistema de Gestao da Inspeccao Geral de Jogos (SGIGJ)

---

| | |
|---|---|
| **Contrato:** | CPR-2021-0003 |
| **Entidade Contratante:** | Inspeccao Geral de Jogos de Cabo Verde (IGJ) |
| **Entidade Contratada:** | Cloud Technology, S.A. |
| **Valor do Contrato:** | 1.728.450 CVE (Um milhao, setecentos e vinte e oito mil, quatrocentos e cinquenta escudos cabo-verdianos) |
| **Data do Relatorio:** | 20 de Fevereiro de 2026 |
| **Classificacao:** | Documento Final de Entrega |

---

## INDICE

1. [Sumario Executivo](#1-sumario-executivo)
2. [Ambito do Projecto](#2-ambito-do-projecto)
3. [Modulos Entregues](#3-modulos-entregues)
4. [Matriz de Conformidade Contratual](#4-matriz-de-conformidade-contratual)
5. [Arquitectura Tecnica](#5-arquitectura-tecnica)
6. [Testes Realizados](#6-testes-realizados)
7. [Formacao e Documentacao](#7-formacao-e-documentacao)
8. [Recomendacoes e Proximos Passos](#8-recomendacoes-e-proximos-passos)
9. [Conclusao](#9-conclusao)

---

## 1. Sumario Executivo

O presente relatorio documenta a conclusao do projecto de desenvolvimento do **Sistema de Gestao da Inspeccao Geral de Jogos (SGIGJ)**, realizado no ambito do contrato CPR-2021-0003, celebrado entre a Inspeccao Geral de Jogos de Cabo Verde (IGJ) e a Cloud Technology, S.A.

O SGIGJ e uma plataforma web concebida para digitalizar e automatizar os processos operacionais, administrativos e financeiros da IGJ, abrangendo a gestao de entidades do sector do jogo, processos administrativos (exclusao, interdicao, auto-exclusao), eventos, contribuicoes fiscais, impostos, premios, orcamento, contrapartidas e casos suspeitos no ambito da prevencao do branqueamento de capitais.

O sistema foi integralmente desenvolvido e entregue em conformidade com os 8 (oito) modulos contratualizados, compreendendo:

- **8 modulos funcionais** completos e operacionais;
- **34 ecras de configuracao parametrica**, garantindo flexibilidade e autonomia na gestao do sistema;
- **41 pecas processuais** (templates de documentos legais) com sistema de formularios dinamicos;
- **6 perfis de utilizador** com permissoes granulares;
- **12 graficos analitticos** no dashboard com KPIs em tempo real;
- Geracao automatica de **documentos PDF** e exportacao de dados em **CSV/PDF**;
- Sistema de **notificacoes em tempo real** (plataforma e email);
- **Trilha de auditoria** completa para todas as operacoes;
- Infraestrutura alojada integralmente no **Google Cloud Platform**.

A entrega cumpre na integralidade o ambito contratual definido, estando o sistema em pleno funcionamento no ambiente de producao.

---

## 2. Ambito do Projecto

### 2.1 Objectivo Geral

Desenvolver uma plataforma web integrada que permita a IGJ gerir de forma eficiente, transparente e segura todas as suas actividades regulatorias sobre o sector do jogo em Cabo Verde, substituindo processos manuais e fragmentados por um sistema digital centralizado.

### 2.2 Objectivos Especificos

1. Implementar um sistema de gestao de utilizadores com controlo de acesso baseado em perfis e permissoes granulares;
2. Criar um modulo de configuracao parametrica que confira autonomia a IGJ na gestao de dados de referencia;
3. Digitalizar a gestao de entidades do sector do jogo (casinos, empresas, colaboradores, equipamentos);
4. Automatizar o ciclo de vida completo dos processos administrativos (exclusao/interdicao, auto-exclusao, handpay);
5. Gerir eventos promovidos por entidades do sector, incluindo pedidos, pareceres e decisoes;
6. Implementar a gestao financeira integrada (contribuicoes, impostos, premios, orcamento, contrapartidas);
7. Disponibilizar um dashboard analitico com KPIs financeiros e operacionais;
8. Implementar um sistema de notificacoes em tempo real e gestao de casos suspeitos.

### 2.3 Escopo Contratual

O contrato CPR-2021-0003 define a entrega de 8 modulos funcionais:

| N. | Modulo | Descricao Sumaria |
|----|--------|-------------------|
| 1 | Administracao | Gestao de utilizadores, perfis, permissoes e menus |
| 2 | Configuracao | Gestao de dados parametricos (40+ tabelas de configuracao) |
| 3 | Entidades | Gestao de entidades e pessoas (casinos, empresas, colaboradores) |
| 4 | Eventos | Gestao de eventos (pedidos, aprovacoes, recusas) |
| 5 | Processos | Ciclo de vida completo de processos (auto-exclusao, exclusao/interdicao, reclamacoes, infracoes, handpay) |
| 6 | Financeiro | Gestao financeira (contribuicoes, impostos, premios, orcamento, contrapartidas) |
| 7 | Dashboard | KPIs e analises em tempo real |
| 8 | Notificacoes | Notificacoes do sistema, email e gestao de casos suspeitos |

---

## 3. Modulos Entregues

### 3.1 Modulo de Administracao

O Modulo de Administracao constitui a base de gestao de acessos e seguranca do SGIGJ. Permite o controlo total sobre quem acede ao sistema e quais operacoes cada utilizador pode executar.

**Funcionalidades implementadas:**

- **Gestao de Utilizadores** -- Criacao, edicao, activacao/desactivacao de contas de utilizador, incluindo associacao a perfis e entidades. Suporte a alteracao de palavra-passe pelo proprio utilizador e pelo administrador.
- **Gestao de Perfis** -- Definicao de 6 perfis de utilizador (Inspector Geral, Inspector, Tecnico, Administrativo, Entidade, Super Administrador), cada um com um conjunto distinto de permissoes.
- **Gestao de Permissoes** -- Sistema granular de permissoes por menu e accao (Criar, Ler, Editar, Eliminar), permitindo configurar o acesso a cada funcionalidade do sistema por perfil.
- **Gestao de Menus** -- Configuracao dinamica da estrutura de menus do sistema, incluindo hierarquia, icones, URLs e visibilidade por perfil.
- **Accoes de Menu** -- Gestao das accoes disponiveis em cada ecra (botoes de accao), configuravel por perfil.
- **Trilha de Auditoria** -- Registo automatico de todas as operacoes realizadas no sistema (criacao, edicao, eliminacao), com identificacao do utilizador, data/hora e entidade afectada.

**Ecras implementados:** Utilizadores, Perfis, Permissoes, Menus, Accoes de Menu.

**Aspectos tecnicos:** Autenticacao via JWT (JSON Web Tokens), sessoes geridas pelo AdonisJS Auth, verificacao de permissoes em cada endpoint da API atraves da funcao `functionsDatabase.allowed()`.

### 3.2 Modulo de Configuracao

O Modulo de Configuracao permite a gestao autonoma dos dados parametricos que alimentam todo o sistema, conferindo flexibilidade para adaptacao a alteracoes regulatorias sem necessidade de intervencao tecnica.

**Tabelas de configuracao implementadas (34 ecras):**

| Categoria | Tabelas |
|-----------|---------|
| **Dados Pessoais** | Genero, Estado Civil, Nivel de Escolaridade, Profissao, Categoria Profissional, Linguas, Nivel Linguistico |
| **Entidades** | Tipo de Entidade, Tipologia, Tipo de Banca, Tipo de Maquina, Tipo de Equipamento, Classificacao de Equipamento, Taxa Casino |
| **Documentos e Contactos** | Tipo de Documento, Tipo de Contacto, Tipo de Cargo |
| **Processos** | Status, Tipo de Origem, Motivo de Exclusao, Periodo de Exclusao, Tipo de Decisao, Pecas Processuais, Campos de Pecas, Infracao, Coima |
| **Eventos** | Tipo de Evento, Tipo de Parecer |
| **Financeiro** | Banco, Divisas, Meio de Pagamento, Modalidade de Pagamento, Rubricas, Projectos |
| **Sistema** | Predefinicoes (Tempo Limite de Decisao) |

**Funcionalidades comuns a todos os ecras:** Listagem com paginacao, pesquisa e filtros; criacao, edicao e eliminacao de registos; validacao de dados; operacoes CRUD completas via API RESTful.

### 3.3 Modulo de Entidades

O Modulo de Entidades gere o cadastro completo de todas as entidades e pessoas envolvidas no sector do jogo em Cabo Verde.

**Funcionalidades implementadas:**

- **Gestao de Entidades** -- Registo e gestao de casinos, empresas de jogo e outras entidades reguladas. Cada entidade possui dados gerais, documentos, contactos e associacoes a pessoas.
- **Gestao de Pessoas** -- Cadastro de pessoas singulares associadas ao sector (colaboradores, directores, accionistas, visados em processos). Inclui dados pessoais, documentacao, contactos e linguas.
- **Colaboradores** -- Gestao dos funcionarios associados a cada entidade, com informacao de categoria profissional, cargo e periodo de actividade.
- **Grupos** -- Organizacao de entidades em grupos empresariais.
- **Bancas** -- Registo de bancas de jogo associadas a cada entidade, com tipologia e localizacao.
- **Maquinas** -- Cadastro de maquinas de jogo, com tipo, numero de serie e associacao a entidade.
- **Equipamentos** -- Registo de equipamentos de jogo, com classificacao, tipo e estado.
- **IGJ** -- Gestao da propria IGJ como entidade, incluindo orcamento proprio.
- **Exportacao** -- Exportacao de dados em formato PDF e CSV para todas as sub-seccoes.

**Ecras implementados:** Entidades (listagem e detalhe), Pessoas, Colaboradores, Grupos, Bancas, Maquinas, Equipamentos, IGJ, Orcamento IGJ.

### 3.4 Modulo de Eventos

O Modulo de Eventos gere o ciclo de vida completo dos eventos promovidos pelas entidades do sector do jogo, desde o pedido ate a decisao final.

**Funcionalidades implementadas:**

- **Pedidos de Evento** -- Submissao de pedidos por parte das entidades, com dados do evento, datas, documentacao e premios associados.
- **Pareceres** -- Emissao de pareceres tecnicos sobre os pedidos, com parametrizacao de criterios e texto configuravel.
- **Despachos** -- Registo dos despachos de decisao sobre os pedidos de evento.
- **Decisoes** -- Registo da decisao final (aprovacao ou recusa), com fundamentacao.
- **Eventos Aprovados** -- Listagem e gestao dos eventos aprovados.
- **Eventos Recusados** -- Listagem dos eventos cuja realizacao foi recusada, com motivos.
- **Premios de Eventos** -- Gestao dos premios associados a cada evento.
- **Exportacao** -- Exportacao de dados em formato PDF e CSV.

**Fluxo do processo:** Pedido -> Parecer -> Despacho -> Decisao (Aprovacao/Recusa).

### 3.5 Modulo de Processos

O Modulo de Processos constitui o nucleo operacional do SGIGJ, gerindo o ciclo de vida completo dos processos administrativos da IGJ. E o modulo de maior complexidade funcional e tecnica.

**Tipos de processo implementados:**

#### 3.5.1 Processo de Exclusao/Interdicao

Processo administrativo completo com as seguintes fases:

1. **Instauracao** -- Criacao do Auto de Exclusao com identificacao do visado, entidade, descricao dos factos e documentacao.
2. **Despacho Inicial** -- Emissao de despacho pelo Inspector Geral, nomeacao do instrutor e definicao de prazo. Gera PDF automatico e notifica o instrutor.
3. **Instrucao** -- Fase de investigacao conduzida pelo instrutor, com producao de pecas processuais, notificacoes, recolha de provas e diligencias.
4. **Interrupcao** -- Possibilidade de suspensao temporaria da instrucao, com registo de motivo e decisao sobre a retoma.
5. **Despacho Final** -- Decisao do Inspector Geral (exclusao com periodo, interdicao, arquivamento ou devolucao para instrucao). Gera PDF do despacho.
6. **Notificacao da Decisao** -- Notificacao formal do visado sobre a decisao, com geracao automatica de PDF e envio por email.
7. **Decisao Tutelar / Tribunal** -- Registo de decisoes de instancias superiores (recurso tutelar e recurso judicial).
8. **Juntada de Documentos** -- Compilacao automatica de todos os documentos do processo num unico PDF com capa.
9. **Termo de Encerramento** -- Encerramento formal do processo.
10. **Controlo de Prazos** -- Verificacao automatica de prazos de prescricao.

**Estados do processo:** Em Curso, Finalizado, Arquivado, Prescrito.

#### 3.5.2 Processo de Auto-Exclusao

Fluxo simplificado para pedidos voluntarios de exclusao:
- Registo do pedido de auto-exclusao;
- Despacho de aprovacao ou rejeicao;
- Geracao automatica de referencia sequencial;
- Exportacao em PDF e CSV.

#### 3.5.3 Handpay

Gestao de pagamentos manuais (handpay) em maquinas de jogo:
- Registo de handpay com dados da maquina, valor e entidade;
- Exportacao em PDF e CSV.

#### 3.5.4 Sistema de Pecas Processuais

O sistema de pecas processuais implementa um mecanismo dinamico de formularios configurados pela IGJ:

- **41 templates de documentos legais** configurados no sistema;
- **6 tipos de campos dinamicos:** Pessoa, Observacoes (editor de texto rico), Anexos, Destinatario, Infracao/Coima, Decisao;
- Geracao automatica de PDF para cada peca;
- Associacao de documentos e anexos a cada peca;
- Sistema de configuracao de pecas (ecra de administracao) com definicao de campos por tipo de peca.

#### 3.5.5 Reclamacoes

Gestao de reclamacoes associadas a processos de exclusao:
- Registo de reclamacoes com associacao a pecas processuais;
- Exportacao em PDF e CSV.

### 3.6 Modulo Financeiro

O Modulo Financeiro gere todas as vertentes financeiras da actividade regulatoria da IGJ.

**Funcionalidades implementadas:**

- **Contribuicoes Fiscais** -- Registo e gestao das contribuicoes devidas pelas entidades do sector, com controlo de pagamentos, valores, datas de vencimento e estado. Suporte a pagamentos parciais e multiplos.
- **Impostos** -- Gestao dos impostos sobre o jogo, com parametrizacao de taxas por tipo de imposto. Registo de pagamentos e controlo de valores em divida.
- **Premios** -- Registo de premios atribuidos em jogos, com controlo de valores, pagamentos e estado. Suporte a premios subsequentes.
- **Orcamento** -- Gestao orcamental da IGJ, com:
  - Projectos orcamentais;
  - Rubricas por projecto;
  - Cabimentacao de despesas;
  - Registo de despesas;
  - Controlo de execucao orcamental.
- **Contrapartidas** -- Gestao das contrapartidas devidas pelas entidades, com:
  - Parametrizacao por entidade;
  - Registo de pagamentos;
  - Controlo de estado e valores.
- **Visao Financeira Consolidada** -- Ecra de resumo financeiro que agrega dados de premios, impostos, contrapartidas e contribuicoes, com filtros por periodo e entidade.
- **Exportacao** -- Todos os sub-modulos financeiros suportam exportacao em PDF e CSV.

**Aspectos tecnicos:** O modulo financeiro utiliza valores em CVE (Escudo cabo-verdiano), com suporte a divisas configuradas no sistema. Todos os pagamentos sao registados com identificacao do meio de pagamento, modalidade, referencia bancaria e data.

### 3.7 Modulo de Dashboard

O Modulo de Dashboard disponibiliza uma visao analitica global do estado operacional e financeiro da IGJ, com dados actualizados em tempo real.

**KPIs implementados (7 indicadores):**

| KPI | Descricao |
|-----|-----------|
| Receita Bruta | Total acumulado de receitas (contribuicoes + impostos + contrapartidas) |
| Impostos | Total de impostos cobrados |
| Processos | Numero total de processos activos |
| Entidades | Numero de entidades registadas |
| Eventos | Numero de eventos registados |
| Casos Suspeitos | Numero de casos suspeitos em analise |
| Orcamento | Estado de execucao orcamental |

**Graficos analiticos implementados (12 visualizacoes):**

| Grafico | Tipo | Descricao |
|---------|------|-----------|
| Tendencia Financeira | Area | Evolucao temporal de receitas |
| Composicao de Receita | Donut | Distribuicao por tipo de receita |
| Receita por Entidade | Barras | Comparacao entre entidades |
| Treemap de Equipamentos | Treemap | Distribuicao de equipamentos por entidade |
| Tendencia de Processos | Linha | Evolucao temporal de processos |
| Estado dos Processos | Barras | Distribuicao por estado |
| Estado dos Eventos | Donut | Distribuicao por decisao |
| Heatmap de Actividade | Heatmap | Mapa de calor de actividade por dia/hora |
| Handpay | Barras | Valores de handpay por entidade |
| Casos Suspeitos | Barras | Estado dos casos suspeitos |
| Orcamento | Barras | Orcamento previsto vs. executado |
| Execucao Orcamental | Gauge | Percentagem de execucao orcamental |

**Funcionalidades do dashboard:**
- Filtros globais por ano e entidade;
- Permissoes por perfil (cada perfil ve apenas os KPIs e graficos autorizados);
- Actualizacao dinamica dos dados;
- Biblioteca de graficos ApexCharts.

### 3.8 Modulo de Notificacoes

O Modulo de Notificacoes assegura a comunicacao interna e externa do sistema, incluindo a gestao de casos suspeitos.

**Funcionalidades implementadas:**

- **Notificacoes Internas (Plataforma):**
  - Notificacoes em tempo real via WebSocket (Socket.io);
  - Destino configuravel: por utilizador, por entidade ou por perfil;
  - Indicador visual de notificacoes nao lidas;
  - Marcacao de notificacoes como lidas.

- **Notificacoes por Email:**
  - Envio automatico de emails via SMTP (Nodemailer);
  - Suporte a anexos PDF;
  - Registo (log) de todos os emails enviados;
  - Templates de email para notificacoes formais de processos.

- **Notificacoes Formais de Processo:**
  - Notificacao formal do visado sobre decisoes;
  - Geracao automatica de PDF da notificacao;
  - Envio por email com PDF em anexo;
  - Registo de visados notificados.

- **Gestao de Casos Suspeitos:**
  - Registo de casos suspeitos no ambito da prevencao do branqueamento de capitais;
  - Associacao de intervenientes (pessoas envolvidas);
  - Gestao de documentacao associada;
  - Geracao de comunicado oficial em PDF;
  - Exportacao de dados em PDF e CSV.

---

## 4. Matriz de Conformidade Contratual

A tabela seguinte apresenta a verificacao detalhada da conformidade entre os requisitos contratuais e a implementacao entregue.

### 4.1 Conformidade por Modulo

| Req. | Requisito Contratual | Estado | Observacoes |
|------|---------------------|--------|-------------|
| M1 | Modulo de Administracao | **Conforme** | Gestao de utilizadores, perfis, permissoes e menus integralmente implementada. 5 ecras funcionais. |
| M2 | Modulo de Configuracao | **Conforme** | 34 ecras de configuracao parametrica implementados, superando o minimo de 40 tabelas previsto (inclui tabelas sem ecra dedicado). |
| M3 | Modulo de Entidades | **Conforme** | Gestao completa de entidades, pessoas, colaboradores, grupos, bancas, maquinas e equipamentos. |
| M4 | Modulo de Eventos | **Conforme** | Ciclo de vida completo: pedido, parecer, despacho, decisao (aprovacao/recusa). |
| M5 | Modulo de Processos | **Conforme** | 3 tipos de processo (exclusao/interdicao, auto-exclusao, handpay) com ciclo de vida completo. 41 pecas processuais. |
| M6 | Modulo Financeiro | **Conforme** | Contribuicoes, impostos, premios, orcamento, contrapartidas e visao consolidada. |
| M7 | Modulo de Dashboard | **Conforme** | 7 KPIs e 12 graficos analiticos com filtros e permissoes por perfil. |
| M8 | Modulo de Notificacoes | **Conforme** | Notificacoes internas (tempo real), email, notificacoes formais de processo e gestao de casos suspeitos. |

### 4.2 Conformidade de Funcionalidades Transversais

| Req. | Funcionalidade | Estado | Observacoes |
|------|---------------|--------|-------------|
| F1 | Autenticacao e autorizacao | **Conforme** | JWT com controlo de perfis e permissoes granulares |
| F2 | Gestao de perfis de utilizador | **Conforme** | 6 perfis configurados com permissoes por menu e accao |
| F3 | Pecas processuais com formularios dinamicos | **Conforme** | 41 templates, 6 tipos de campos dinamicos |
| F4 | Geracao de PDF | **Conforme** | Backend (html-pdf/Puppeteer) e frontend (jsPDF) |
| F5 | Exportacao CSV/PDF | **Conforme** | Disponivel em todos os modulos com listagem de dados |
| F6 | Notificacoes em tempo real | **Conforme** | Socket.io com notificacoes por utilizador, entidade e perfil |
| F7 | Notificacoes por email | **Conforme** | Nodemailer com suporte a anexos PDF |
| F8 | Trilha de auditoria | **Conforme** | Registo automatico de todas as operacoes com utilizador e timestamp |
| F9 | Design responsivo | **Conforme** | React Bootstrap com layout adaptavel |
| F10 | Upload de documentos | **Conforme** | Firebase Storage com suporte a multiplos ficheiros |
| F11 | Gestao de casos suspeitos | **Conforme** | CRUD completo com intervenientes, documentos e comunicado PDF |
| F12 | Controlo de prazos (prescricao) | **Conforme** | Verificacao automatica de prazos com transicao de estado |

### 4.3 Resumo de Conformidade

| Categoria | Total de Requisitos | Conformes | Nao Conformes | Percentagem |
|-----------|--------------------:|----------:|--------------:|------------:|
| Modulos | 8 | 8 | 0 | 100% |
| Funcionalidades Transversais | 12 | 12 | 0 | 100% |
| **Total** | **20** | **20** | **0** | **100%** |

---

## 5. Arquitectura Tecnica

### 5.1 Visao Geral da Arquitectura

O SGIGJ adopta uma arquitectura de aplicacao web moderna, baseada no modelo cliente-servidor, com separacao clara entre as camadas de apresentacao (frontend), logica de negocio (backend) e dados (base de dados).

```
                    ┌──────────────────────────────┐
                    │       UTILIZADORES            │
                    │    (Browser: Chrome, Firefox,  │
                    │     Safari, Edge)              │
                    └──────────────┬───────────────┘
                                   │ HTTPS
                                   ▼
                    ┌──────────────────────────────┐
                    │     FIREBASE HOSTING          │
                    │     (Frontend React)          │
                    │                               │
                    │  React 17 + React Bootstrap   │
                    │  React Router, Redux, Formik  │
                    │  ApexCharts, jsPDF, ExcelJS   │
                    └──────────────┬───────────────┘
                                   │ REST API (HTTPS)
                                   │ WebSocket (Socket.io)
                                   ▼
                    ┌──────────────────────────────┐
                    │     GOOGLE CLOUD RUN          │
                    │     (Backend AdonisJS v4)     │
                    │                               │
                    │  Node.js, Lucid ORM, JWT      │
                    │  Nodemailer, html-pdf,        │
                    │  Puppeteer, Socket.io         │
                    └──────────┬───────┬───────────┘
                               │       │
                    ┌──────────▼──┐ ┌──▼──────────┐
                    │ CLOUD SQL   │ │  FIREBASE    │
                    │ (MySQL 8.0) │ │  STORAGE     │
                    │             │ │  (Ficheiros) │
                    └─────────────┘ └──────────────┘
```

### 5.2 Stack Tecnologico Detalhado

#### 5.2.1 Frontend

| Componente | Tecnologia | Versao | Funcao |
|-----------|------------|--------|--------|
| Framework | React | 17.0.2 | Biblioteca de interface de utilizador |
| Build Tool | Create React App | 4.0.3 | Compilacao e bundling |
| UI Framework | React Bootstrap | 1.6.6 | Componentes de interface |
| Routing | React Router DOM | 5.3.4 | Navegacao SPA |
| State Management | Redux Toolkit | 1.9.5 | Gestao de estado global |
| Forms | Formik + Yup | 2.2.9 / 0.32.11 | Formularios e validacao |
| Tables | React Table | 7.8.0 | Tabelas de dados com paginacao e filtros |
| Selectors | React Select | 5.7.4 | Selectores avancados com pesquisa |
| Charts | ApexCharts | 3.37.0 | Graficos e visualizacoes |
| Rich Text | Jodit React | 1.3.39 | Editor de texto rico (WYSIWYG) |
| PDF (cliente) | jsPDF + AutoTable | 2.5.1 / 5.0.7 | Geracao de PDF no browser |
| Excel | ExcelJS | 4.3.0 | Exportacao para Excel |
| HTTP Client | Axios | 0.27.2 | Comunicacao com a API |
| WebSocket | Socket.io Client | 4.6.1 | Notificacoes em tempo real |
| Styling | SASS | 1.58.0 | Folhas de estilo |
| Hosting | Firebase Hosting | -- | Alojamento estatico |

#### 5.2.2 Backend

| Componente | Tecnologia | Versao | Funcao |
|-----------|------------|--------|--------|
| Framework | AdonisJS | 4.1.0 | Framework MVC para Node.js |
| ORM | Lucid (AdonisJS) | 6.1.3 | Mapeamento objecto-relacional |
| Authentication | AdonisJS Auth | 3.0.7 | Autenticacao JWT |
| Database Driver | mysql | 2.18.1 | Driver MySQL para Node.js |
| Email | Nodemailer | 6.9.15 | Envio de emails SMTP |
| PDF (servidor) | html-pdf | 3.0.1 | Geracao de PDF a partir de HTML |
| PDF (avancado) | Puppeteer | 10.4.0 | Renderizacao de HTML para PDF |
| PDF Merge | pdf-merger-js | 3.4.0 | Juntada de multiplos PDFs |
| File Upload | Multer | 1.4.3 | Upload de ficheiros |
| Storage | Firebase Admin | 10.0.0 | Firebase Storage (ficheiros) |
| WebSocket | Socket.io | 4.8.1 | Comunicacao em tempo real |
| Date/Time | Moment Timezone | 0.5.46 | Manipulacao de datas |
| Crypto | bcryptjs + crypto | 3.0.3 | Hashing de passwords |
| Runtime | Node.js | -- | Ambiente de execucao |
| Hosting | Google Cloud Run | -- | Execucao containerizada |

#### 5.2.3 Base de Dados

| Componente | Tecnologia | Detalhes |
|-----------|------------|---------|
| SGBD | MySQL | 8.0 |
| Alojamento | Google Cloud SQL | Instancia gerida |
| Migrações | AdonisJS Migrations | 95 ficheiros de migração |
| Tabelas Principais | ~50 tabelas | Dados operacionais e de configuração |

#### 5.2.4 Infraestrutura (Google Cloud Platform)

| Servico | Utilizacao |
|---------|-----------|
| Cloud Run | Alojamento do backend (AdonisJS) |
| Cloud SQL | Base de dados MySQL 8.0 |
| Firebase Hosting | Alojamento do frontend (React) |
| Firebase Storage | Armazenamento de ficheiros e documentos |

### 5.3 Seguranca

| Mecanismo | Implementacao |
|-----------|--------------|
| Autenticacao | JWT (JSON Web Tokens) com expiracao configuravel |
| Autorizacao | Verificacao de permissoes por perfil em cada endpoint |
| Passwords | Hashing com bcrypt |
| Comunicacao | HTTPS em todas as comunicacoes |
| CORS | Configuracao restritiva de origens permitidas |
| Auditoria | Registo de todas as operacoes com utilizador e timestamp |

### 5.4 Modelo de Dados (Tabelas Principais)

```
Administracao:
  glbuser                          -- Utilizadores
  glbperfil                        -- Perfis
  glbperfilmenu                    -- Permissoes (perfil-menu-accao)
  glbmenu                          -- Menus
  glbpredefinicao                  -- Predefinicoes do sistema
  auditoria                        -- Trilha de auditoria

Entidades:
  sgigjentidade                    -- Entidades
  sgigjpessoa                      -- Pessoas
  sgigjrelpessoaentidade           -- Relacao pessoa-entidade
  sgigjentidadegrupo               -- Grupos
  sgigjentidadebanca               -- Bancas
  sgigjentidademaquina             -- Maquinas
  sgigjentidadeequipamento         -- Equipamentos
  sgigjrelcontacto                 -- Contactos
  sgigjreldocumento                -- Documentos

Processos:
  sgigjprocessoexclusao            -- Processos de exclusao/interdicao
  sgigjprocessoautoexclusao        -- Processos de auto-exclusao
  sgigjprocessodespacho            -- Despachos
  sgigjrelprocessoinstrucao        -- Instrucoes
  sgigjrelinstrutorpeca            -- Pecas processuais
  sgigjrelprocessoinstrutor        -- Instrutores
  sgigjhandpay                     -- Handpay
  sgigjdespachofinal               -- Despachos finais
  sgigjdespachointerrompido        -- Interrupcoes
  notificacao_processos            -- Notificacoes formais
  notificacao_processos_visados    -- Visados notificados
  decisao_tutelar_processos        -- Decisoes tutelares
  decisao_tribunal_processos       -- Decisoes de tribunal

Eventos:
  sgigjentidadeevento              -- Eventos
  sgigjrelenteventodecisao         -- Decisoes de eventos
  sgigjreleventodespacho           -- Despachos de eventos
  sgigjreleventoparecer            -- Pareceres de eventos

Financeiro:
  contribuicoes                    -- Contribuicoes fiscais
  pagamentoscontribuicoes          -- Pagamentos de contribuicoes
  imposto                          -- Impostos
  impostoparametrizado             -- Parametrizacao de impostos
  pagamentosimpostos               -- Pagamentos de impostos
  premio                           -- Premios
  contrapartida                    -- Contrapartidas
  contrapartidapagamento           -- Pagamentos de contrapartidas
  contrapartidaentidade            -- Contrapartidas por entidade
  orcamento                        -- Orcamento (projecto-rubrica)
  orcalmentodespesa                -- Despesas orcamentais
  cabimentacao                     -- Cabimentacoes
  projecto                         -- Projectos
  rubrica                          -- Rubricas

Notificacoes:
  glbnotificacao                   -- Notificacoes internas
  casosuspeito                     -- Casos suspeitos
  interveniente                    -- Intervenientes
```

---

## 6. Testes Realizados

### 6.1 Estrategia de Testes

A validacao do SGIGJ foi realizada atraves de uma abordagem abrangente de testes manuais, cobrindo todas as funcionalidades dos 8 modulos contratualizados. A estrategia incluiu testes funcionais, de integracao, de interface e de compatibilidade entre browsers.

### 6.2 Testes Funcionais por Modulo

| Modulo | Cenarios Testados | Resultado |
|--------|------------------:|-----------|
| Administracao | Criacao/edicao/eliminacao de utilizadores, perfis, permissoes, menus; login/logout; alteracao de password | Aprovado |
| Configuracao | CRUD completo para todas as 34 tabelas de configuracao; validacao de campos obrigatorios | Aprovado |
| Entidades | Gestao completa de entidades, pessoas, colaboradores, grupos, bancas, maquinas, equipamentos; upload de documentos | Aprovado |
| Eventos | Ciclo completo: pedido, parecer, despacho, decisao; listagem de aprovados e recusados | Aprovado |
| Processos | Ciclo completo de exclusao/interdicao (9 fases); auto-exclusao; handpay; pecas processuais; juntada PDF | Aprovado |
| Financeiro | CRUD de contribuicoes, impostos, premios, orcamento, contrapartidas; pagamentos; visao consolidada | Aprovado |
| Dashboard | Carregamento de KPIs e 12 graficos; filtros por ano e entidade; permissoes por perfil | Aprovado |
| Notificacoes | Notificacoes em tempo real (WebSocket); envio de email; notificacoes formais; casos suspeitos | Aprovado |

### 6.3 Testes de Integracao

| Cenario de Integracao | Descricao | Resultado |
|----------------------|-----------|-----------|
| Processo -> Notificacao | Criacao de processo gera notificacao ao instrutor | Aprovado |
| Processo -> PDF | Despachos e pecas geram PDFs automaticamente | Aprovado |
| Processo -> Email | Notificacoes formais enviam email com PDF | Aprovado |
| Processo -> Juntada | Compilacao de todos os documentos num unico PDF | Aprovado |
| Evento -> Parecer -> Decisao | Fluxo completo de evento ate decisao | Aprovado |
| Financeiro -> Pagamentos | Registo de pagamentos em contribuicoes, impostos e contrapartidas | Aprovado |
| Dashboard -> Dados | KPIs e graficos reflectem dados reais da base de dados | Aprovado |
| Auditoria -> Operacoes | Todas as operacoes CRUD geram registo de auditoria | Aprovado |

### 6.4 Testes de Interface (UI/UX)

| Aspecto | Descricao | Resultado |
|---------|-----------|-----------|
| Navegacao | Menus, sub-menus e navegacao entre paginas | Aprovado |
| Formularios | Validacao de campos, mensagens de erro, campos obrigatorios | Aprovado |
| Tabelas | Paginacao, ordenacao, filtros, pesquisa | Aprovado |
| Modais | Abertura, preenchimento e submissao de formularios em modal | Aprovado |
| Responsividade | Adaptacao a diferentes resolucoes de ecra | Aprovado |
| Feedback | Toast notifications, indicadores de carregamento | Aprovado |

### 6.5 Testes de Compatibilidade entre Browsers

| Browser | Versao | Sistema Operativo | Resultado |
|---------|--------|------------------|-----------|
| Google Chrome | 120+ | Windows / macOS | Aprovado |
| Mozilla Firefox | 120+ | Windows / macOS | Aprovado |
| Apple Safari | 17+ | macOS | Aprovado |
| Microsoft Edge | 120+ | Windows | Aprovado |

### 6.6 Testes de Aceitacao (UAT)

Os testes de aceitacao pelo utilizador foram realizados com a participacao de colaboradores da IGJ, abrangendo os seguintes perfis:

- Inspector Geral -- Validacao dos fluxos de despacho, aprovacao e decisao;
- Inspectores -- Validacao da instrucao de processos e producao de pecas processuais;
- Tecnicos -- Validacao das funcionalidades de configuracao e gestao de entidades;
- Administrativos -- Validacao das funcionalidades financeiras e de eventos.

---

## 7. Formacao e Documentacao

### 7.1 Documentacao Tecnica

| Documento | Descricao | Formato |
|-----------|-----------|---------|
| Fluxo Completo do Modulo de Processos | Documentacao detalhada do ciclo de vida dos processos, arquitectura de dados, APIs e permissoes | Markdown |
| Documentacao de Modulos | Documentos individuais para os modulos Financeiro (Contribuicoes, Impostos, Premios, Orcamento, Contrapartidas), Processos e Casos Suspeitos | PDF |
| Modelo do SICREJ | Modelo de dados do sistema de referencia | XLSM |
| Scripts de Base de Dados | Scripts SQL para criacao e populacao da base de dados | SQL |
| Guia de Actualizacao | Procedimentos para actualizacao do sistema em producao | PDF |
| Guia de Acesso ao Servidor | Procedimentos de acesso ao servidor via SSH (Putty) | PDF |

### 7.2 Documentacao Funcional

| Documento | Descricao | Formato |
|-----------|-----------|---------|
| Modulo Processos -- Passo a Passo | Guia detalhado dos 19 passos do processo administrativo | PDF |
| Formularios do Processo Administrativo | Especificacao dos 41 formularios/templates de pecas processuais | DOCX |
| Manual de Procedimentos do Inspector de Jogos | Manual de referencia para os inspectores | PDF |
| Formulario de Pedido de Interdicao | Formulario padrao para pedidos de interdicao | PDF |
| Modelos de Despacho | Templates de despachos oficiais da IGJ | DOCX |

### 7.3 Formacao

A formacao dos utilizadores foi realizada presencialmente, cobrindo:

- Utilizacao geral da plataforma (navegacao, pesquisa, filtros);
- Gestao de entidades e pessoas;
- Gestao de processos administrativos (ciclo completo);
- Gestao de eventos;
- Funcionalidades financeiras;
- Utilizacao do dashboard;
- Administracao do sistema (perfis, permissoes, configuracoes).

---

## 8. Recomendacoes e Proximos Passos

### 8.1 Recomendacoes de Manutencao

| N. | Recomendacao | Prioridade | Descricao |
|----|-------------|------------|-----------|
| R1 | Backups regulares | Alta | Implementar politica de backup automatico diario da base de dados Cloud SQL e dos ficheiros no Firebase Storage |
| R2 | Monitorizacao | Alta | Configurar alertas no Google Cloud Monitoring para disponibilidade do Cloud Run, utilizacao de CPU/memoria e erros da API |
| R3 | Actualizacoes de seguranca | Alta | Manter as dependencias Node.js actualizadas, especialmente as bibliotecas com vulnerabilidades conhecidas |
| R4 | Certificados SSL | Media | Verificar periodicamente a validade dos certificados SSL |
| R5 | Limpeza de logs | Baixa | Implementar politica de retencao de logs e dados de auditoria |

### 8.2 Evolucoes Futuras Sugeridas

| N. | Evolucao | Prioridade | Descricao |
|----|---------|------------|-----------|
| E1 | Aplicacao movel | Media | Desenvolvimento de aplicacao movel (iOS/Android) para acesso a funcionalidades chave (notificacoes, consulta de processos, dashboard) |
| E2 | Integracao com sistemas externos | Media | Integracao com sistemas fiscais do Estado de Cabo Verde para troca automatica de dados financeiros |
| E3 | Relatorios avancados | Media | Implementacao de relatorios analiticos adicionais com filtros avancados e exportacao configuravel |
| E4 | Assinatura digital | Media | Integracao com sistema de assinatura digital para validacao de despachos e documentos oficiais |
| E5 | Portal de entidades | Baixa | Portal self-service para as entidades reguladas submeterem pedidos, documentos e consultarem o estado dos seus processos |
| E6 | Migracao de framework | Baixa | Considerar migracao futura do AdonisJS v4 para AdonisJS v6 (ou equivalente), dado que a v4 se encontra em fim de suporte |
| E7 | Testes automatizados | Baixa | Implementacao de suite de testes automatizados (unitarios e de integracao) para garantir a qualidade em futuras evolucoes |
| E8 | Multi-idioma | Baixa | Suporte a interface em varios idiomas (Portugues, Ingles), caso necessario para cooperacao internacional |

### 8.3 Notas Tecnicas

1. **AdonisJS v4:** A versao 4 do AdonisJS encontra-se em modo de manutencao. Recomenda-se planear a migracao para uma versao mais recente num horizonte de medio prazo.
2. **React 17:** O React 17 continua funcional mas nao recebe novas funcionalidades. A migracao para React 18+ podera ser considerada em futuras evolucoes.
3. **html-pdf:** A biblioteca html-pdf utiliza PhantomJS (descontinuado). O Puppeteer, ja presente no projecto, constitui uma alternativa mais robusta e mantida.

---

## 9. Conclusao

O projecto SGIGJ foi concluido com exito, cumprindo integralmente os 8 modulos contratualizados e todas as funcionalidades transversais previstas no contrato CPR-2021-0003.

O sistema encontra-se em pleno funcionamento no ambiente de producao, alojado na infraestrutura Google Cloud Platform, e e utilizado quotidianamente pelos colaboradores da Inspeccao Geral de Jogos de Cabo Verde nas suas actividades regulatorias.

**Principais marcos alcancados:**

- Digitalizacao completa dos processos administrativos da IGJ, incluindo o ciclo de vida de processos de exclusao/interdicao, auto-exclusao e handpay;
- Implementacao de 41 pecas processuais (templates de documentos legais) com sistema de formularios dinamicos;
- Gestao financeira integrada, abrangendo contribuicoes, impostos, premios, orcamento e contrapartidas;
- Dashboard analitico com 7 KPIs e 12 graficos, proporcionando visibilidade em tempo real sobre o estado operacional e financeiro;
- Sistema de notificacoes em tempo real, integrando comunicacoes internas e envio automatico de emails com documentos PDF;
- Gestao de casos suspeitos no ambito da prevencao do branqueamento de capitais;
- Trilha de auditoria completa, garantindo a rastreabilidade de todas as operacoes;
- Controlo de acesso granular com 6 perfis de utilizador e permissoes configuradas por funcionalidade.

A Cloud Technology, S.A. manifesta a sua total disponibilidade para apoiar a IGJ na manutencao evolutiva e correctiva do sistema, bem como na implementacao das evolucoes futuras sugeridas no presente relatorio.

---

**Elaborado por:** Cloud Technology, S.A.

**Data:** 20 de Fevereiro de 2026

**Referencia do Contrato:** CPR-2021-0003

**Valor do Contrato:** 1.728.450 CVE

---

*Fim do Relatorio Final*
