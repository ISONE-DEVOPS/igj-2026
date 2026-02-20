# Modulo de Processos - Fluxo Completo

> Documento gerado a partir da analise do codigo-fonte (backend + frontend) e dos documentos de especificacao funcional.

---

## 1. Visao Geral

O Modulo de Processos gere todo o ciclo de vida dos processos administrativos da Inspeccao Geral de Jogos (IGJ), desde a instauracao ate ao encerramento. Inclui processos de **exclusao/interdicao**, **auto-exclusao** e **handpay**.

### 1.1 Stack Tecnologico

| Camada | Tecnologia |
|--------|-----------|
| Backend | AdonisJS v4 (Node.js), Lucid ORM |
| Base de Dados | MySQL |
| Frontend | React 17, CRA (react-scripts 4.0.3) |
| UI Components | react-bootstrap v1, react-table v7, react-select v5 |
| Rich Text | JoditEditor |
| PDF | html-pdf (servidor), jsPDF (cliente) |
| Storage | Firebase Storage |
| Auth | JWT (jsonwebtoken) |
| Realtime | Socket.io |

### 1.2 Tipos de Processo

| Tipo | Rota Frontend | Controller Backend |
|------|--------------|-------------------|
| Exclusao/Interdicao | `/processos/exclusaointerdicao` | `SgigjprocessoexclusaoController` |
| Auto-Exclusao | `/processos/autoexclusao` | `SgigjprocessoautoexclusaoController` |
| Handpay | `/processos/handpay` | (controller handpay) |
| Finalizados | `/processos/exclusaofinalizado` | mesmo controller, filtro por estado |
| Arquivados | `/processos/exclusao/arquivados` | mesmo controller, filtro por estado |
| Prescritos | `/processos/exclusao/prescritos` | mesmo controller, filtro por estado |

---

## 2. Fluxo Completo do Processo de Exclusao/Interdicao

### 2.1 Diagrama de Estados

```
                    ┌─────────────────┐
                    │  INSTAURACAO     │
                    │  (Auto de        │
                    │   Exclusao)      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  DESPACHO       │
                    │  INICIAL        │
                    │  (Atribuicao    │
                    │   de Instrutor) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  INSTRUCAO      │◄──────────────┐
                    │  (Investigacao) │               │
                    │                 │    Devolucao p/│
                    │  - Pecas Proc.  │    Instrucao  │
                    │  - Notificacoes │               │
                    │  - Diligencias  │               │
                    └────────┬────────┘               │
                             │                        │
                    ┌────────┴────────┐               │
                    │                 │               │
                    ▼                 ▼               │
           ┌──────────────┐  ┌──────────────┐        │
           │ INTERROMPIDO │  │  DESPACHO    │        │
           │ (Suspensao)  │  │  FINAL       │────────┘
           └──────┬───────┘  │  (Decisao)   │
                  │          └──────┬───────┘
                  ▼                 │
           ┌──────────────┐        │
           │ DECISAO      │        ▼
           │ INTERROMPIDO │  ┌──────────────┐
           └──────────────┘  │ NOTIFICACAO  │
                             │ DA DECISAO   │
                             └──────┬───────┘
                                    │
                             ┌──────┴───────┐
                             │              │
                             ▼              ▼
                     ┌────────────┐  ┌────────────┐
                     │ DECISAO    │  │ DECISAO    │
                     │ TUTELAR    │  │ TRIBUNAL   │
                     └─────┬──────┘  └─────┬──────┘
                           │               │
                           └───────┬───────┘
                                   ▼
                          ┌─────────────────┐
                          │ TERMO DE        │
                          │ ENCERRAMENTO    │
                          └────────┬────────┘
                                   │
                          ┌────────┴────────┐
                          │                 │
                          ▼                 ▼
                   ┌────────────┐    ┌────────────┐
                   │ FINALIZADO │    │ ARQUIVADO  │
                   └────────────┘    └────────────┘
```

---

### 2.2 Passo 1: Instauracao do Processo

**Descricao:** Criacao do Auto de Exclusao que inicia o processo.

| Item | Detalhe |
|------|--------|
| **Quem** | Inspector Geral ou utilizador autorizado |
| **Frontend** | Modal "Criar" em `/processos/exclusaointerdicao` |
| **API** | `POST /sgigjprocessoexclusao` |
| **Controller** | `SgigjprocessoexclusaoController.store` |
| **Dados** | Visado (PESSOA_ID), Entidade (ENTIDADE_ID), Descricao, Tipo de Pedido, Observacoes |
| **Estado resultante** | Processo criado com ESTADO="1" |
| **Documentos** | Anexo 1 - Auto de Noticia |

**Campos do formulario:**
- Pessoa/Visado (selector react-select)
- Entidade (selector)
- Descricao dos factos (texto)
- Tipo de pedido (selector)
- Observacoes (JoditEditor - texto rico)
- Documentos anexos (upload multiplo)

---

### 2.3 Passo 2: Despacho Inicial

**Descricao:** O Inspector Geral emite despacho de instauracao, nomeia o instrutor e define o prazo.

| Item | Detalhe |
|------|--------|
| **Quem** | Inspector Geral (perfil `85c24ffab0137705617aa94b250866471dc2`) |
| **Frontend** | Componente `DespachoInicial` (modal dentro do processo) |
| **API** | `PUT /sgigjprocessoexclusao/:id/despacho` |
| **Controller** | `SgigjprocessodespachoController.Exclusao` |
| **Dados** | Instrutor (INSTRUTOR_ID), Texto do despacho, Data do despacho |
| **Estado resultante** | Processo com despacho inicial emitido |
| **Notificacao** | Notificacao interna ao instrutor nomeado |

**Logica especial:**
- Gera PDF do despacho usando `geradorTexto.js`
- Envia notificacao ao instrutor via WebSocket + email
- O texto do despacho e pre-preenchido com template configuravel

---

### 2.4 Passo 3: Fase de Instrucao

**Descricao:** O instrutor conduz a investigacao, recolhendo provas, ouvindo testemunhas e documentando tudo atraves de pecas processuais.

| Item | Detalhe |
|------|--------|
| **Quem** | Instrutor nomeado |
| **Frontend** | Componente `Instrucao` (tab dentro do processo) |
| **API** | `POST/PUT /sgigjrelprocessoinstrucao` |
| **Controller** | `SgigjrelprocessoinstrucaoController` |

#### 2.4.1 Pecas Processuais

As pecas processuais sao documentos produzidos durante a instrucao. O sistema suporta pecas dinamicas configuradas na tela de configuracao.

**API para pecas:** `POST /sgigjrelinstrutorpeca`
**Controller:** `SgigjrelinstrutorpecaController`

**7 Tipos de Pecas Configuradas (actuais):**

| # | Peca | ID (env var) | Campos |
|---|------|-------------|--------|
| 1 | Nota de Comunicacao | `PECAPROCESSUAL_NOTACOMUNICACAO_ID` | Destinatario, OBS, Anexos |
| 2 | Autodeclaracao | `PECAPROCESSUAL_AUTODECLARACAO_ID` | Pessoa, OBS, Anexos |
| 3 | Prova | `PECAPROCESSUAL_PROVA_ID` | OBS, Anexos |
| 4 | Reclamacao do Visado | `PECAPROCESSUAL_RECLAMACAOVISADO_ID` | Pessoa, OBS, Anexos |
| 5 | Relatorio Final | `PECAPROCESSUAL_RELATORIOFINAL_ID` | Pessoa, Infracao/Coima, OBS, Decisao, Anexos |
| 6 | Juntada | `PECAPROCESSUAL_JUNTADA_ID` | OBS, Anexos |
| 7 | Termo de Encerramento | `PECAPROCESSUAL_TERMO_ENCERRAMENTO_ID` | OBS |

**41 Templates Disponiveis (DOCX):**
Ver ficheiro `api/seeds/pecas_templates.json` para a lista completa de templates que devem ser configurados como pecas processuais.

**Campos dinamicos por peca (renderizados por `switch.js`):**

| Flag | Componente | Descricao |
|------|-----------|-----------|
| PESSOA | `PessoaField` | Selector de pessoa (react-select) + criar pessoa |
| OBS | `OBS` | Editor de texto rico (JoditEditor) |
| ANEXO_DOC | `DocumentsField` | Upload de documentos |
| DESTINATARIO | `PessoaField` | Selector de destinatario |
| INFRACAO_COIMA | `InfracaoCoimaField` | Selector de infracao + valor da coima |
| DECISAO | `DesicaoField` | Selector de tipo de decisao |

#### 2.4.2 Nota de Comunicacao

Tipo especial de peca com geracao automatica de PDF.

| Item | Detalhe |
|------|--------|
| **Frontend** | Componente `Notacomunicacao` |
| **Gerador** | `textogerador.js` com 3 templates: `visado()`, `entidadedecisora()`, `entidadevisada()` |
| **PDF** | Gerado no servidor via `pdfCreater`, guardado no Firebase Storage |
| **Email** | Enviado automaticamente ao visado/entidade com PDF em anexo |

#### 2.4.3 Interrupcao da Instrucao

| Item | Detalhe |
|------|--------|
| **Frontend** | Componente `Interrompido` |
| **API** | `PUT /sgigjrelprocessoinstrucao/:id/interrompido` |
| **Controller** | `SgigjprocessodespachoController.Interrompido` |
| **Motivo** | Suspensao temporaria da instrucao |

---

### 2.5 Passo 4: Despacho Final

**Descricao:** Apos a instrucao, o Inspector Geral emite o despacho final com a decisao.

| Item | Detalhe |
|------|--------|
| **Quem** | Inspector Geral |
| **Frontend** | Componente `DespachoFinal` |
| **API** | `PUT /sgigjprocessoexclusao/:id/despachofinal` |
| **Controller** | `SgigjprocessodespachoController.Despachofinal` |
| **Dados** | Decisao (tipo), Texto do despacho, Periodo de exclusao |
| **Opcoes** | Aprovar, Devolver p/ Instrucao, Arquivar |
| **PDF** | Gera PDF do despacho final |

**Tipos de Decisao:**
- Exclusao (com periodo)
- Interdicao
- Arquivamento
- Devolucao para instrucao (reenvia para fase de instrucao)

---

### 2.6 Passo 5: Notificacao da Decisao

**Descricao:** Notificacao formal do visado sobre a decisao tomada.

| Item | Detalhe |
|------|--------|
| **Frontend** | Componente dentro do processo |
| **API** | `POST /notificacao-processos` |
| **Controller** | `NotificacaoProcessosController.store` |
| **Tipos** | Pessoal (Modelo 34), Postal (Modelo 33), Publicacao (Modelo 35) |
| **PDF** | Gerado automaticamente quando ESTADO_NOTIFICACAO == "CONCLUIR" |
| **Email** | Enviado ao visado com PDF em anexo |

**Dados da notificacao:**
- Corpo (HTML rico)
- Documentos anexos
- Visados (lista de intervenientes a notificar)

---

### 2.7 Passo 6: Decisao Tutelar / Tribunal

**Descricao:** Registo de decisoes de instancias superiores.

| Item | Detalhe |
|------|--------|
| **API Tutelar** | `POST /decisao-tutelar-processos` |
| **Controller** | `DecisaoTutelarProcessosController` |
| **API Tribunal** | `POST /decisao-tribunal-processos` |
| **Controller** | `DecisaoTribunalProcessosController` |

---

### 2.8 Passo 7: Juntada de Documentos

**Descricao:** Compilacao de todos os documentos do processo num unico PDF.

| Item | Detalhe |
|------|--------|
| **API** | `GET /juntada/:id` |
| **Controller** | `Juntada.file` |
| **Funcao** | Merge de PDFs com capa "Termo de Juntada" |
| **Output** | PDF unico com todos os documentos do processo |

---

### 2.9 Passo 8: Termo de Encerramento

**Descricao:** Encerramento formal do processo.

| Item | Detalhe |
|------|--------|
| **Frontend** | Componente `TermoEncerramento` |
| **API** | `PUT /sgigjprocessoexclusao/:id` (via update generico) |
| **Nota** | Rota especifica de termo de encerramento NAO EXISTE no backend |

---

### 2.10 Passo 9: Tempo Limite / Prescricao

**Descricao:** Verificacao automatica de prazos de prescricao.

| Item | Detalhe |
|------|--------|
| **Frontend** | Componente `Tempolimite` |
| **API** | `GET /tempolimiteprocessoexclusao` |
| **Controller** | `Tempolimiteprocessoexclusao.index` |
| **Logica** | Verifica se o prazo de instrucao expirou e move para "prescritos" |

---

## 3. Processo de Auto-Exclusao

Fluxo simplificado para pedidos voluntarios de exclusao.

| Passo | Descricao | API |
|-------|-----------|-----|
| 1 | Registo do pedido | `POST /sgigjprocessoautoexclusao` |
| 2 | Despacho (aprovacao/rejeicao) | `PUT /sgigjprocessoautoexclusao/:id/despacho` |
| 3 | Exportacao PDF/CSV | `GET /sgigjprocessoautoexclusao/exportPdf` |

---

## 4. Arquitectura de Dados

### 4.1 Tabelas Principais

```
sgigjprocessoexclusao          -- Processo principal
  ├── sgigjprocessodespacho    -- Despachos (inicial, final)
  ├── sgigjrelprocessoinstrucao -- Fases de instrucao
  │   └── sgigjrelinstrutorpeca -- Pecas processuais do instrutor
  │       └── sgigjreldocumento -- Documentos anexos
  ├── sgigjrelprocessoinstrutor -- Instrutores atribuidos
  ├── notificacao_processos     -- Notificacoes formais
  │   ├── notificacao_processos_visados -- Visados notificados
  │   └── sgigjreldocumento    -- Documentos da notificacao
  ├── decisao_tutelar_processos -- Decisoes tutelares
  └── decisao_tribunal_processos -- Decisoes de tribunal
```

### 4.2 Tabelas de Configuracao

```
sgigjprpecasprocessual         -- Tipos de pecas processuais
  └── sgigjrelpecaprocessualcampo -- Campos de cada peca
      └── sigjprcampo          -- Tipos de campo (flags)

sgigjprdecisaotp               -- Tipos de decisao
sgigjprmotivoesclusaotp        -- Motivos de exclusao
sgigjprexclusaoperiodo         -- Periodos de exclusao
sgigjprorigemtp                -- Origens do processo
sgigjprinfracaotp              -- Tipos de infracao
sgigjinfracaocoima             -- Relacao infracao-coima
```

### 4.3 Tabelas Auxiliares

```
sgigjpessoa                    -- Pessoas
sgigjrelinterveniente          -- Intervenientes no processo
sgigjrelpessoaentidade         -- Relacao pessoa-entidade
sgigjrelcontacto               -- Contactos
sgigjprdocumentotp             -- Tipos de documento
glbuser                        -- Utilizadores do sistema
glbnotificacao                 -- Notificacoes internas
statusSendEmail                -- Log de emails enviados
```

---

## 5. Sistema de Permissoes

Todas as operacoes sao controladas por:

```javascript
functionsDatabase.allowed(tabela, accao, userID, entityID)
```

**Accoes:** `create`, `update`, `delete`, `index`, `show`

**Perfis especiais (hardcoded):**
- Inspector Geral: `85c24ffab0137705617aa94b250866471dc2`
- Inspector Normal: `f8382845e6dad3fb2d2e14aa45b14f0f85de`

**Permissoes no frontend:**
```javascript
taskEnable(pageAcess, permissoes, "Criar")   // Pode criar?
taskEnable(pageAcess, permissoes, "Editar")   // Pode editar?
taskEnable(pageAcess, permissoes, "Ler")      // Pode ler?
```

---

## 6. Sistema de Notificacoes

### 6.1 Notificacoes Internas (plataforma)

| Item | Detalhe |
|------|--------|
| **Tabela** | `glbnotificacao` |
| **Funcao** | `GlbnotificacaoFunctions.storeToUser/storeToEntidade/storeToPerfil` |
| **Canal** | WebSocket (Socket.io) - evento `'standard'` |
| **Destinos** | Por utilizador, por entidade, por perfil |

### 6.2 Notificacoes por Email

| Item | Detalhe |
|------|--------|
| **Transporte** | Nodemailer (SMTP) |
| **Config** | `MAILER_HOST`, `MAILER_PORT`, `MAILER_USER`, `MAILER_PASSWORD` |
| **Sender** | `EMAIL_SENDER` (env var) |
| **Anexos** | Suporte a PDF como attachment |
| **Log** | Tabela `statusSendEmail` |

### 6.3 Notificacoes Formais de Processo

| Item | Detalhe |
|------|--------|
| **Tabela** | `notificacao_processos` |
| **Controller** | `NotificacaoProcessosController` |
| **PDF** | Gerado automaticamente ao concluir |
| **Email** | Enviado a cada visado com PDF em anexo |

---

## 7. Geracao de PDFs

### 7.1 Servidor (Backend)

| Funcao | Ficheiro | Uso |
|--------|---------|-----|
| `pdfCreater` | `api/app/Controllers/Http/pdfCreater.js` | Gera PDF a partir de HTML |
| `Juntada.file` | `api/app/Controllers/Http/Juntada.js` | Merge de multiplos PDFs |
| `gerarDoc` | `NotificacaoProcessosController` | PDF de notificacao |

**Fluxo:** HTML → html-pdf (PhantomJS) → Buffer → Firebase Storage → URL

### 7.2 Cliente (Frontend)

| Biblioteca | Uso |
|-----------|-----|
| `jsPDF` | Geracao de PDF no browser |
| `jspdf-autotable` | Tabelas em PDF |
| `exceljs` | Exportacao para Excel |

---

## 8. Rotas da API (Processos)

### 8.1 Processo de Exclusao

| Metodo | Rota | Accao |
|--------|------|-------|
| GET | `/sgigjprocessoexclusao` | Listar processos |
| POST | `/sgigjprocessoexclusao` | Criar processo |
| GET | `/sgigjprocessoexclusao/:id` | Ver processo |
| PUT | `/sgigjprocessoexclusao/:id` | Actualizar processo |
| DELETE | `/sgigjprocessoexclusao/:id` | Eliminar processo |
| PUT | `/sgigjprocessoexclusao/:id/despacho` | Despacho inicial |
| PUT | `/sgigjprocessoexclusao/:id/despachofinal` | Despacho final |
| GET | `/sgigjprocessoexclusao/:id/resgatar` | Resgatar processo |

### 8.2 Instrucao

| Metodo | Rota | Accao |
|--------|------|-------|
| GET | `/sgigjrelprocessoinstrucao` | Listar instrucoes |
| POST | `/sgigjrelprocessoinstrucao` | Criar instrucao |
| PUT | `/sgigjrelprocessoinstrucao/:id` | Actualizar |
| PUT | `/sgigjrelprocessoinstrucao/:id/despacho` | Despacho de instrucao |
| PUT | `/sgigjrelprocessoinstrucao/:id/interrompido` | Interromper |
| PUT | `/sgigjrelprocessoinstrucao/:id/interrompidofinal` | Decisao interrupcao |

### 8.3 Pecas Processuais

| Metodo | Rota | Accao |
|--------|------|-------|
| POST | `/sgigjrelinstrutorpeca` | Criar peca |
| PUT | `/sgigjrelinstrutorpeca/:id` | Actualizar peca |
| PUT | `/sgigjrelinstrutorpeca/:id/despacho` | Despacho da peca |

### 8.4 Notificacoes

| Metodo | Rota | Accao |
|--------|------|-------|
| POST | `/notificacao-processos` | Criar notificacao |
| PUT | `/notificacao-processos/:id` | Actualizar notificacao |
| GET | `/notificacao-processos/:id` | Ver notificacao |

### 8.5 Decisoes

| Metodo | Rota | Accao |
|--------|------|-------|
| POST | `/decisao-tutelar-processos` | Decisao tutelar |
| POST | `/decisao-tribunal-processos` | Decisao tribunal |

### 8.6 Outros

| Metodo | Rota | Accao |
|--------|------|-------|
| GET | `/juntada/:id` | Gerar PDF juntada |
| GET | `/tempolimiteprocessoexclusao` | Verificar prazos |

---

## 9. Rotas Frontend

| Rota | Componente | Descricao |
|------|-----------|-----------|
| `/processos/exclusaointerdicao` | `exclusaointerdicao/index.js` | Processos em curso |
| `/processos/exclusao/pedido` | `exclusaointerdicao/index.js` | Pedidos de exclusao |
| `/processos/autoexclusao` | `autoexclusao/index.js` | Auto-exclusao |
| `/processos/handpay` | `handpay/index.js` | Handpay |
| `/processos/exclusaofinalizado` | `exclusaofinalizado/index.js` | Finalizados |
| `/processos/exclusao/arquivados` | `exclusaoarquivado/index.js` | Arquivados |
| `/processos/exclusao/prescritos` | `exclusaoprescrito/index.js` | Prescritos |
| `/configuracao/pecasprocessuais` | `configuracao/pecasprocessuais/index.js` | Config. pecas |
| `/configuracao/exclusaoperiodo` | `configuracao/exclusaoperiodo/index.js` | Config. periodos |
| `/configuracao/motivoexclusao` | `configuracao/motivoexclusao/index.js` | Config. motivos |

---

## 10. Funcionalidades em Falta (Gap Analysis)

Baseado na analise dos documentos "Passo a Passo" (19 passos) e "Processos.pdf" (18 paginas):

### 10.1 Nao Implementado

| # | Funcionalidade | Modelos DOCX | Prioridade |
|---|---------------|-------------|-----------|
| 1 | **Capa do Processo** | Anexo 2 | Alta |
| 2 | **Acusacao** | Modelo 7 | Alta |
| 3 | **Convocatoria do Arguido** | Modelo 17 | Alta |
| 4 | **Convocatoria de Testemunhas** | Modelos 16, 27 | Alta |
| 5 | **Auto de Diligencias** | Modelo 12 | Media |
| 6 | **Auto de Apreensao** | Modelo 13 | Media |
| 7 | **Auto de Inquiricao** | Modelo 19 | Media |
| 8 | **Auto de Acareacao** | Modelo 20 | Baixa |
| 9 | **Auto de Exame** | Modelo 21 | Baixa |
| 10 | **Compromisso de Honra** | Modelo 22 | Baixa |
| 11 | **Sindicancia completa** | Modelos 36-41 | Baixa |

### 10.2 Parcialmente Implementado

| # | Funcionalidade | Estado | O que falta |
|---|---------------|--------|------------|
| 1 | **Notificacao da Decisao** | Parcial | Faltam tipos pessoal/postal/publicacao |
| 2 | **Autodeclaracao** | Parcial | Faltam tipos: inquiricao, acareacao, exame |
| 3 | **Termo de Encerramento** | Frontend existe | Falta rota backend especifica |
| 4 | **Pecas Processuais** | 7 de 41 | Faltam 34 tipos (seed script criado) |

### 10.3 Bugs Conhecidos (na tela de configuracao de Pecas Processuais)

| # | Bug | Localizacao |
|---|-----|-----------|
| 1 | Uncheck de campos nao funciona (indexOf retorna -1) | `pecasprocessuais/index.js:620` |
| 2 | Modal "Ver" nao mostra campos configurados | `pecasprocessuais/index.js:880` |
| 3 | Botao "Remover" nao aparece na tabela | `pecasprocessuais/index.js:254` |
| 4 | Limite de ordem 1-9 insuficiente | `pecasprocessuais/index.js:653` |

---

## 11. Ficheiros Chave

### Backend
```
api/app/Controllers/Http/
  SgigjprocessoexclusaoController.js    -- CRUD processos exclusao
  SgigjprocessodespachoController/      -- Todos os despachos
  SgigjrelprocessoinstrucaoController.js -- Gestao da instrucao
  SgigjrelinstrutorpecaController.js    -- Pecas do instrutor
  SgigjprpecasprocessualController.js   -- Config. pecas (CRUD)
  NotificacaoProcessosController.js     -- Notificacoes formais
  DecisaoTutelarProcessosController.js  -- Decisoes tutelares
  DecisaoTribunalProcessosController.js -- Decisoes tribunal
  Juntada.js                            -- Merge de PDFs
  Tempolimiteprocessoexclusao.js        -- Controle de prazos
  GlbnotificacaoFunctions.js            -- Notificacoes internas
  pdfCreater.js                         -- Geracao de PDFs
```

### Frontend
```
frontend/src/pages/processos/
  exclusaointerdicao/
    index.js                 -- Pagina principal (2660 linhas)
    geradorTexto.js          -- Templates de texto para despachos
    DespachoInicial/         -- Formulario despacho inicial
    DespachoFinal/           -- Formulario despacho final
    Instrucao/               -- Fase de instrucao
      Notacomunicacao/       -- Nota de comunicacao + gerador
      pecasprocesuaisform/   -- Formulario dinamico de pecas
      Interrompido/          -- Interrupcao
      Table/                 -- Tabela de pecas
    TermoEncerramento/       -- Termo de encerramento
    Tempolimite/             -- Controle de prazos
  autoexclusao/              -- Auto-exclusao
  handpay/                   -- Handpay
  exclusaofinalizado/        -- Processos finalizados
  exclusaoarquivado/         -- Processos arquivados
  exclusaoprescrito/         -- Processos prescritos
```

### Seeds
```
api/seeds/
  pecas_templates.json               -- 41 templates do DOCX
  seed_pecas_processuais.js          -- Script de seed
```

---

---

## 12. Validacao de Conformidade

Validar se o modulo de processos esta em conformidade com o fluxo definido e a documentacao fornecida.

### 12.1 Checklist por Passo (Documento "Passo a Passo" - 19 passos)

| Passo | Descricao | Estado | Observacoes |
|-------|-----------|--------|-------------|
| 1 | Auto de Exclusao (Instauracao) | Implementado | CRUD completo, formulario com pessoa/entidade/descricao |
| 2 | Despacho Inicial (Nomeacao Instrutor) | Implementado | Atribuicao de instrutor, geracao de PDF, notificacao |
| 3 | Inicio da Instrucao | Implementado | Criacao automatica apos despacho inicial |
| 4 | Capa do Processo | Pendente | Gerar PDF de capa (Anexo 2). Sera peca processual apos seed |
| 5 | Comunicacao de Inicio ao Visado | Implementado | Via Nota de Comunicacao (3 templates: visado, entidade decisora, entidade visada) |
| 6 | Acusacao | Pendente | Modelo 7. Sera peca processual apos seed |
| 7 | Notificacao da Acusacao | Parcial | Faltam tipos pessoal/postal/publicacao (Modelos 8-10) |
| 8 | Convocatoria do Arguido | Pendente | Modelo 17. Sera peca processual apos seed |
| 9 | Convocatoria de Testemunhas | Pendente | Modelos 16, 27. Serao pecas processuais apos seed |
| 10 | Autos de Declaracoes | Parcial | Autodeclaracao generica existe. Faltam tipos especificos (Modelos 18-22) |
| 11 | Diligencias | Pendente | Modelo 12. Sera peca processual apos seed |
| 12 | Relatorio Final | Implementado | Peca processual com geracao de PDF e validacao |
| 13 | Conclusao da Instrucao | Implementado | Despacho de conclusao apos relatorio final |
| 14 | Despacho Final (Decisao) | Implementado | Decisao com opcoes: exclusao, interdicao, arquivamento, devolucao |
| 15 | Juntada de Documentos | Implementado | Merge de PDFs com capa "Termo de Juntada" |
| 16 | Notificacao Pessoal da Decisao | Parcial | Existe generica, falta tipo PESSOAL (Modelo 34) |
| 17 | Notificacao Postal da Decisao | Pendente | Falta tipo POSTAL (Modelo 33) |
| 18 | Notificacao por Publicacao | Pendente | Falta tipo PUBLICACAO (Modelo 35) |
| 19 | Termo de Encerramento | Parcial | Frontend existe, falta rota backend |

### 12.2 Checklist Documentacao (Processos.pdf - 18 paginas)

| Seccao | Descricao | Estado |
|--------|-----------|--------|
| Listagem de processos | Tabela com filtros, pesquisa, paginacao | Implementado |
| Criar processo | Formulario com campos obrigatorios | Implementado |
| Despacho Inicial | Modal com atribuicao de instrutor e texto | Implementado |
| Instrucao | Tab com pecas processuais e documentos | Implementado |
| Pecas dinamicas | Campos configuraveis por tipo de peca | Implementado (com bugs a corrigir) |
| Despacho Final | Modal com decisao e periodo de exclusao | Implementado |
| Notificacoes | Envio com PDF e email | Implementado (parcial) |
| Decisao Tutelar/Tribunal | CRUD especifico | Implementado |
| Exportacao PDF/CSV | Geracao de relatorios | Implementado |
| Config. Pecas Processuais | Tela CRUD com campos dinamicos | Implementado (com bugs) |

### 12.3 Checklist Formularios (DOCX - 41 templates)

| Grupo | Templates | Estado |
|-------|-----------|--------|
| Anexos 1-5 | Auto Noticia, Capa, Termos, Comunicacoes | 3 de 5 cobertos |
| Modelos 6-11 | Comunicacoes, Acusacao, Notificacoes | 1 de 6 cobertos |
| Modelos 12-15 | Diligencias, Apreensao, Cota, Apensacao | 0 de 4 cobertos |
| Modelos 16-22 | Convocatorias, Declaracoes, Exames | 1 de 7 cobertos (Autodeclaracao) |
| Modelos 23-26 | Juntada, Consulta, Conclusao, Relatorio | 2 de 4 cobertos |
| Modelos 27-30 | Convocatorias defesa, Nao comparencia | 0 de 4 cobertos |
| Modelo 31 | Relatorio Final | Implementado |
| Modelo 32 | Conclusao do Processo | Parcial |
| Modelos 33-35 | Notificacoes da Decisao (3 tipos) | Parcial |
| Modelos 36-41 | Sindicancia | 0 de 6 cobertos |
| **TOTAL** | **41 templates** | **7 de 41 cobertos (17%)** |

### 12.4 Plano de Accao para Conformidade Total

1. **Executar seed script** - Insere os 34 templates em falta como pecas processuais
2. **Corrigir bugs** - 4 bugs na tela de configuracao de pecas processuais
3. **Criar rota Termo Encerramento** - Backend para o passo 19
4. **Notificacoes tipificadas** - 3 tipos para os passos 16-18
5. **Adicionar caso TEXTO** - Permite renderizar todos os 41 tipos de peca
6. **Apos correccoes: 41 de 41 templates cobertos (100%)**

---

*Documento gerado em 2026-02-20 com base na analise completa do codigo-fonte e documentos de especificacao.*
