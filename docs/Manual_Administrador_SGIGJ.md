# Manual do Administrador de Sistema -- SGIGJ

**Sistema Integrado de Gestao da Inspecao Geral de Jogos de Cabo Verde**

Versao: 1.0
Data: 20 de Fevereiro de 2026
Classificacao: Documento Interno -- Confidencial

---

## Indice

1. [Visao Geral da Arquitectura](#1-visao-geral-da-arquitectura)
2. [Requisitos do Sistema](#2-requisitos-do-sistema)
3. [Instalacao e Implantacao](#3-instalacao-e-implantacao)
4. [Configuracao de Ambientes](#4-configuracao-de-ambientes)
5. [Gestao da Base de Dados](#5-gestao-da-base-de-dados)
6. [Gestao de Utilizadores e Perfis](#6-gestao-de-utilizadores-e-perfis)
7. [Configuracao de Seguranca](#7-configuracao-de-seguranca)
8. [Monitorizacao e Auditoria](#8-monitorizacao-e-auditoria)
9. [Copia de Seguranca e Recuperacao](#9-copia-de-seguranca-e-recuperacao)
10. [Guia de Resolucao de Problemas](#10-guia-de-resolucao-de-problemas)

---

## 1. Visao Geral da Arquitectura

### 1.1 Descricao do Sistema

O SGIGJ (Sistema Integrado de Gestao da Inspecao Geral de Jogos) e uma aplicacao web desenvolvida para a IGJ de Cabo Verde. O sistema gere processos de exclusao, autoexclusao, eventos de entidades de jogos, handpay, financas (impostos, contribuicoes, contrapartidas, premios), processos sancionatorios e orcamento.

### 1.2 Diagrama da Arquitectura

```
+-------------------+       +--------------------+       +-------------------+
|                   |       |                    |       |                   |
|  Frontend React   | <---> |  API AdonisJS v4   | <---> |  MySQL 8.0        |
|  (Firebase        |  JWT  |  (Cloud Run)       | SQL   |  (Cloud SQL)      |
|   Hosting)        |       |                    |       |                   |
|                   |       |                    |       |                   |
+-------------------+       +--------+-----------+       +-------------------+
                                     |
                            +--------+-----------+
                            |                    |
                            |  Firebase Storage  |
                            |  (Documentos/PDFs) |
                            |                    |
                            +--------------------+
```

### 1.3 Componentes Principais

| Componente | Tecnologia | Localizacao |
|---|---|---|
| **Frontend** | React 17 + React Bootstrap 1.6 | Firebase Hosting |
| **Backend (API)** | AdonisJS v4 (Node.js 16) | Google Cloud Run |
| **Base de Dados** | MySQL 8.0 (UTF-8) | Google Cloud SQL |
| **Armazenamento** | Firebase Storage | Firebase (gs://igj-sgigj) |
| **Comunicacao em Tempo Real** | Socket.io 4.x | Integrado na API |
| **Autenticacao** | JWT (jsonwebtoken) | API |
| **Geracao de PDFs** | Puppeteer + Chromium | API (Cloud Run) |

### 1.4 Projecto GCP

- **Projecto Firebase/GCP:** `igj-sgigj`
- **Regiao Cloud Run:** `europe-west1`
- **Instancia Cloud SQL Sandbox:** `igj-sgigj:europe-west1:igj-mysql-sandbox`
- **Instancia Cloud SQL Producao:** `igj-sgigj:europe-west1:igj-mysql-production`
- **Storage Bucket:** `gs://igj-sgigj.firebasestorage.app`
- **Service Account Firebase:** `firebase-admin-sdk@igj-sgigj.iam.gserviceaccount.com`

### 1.5 Estrutura de Diretorios do Projecto

```
sgigj/
  api/                          # Backend AdonisJS
    app/
      Controllers/
        Http/                   # Controladores REST (~90 ficheiros)
        functionsDatabase.js    # Funcoes utilitarias (ID, validacao, login, etc.)
      Middleware/
        Authentication.js       # Middleware JWT customizado
        ConvertEmptyStringsToNull.js
      Models/                   # Modelos Lucid ORM (~80 modelos)
      utils/
        DatabaseAuditoria.js    # Wrapper de auditoria para operacoes BD
    config/
      app.js                    # Configuracao da aplicacao
      auth.js                   # Configuracao de autenticacao
      cors.js                   # Configuracao CORS
      database.js               # Configuracao de ligacao a BD
      firebase.js               # Inicializacao Firebase Admin SDK
      jwt.js                    # Configuracao JWT (secret, expiresIn)
    database/
      migrations/               # ~90 ficheiros de migracao
      seeds/                    # Seeds (ImpostoParametrizadoSeeder)
    start/
      app.js                    # Providers e aliases
      kernel.js                 # Middleware global e nomeado
      routes.js                 # Definicao de todas as rotas API
      socket.js                 # Configuracao Socket.io
    .env                        # Variaveis de ambiente (local)
    .env.sandbox                # Variaveis de ambiente (sandbox)
    .env.production             # Variaveis de ambiente (producao)
    env-sandbox.yaml            # Env vars para deploy Cloud Run (sandbox)
    env-production.yaml         # Env vars para deploy Cloud Run (producao)
    Dockerfile                  # Imagem Docker para Cloud Run
    server.js                   # Ponto de entrada + timers agendados
    update.sql                  # Scripts SQL de actualizacao manual
    package.json                # Dependencias Node.js
  frontend/                     # Frontend React
    .env                        # REACT_APP_API_URL
    package.json                # Dependencias React
    src/                        # Codigo fonte React
    build/                      # Build de producao
  docs/                         # Documentacao
```

---

## 2. Requisitos do Sistema

### 2.1 Requisitos de Infraestrutura (Producao)

| Recurso | Especificacao Minima |
|---|---|
| **Google Cloud Run** | 1 vCPU, 512 MB RAM (recomendado: 2 vCPU, 1 GB RAM) |
| **Cloud SQL (MySQL)** | db-f1-micro para sandbox; db-n1-standard-1 para producao |
| **Firebase Hosting** | Plano Blaze (pay-as-you-go) |
| **Firebase Storage** | Plano Blaze |
| **Regiao GCP** | europe-west1 (Belgica) |

### 2.2 Requisitos de Desenvolvimento Local

| Recurso | Versao |
|---|---|
| **Node.js** | 16.x (LTS) -- conforme Dockerfile |
| **npm** | 8.x ou superior |
| **MySQL / MariaDB** | 8.0 / 10.x |
| **Chromium** | Necessario para geracao de PDFs (Puppeteer) |
| **Git** | 2.x ou superior |
| **Google Cloud SDK** | Ultima versao estavel |
| **Firebase CLI** | Ultima versao estavel |

### 2.3 Requisitos de Rede

| Servico | Porta | Protocolo |
|---|---|---|
| API (local) | 3333 | HTTP |
| MySQL (local) | 3306 | TCP |
| Cloud SQL | Socket Unix | Via Cloud SQL Proxy |
| Firebase Hosting | 443 | HTTPS |
| Cloud Run | 443 | HTTPS |
| SMTP (Email IGJ) | 465 | SMTPS |
| Socket.io | Mesmo porto da API | WebSocket/HTTP |

### 2.4 Navegadores Suportados (Frontend)

- Google Chrome (ultimas 2 versoes)
- Mozilla Firefox (ultimas 2 versoes)
- Safari (ultima versao)
- Microsoft Edge (ultimas 2 versoes)

---

## 3. Instalacao e Implantacao

### 3.1 Configuracao do Ambiente Local

#### 3.1.1 Clonar o Repositorio

```bash
git clone <url-do-repositorio> sgigj
cd sgigj
```

#### 3.1.2 Instalar Dependencias do Backend

```bash
cd api
npm install --legacy-peer-deps
```

> **Nota:** A flag `--legacy-peer-deps` e necessaria devido a dependencias de versoes mais antigas do AdonisJS v4.

#### 3.1.3 Configurar a Base de Dados Local

Criar a base de dados MySQL:

```sql
CREATE DATABASE igjcv_igj_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'igjcv_sgigj'@'localhost' IDENTIFIED BY '<password_segura>';
GRANT ALL PRIVILEGES ON igjcv_igj_bd.* TO 'igjcv_sgigj'@'localhost';
FLUSH PRIVILEGES;
```

#### 3.1.4 Configurar o Ficheiro .env

Copiar o ficheiro de exemplo e ajustar as variaveis:

```bash
cp .env.local .env
```

Editar o ficheiro `.env` com as configuracoes locais (ver Seccao 4 para detalhes).

#### 3.1.5 Executar Migracoes

```bash
node ace migration:run
```

#### 3.1.6 Executar Scripts de Actualizacao

Se necessario, aplicar o script de actualizacao manual:

```bash
mysql -u igjcv_sgigj -p igjcv_igj_bd < update.sql
```

#### 3.1.7 Executar Seeds (Dados Iniciais)

```bash
node ace seed --files=ImpostoParametrizadoSeeder.js
```

Ou via endpoint disponibilizado:

```
GET /seeder
```

#### 3.1.8 Iniciar o Servidor

```bash
npm start
# ou
node server.js
```

O servidor estara disponivel em `http://127.0.0.1:3333`.

#### 3.1.9 Instalar e Executar o Frontend

```bash
cd ../frontend
npm install
npm start
```

O frontend estara disponivel em `http://localhost:3000`.

### 3.2 Implantacao em Producao (Cloud Run)

#### 3.2.1 Pre-requisitos

- Google Cloud SDK instalado e autenticado (`gcloud auth login`)
- Firebase CLI instalado (`npm install -g firebase-tools`)
- Projecto GCP configurado: `gcloud config set project igj-sgigj`

#### 3.2.2 Deploy do Backend (API)

**Passo 1: Construir a imagem Docker**

```bash
cd api
gcloud builds submit --tag gcr.io/igj-sgigj/sgigj-api
```

**Passo 2: Fazer deploy no Cloud Run**

Para **sandbox**:

```bash
gcloud run deploy sgigj-api-sandbox \
  --image gcr.io/igj-sgigj/sgigj-api \
  --platform managed \
  --region europe-west1 \
  --env-vars-file env-sandbox.yaml \
  --add-cloudsql-instances igj-sgigj:europe-west1:igj-mysql-sandbox \
  --allow-unauthenticated \
  --port 3333 \
  --memory 1Gi \
  --cpu 2
```

Para **producao**:

```bash
gcloud run deploy sgigj-api-production \
  --image gcr.io/igj-sgigj/sgigj-api \
  --platform managed \
  --region europe-west1 \
  --env-vars-file env-production.yaml \
  --add-cloudsql-instances igj-sgigj:europe-west1:igj-mysql-production \
  --allow-unauthenticated \
  --port 3333 \
  --memory 1Gi \
  --cpu 2
```

> **Nota sobre Puppeteer:** O Dockerfile ja inclui a instalacao do Chromium e configura `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` e `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`. Esta configuracao e essencial para a geracao de PDFs no Cloud Run.

#### 3.2.3 Deploy do Frontend (Firebase Hosting)

**Passo 1: Configurar a URL da API no frontend**

Editar `frontend/.env`:

```
REACT_APP_API_URL=https://sgigj-api-production-935874352349.europe-west1.run.app
```

**Passo 2: Build do frontend**

```bash
cd frontend
npm run build
```

**Passo 3: Deploy para Firebase Hosting**

```bash
firebase login
firebase use igj-sgigj
firebase deploy --only hosting
```

#### 3.2.4 Verificacao Pos-Deploy

Apos o deploy, verificar:

1. **API a funcionar:** Aceder ao URL do Cloud Run -- deve retornar `"developed by isone.cv"`
2. **Ligacao a BD:** Testar login via `POST /sessions`
3. **Frontend:** Aceder ao URL do Firebase Hosting e verificar o login
4. **WebSocket:** Verificar que o Socket.io liga correctamente (icone de utilizadores online)
5. **Geracao de PDFs:** Testar exportacao de um relatorio em PDF

---

## 4. Configuracao de Ambientes

### 4.1 Variaveis de Ambiente do Backend (api/.env)

O sistema utiliza ficheiros `.env` separados para cada ambiente. As variaveis sao carregadas pelo AdonisJS automaticamente.

#### 4.1.1 Configuracao da Aplicacao

| Variavel | Descricao | Exemplo |
|---|---|---|
| `HOST` | Endereco de escuta | `0.0.0.0` (producao), `127.0.0.1` (local) |
| `PORT` | Porto HTTP | `3333` |
| `NODE_ENV` | Ambiente | `development`, `production` |
| `APP_NAME` | Nome da aplicacao | `SGIGJ-Production` |
| `APP_URL` | URL publica da API | `https://sgigj-api-production-....run.app` |
| `APP_KEY` | Chave secreta (JWT + encriptacao) | String de 32 caracteres |
| `APP_PATH` | Caminho absoluto da aplicacao | `/app` (Docker), caminho local |
| `CACHE_VIEWS` | Cache de views | `true` (producao), `false` (dev) |

> **IMPORTANTE:** A variavel `APP_KEY` e usada como segredo JWT. Deve ser unica, aleatoria e nunca partilhada. Alterar esta chave invalidara todos os tokens JWT activos.

#### 4.1.2 Configuracao da Base de Dados

| Variavel | Descricao | Exemplo |
|---|---|---|
| `DB_CONNECTION` | Tipo de BD | `mysql` |
| `DB_HOST` | Host MySQL ou socket path | `127.0.0.1` (local), `/cloudsql/igj-sgigj:europe-west1:igj-mysql-sandbox` (Cloud SQL) |
| `DB_PORT` | Porto MySQL | `3306` |
| `DB_USER` | Utilizador MySQL | `sgigj_sandbox` |
| `DB_PASSWORD` | Password MySQL | *(confidencial)* |
| `DB_DATABASE` | Nome da BD | `igj_bd_sandbox` |
| `HASH_DRIVER` | Algoritmo de hash | `bcrypt` |

> **Nota:** Quando `DB_HOST` comeca por `/`, o sistema usa ligacao via socket Unix (utilizado pelo Cloud SQL Proxy no Cloud Run). Caso contrario, usa ligacao TCP standard.

#### 4.1.3 Configuracao de Email

| Variavel | Descricao | Exemplo |
|---|---|---|
| `MAILER_HOST` | Servidor SMTP | `mail.igj.cv` |
| `MAILER_PORT` | Porto SMTP | `465` |
| `MAILER_USER` | Utilizador SMTP | `app@igj.cv` |
| `MAILER_PASSWORD` | Password SMTP | *(confidencial)* |
| `EMAIL_SENDER` | Remetente dos emails | `app@igj.cv` |

#### 4.1.4 Configuracao do Firebase

| Variavel | Descricao |
|---|---|
| `PROJECT_ID` | ID do projecto Firebase (`igj-sgigj`) |
| `PRIVATE_KEY_ID` | ID da chave privada do service account |
| `PRIVATE_KEY` | Chave privada RSA (PEM) do service account |
| `CLIENT_EMAIL` | Email do service account |
| `CLIENT_ID` | ID do client |
| `CLIENT_X509_CERT_URL` | URL do certificado X.509 |
| `STORAGEBUCKET` | Bucket do Firebase Storage |

> **IMPORTANTE:** A `PRIVATE_KEY` contem quebras de linha codificadas como `\n`. O sistema faz a conversao automatica em `config/firebase.js` via `process.env.PRIVATE_KEY.replace(/\\n/g, '\n')`.

#### 4.1.5 Configuracao IGJ Especifica

| Variavel | Descricao |
|---|---|
| `IDJ_ID` | Identificador unico da instancia IGJ |
| `PECAPROCESSUAL_RECLAMACAOVISADO_ID` | ID da peca processual "Reclamacao Visado" |
| `PECAPROCESSUAL_NOTACOMUNICACAO_ID` | ID da peca processual "Nota de Comunicacao" |
| `PECAPROCESSUAL_PROVA_ID` | ID da peca processual "Prova" |
| `PECAPROCESSUAL_RELATORIOFINAL_ID` | ID da peca processual "Relatorio Final" |
| `PECAPROCESSUAL_AUTODECLARACAO_ID` | ID da peca processual "Autodeclaracao" |
| `PECAPROCESSUAL_JUNTADA_ID` | ID da peca processual "Juntada" |
| `PECAPROCESSUAL_TERMO_ENCERRAMENTO_ID` | ID da peca processual "Termo de Encerramento" |
| `PRAZO_EXCLUSAO` | Prazo em dias para processos de exclusao |
| `GMT` | Fuso horario | `Etc/GMT+1` (Cabo Verde) |
| `ZOOM_PDF` | Nivel de zoom para geracao de PDFs |

#### 4.1.6 Configuracao Puppeteer (apenas Cloud Run)

| Variavel | Descricao |
|---|---|
| `PUPPETEER_EXECUTABLE_PATH` | Caminho para o Chromium (`/usr/bin/chromium`) |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | Saltar download do Chromium (`true`) |

### 4.2 Variaveis de Ambiente do Frontend (frontend/.env)

| Variavel | Descricao | Exemplo |
|---|---|---|
| `REACT_APP_API_URL` | URL base da API | `https://sgigj-api-sandbox-....run.app` |
| `SKIP_PREFLIGHT_CHECK` | Saltar verificacao de versoes | `true` |

### 4.3 Ficheiros YAML para Deploy (Cloud Run)

Os ficheiros `env-sandbox.yaml` e `env-production.yaml` contem as mesmas variaveis do `.env` em formato YAML, utilizados pelo comando `gcloud run deploy --env-vars-file`.

**Formato:**

```yaml
HOST: "0.0.0.0"
NODE_ENV: "production"
APP_NAME: "SGIGJ-Production"
DB_CONNECTION: "mysql"
DB_HOST: "/cloudsql/igj-sgigj:europe-west1:igj-mysql-production"
# ... (restantes variaveis)
```

### 4.4 Ambientes Disponiveis

| Ambiente | API URL | BD | Utilizacao |
|---|---|---|---|
| **Local** | `http://127.0.0.1:3333` | `igjcv_igj_bd` (local) | Desenvolvimento |
| **Sandbox** | `https://sgigj-api-sandbox-....run.app` | `igj_bd_sandbox` (Cloud SQL) | Testes e QA |
| **Producao** | `https://sgigj-api-production-....run.app` | `igj_bd_production` (Cloud SQL) | Producao |

---

## 5. Gestao da Base de Dados

### 5.1 Estrutura da Base de Dados

A base de dados MySQL utiliza encoding UTF-8 e fuso horario `Atlantic/Cape_Verde`. O schema contem aproximadamente 90 tabelas organizadas nas seguintes categorias:

#### 5.1.1 Tabelas de Sistema (prefixo `glb`)

| Tabela | Descricao |
|---|---|
| `glbuser` | Utilizadores do sistema |
| `glbperfil` | Perfis/papeis de utilizador |
| `glbperfilmenu` | Relacao perfil-menu (permissoes) |
| `glbmenu` | Menus e funcionalidades do sistema |
| `glbgeografia` | Dados geograficos (ilhas, concelhos, etc.) |
| `glbnotificacao` | Notificacoes do sistema |
| `glbpredefinicao` | Configuracoes pre-definidas |

#### 5.1.2 Tabelas de Gestao (prefixo `sgigj`)

| Tabela | Descricao |
|---|---|
| `sgigjentidade` | Entidades de jogos (casinos, etc.) |
| `sgigjentidadegrupo` | Grupos de entidades |
| `sgigjentidademaquina` | Maquinas das entidades |
| `sgigjentidadebanca` | Bancas das entidades |
| `sgigjentidadeequipamento` | Equipamentos das entidades |
| `sgigjentidadeevento` | Eventos das entidades |
| `sgigjpessoa` | Pessoas (funcionarios, jogadores, etc.) |
| `sgigjrelpessoaentidade` | Relacao pessoa-entidade |
| `sgigjhandpay` | Registos de handpay |

#### 5.1.3 Tabelas de Processos

| Tabela | Descricao |
|---|---|
| `sgigjprocessoexclusao` | Processos de exclusao/interdicao |
| `sgigjprocessoautoexclusao` | Processos de autoexclusao |
| `sgigjprocessodespacho` | Despachos dos processos |
| `sgigjdespachofinal` | Despachos finais |
| `sgigjdespachointerrompido` | Despachos interrompidos |
| `sgigjrelprocessoinstrucao` | Instrucoes dos processos |
| `sgigjrelprocessoinstrutor` | Instrutores dos processos |
| `sgigjrelinstrutorpeca` | Pecas dos instrutores |
| `sgigjexclusaoreclamacao` | Reclamacoes de exclusao |
| `notificacao_processos` | Notificacoes de processos |
| `decisao_tribunal_processos` | Decisoes do tribunal |
| `decisao_tutelar_processos` | Decisoes tutelares |

#### 5.1.4 Tabelas Parametricas (prefixo `sgigjpr`)

| Tabela | Descricao |
|---|---|
| `sgigjprgenero` | Generos |
| `sgigjprestadocivil` | Estados civis |
| `sgigjprdocumentotp` | Tipos de documento |
| `sgigjprcontactotp` | Tipos de contacto |
| `sgigjprentidadetp` | Tipos de entidade |
| `sgigjprmaquinatp` | Tipos de maquina |
| `sgigjprbancatp` | Tipos de banca |
| `sgigjprequipamentotp` | Tipos de equipamento |
| `sgigjpreventotp` | Tipos de evento |
| `sgigjprdecisaotp` | Tipos de decisao |
| `sgigjprinfracaotp` | Tipos de infracao |
| `sgigjprorigemtp` | Tipos de origem |
| `sgigjprpecasprocessual` | Tipos de pecas processuais |
| `sgigjprmotivoesclusaotp` | Tipos de motivo de exclusao |
| `sgigjprexclusaoperiodo` | Periodos de exclusao |
| `sgigjprstatus` | Estados possiveis |
| `sgigjprtipologia` | Tipologias |
| `sgigjprprofissao` | Profissoes |

#### 5.1.5 Tabelas Financeiras

| Tabela | Descricao |
|---|---|
| `impostos` | Impostos |
| `impostoparametrizados` | Parametrizacao de impostos |
| `pagamentosimpostos` | Pagamentos de impostos |
| `contribuicoes` | Contribuicoes |
| `pagamentoscontribuicoes` | Pagamentos de contribuicoes |
| `contrapartidas` | Contrapartidas |
| `contrapartidapagamentos` | Pagamentos de contrapartidas |
| `contrapartidaentidade` | Contrapartidas por entidade |
| `premios` | Premios |
| `projetos` | Projectos |
| `rubricas` | Rubricas orcamentais |
| `orcamentos` | Orcamentos |
| `cabimentacaos` | Cabimentacoes |

#### 5.1.6 Tabela de Auditoria

| Tabela | Descricao |
|---|---|
| `auditoria` | Log completo de todas as operacoes CRUD |

### 5.2 Migracoes

O AdonisJS utiliza um sistema de migracoes para gestao do schema da base de dados. Os ficheiros de migracao encontram-se em `api/database/migrations/`.

#### 5.2.1 Executar Migracoes Pendentes

```bash
cd api
node ace migration:run
```

#### 5.2.2 Reverter Ultima Migracao

```bash
node ace migration:rollback
```

#### 5.2.3 Verificar Estado das Migracoes

```bash
node ace migration:status
```

#### 5.2.4 Executar Scripts SQL Manuais

Para actualizacoes que nao sao cobertas pelas migracoes, utilizar o ficheiro `update.sql`:

```bash
mysql -u <utilizador> -p <base_dados> < update.sql
```

O ficheiro `update.sql` contem actualmente:

- Adicao da coluna `DESPACHO_INTERROMPIDO_ID` a tabela `sgigjreldocumento`
- Alteracao da coluna `FLAG_NOTIFICACAO` na tabela `glbuser`
- Adicao da coluna `TIPO_NOTIFICACAO` a tabela `notificacao_processos`
- Adicao de colunas de Termo de Encerramento a `sgigjprocessoexclusao`

### 5.3 Seeds (Dados Iniciais)

Os seeds permitem popular tabelas com dados iniciais. Actualmente existe:

- `ImpostoParametrizadoSeeder.js` -- Dados de parametrizacao de impostos

```bash
node ace seed --files=ImpostoParametrizadoSeeder.js
```

Tambem existe um endpoint `GET /seeder` que pode ser utilizado para executar seeds via HTTP.

### 5.4 Convencoes da Base de Dados

- **Chaves primarias:** Todas as tabelas usam `ID` como chave primaria, tipo `varchar(36)`, com valor gerado aleatoriamente (hash criptografico de 36 caracteres)
- **Soft delete:** Os registos nao sao fisicamente eliminados; o campo `ESTADO` e alterado para `0`, e os campos `DELETADO_POR` e `DELETADO_EM` sao preenchidos
- **Auditoria:** Todas as operacoes de insercao, actualizacao e eliminacao sao registadas na tabela `auditoria` atraves do wrapper `DatabaseAuditoria`
- **Timestamps:** Campo `DT_REGISTO` para data de criacao; formato `YYYY-MM-DD HH:mm:ss` no fuso horario de Cabo Verde (`Etc/GMT+1`)
- **Codigos automaticos:** Campo `CODIGO` gerado automaticamente com padding de zeros (e.g., `00001`)
- **Fuso horario:** A ligacao MySQL esta configurada para `Atlantic/Cape_Verde`

### 5.5 Ligacao a Cloud SQL

Em ambiente Cloud Run, a ligacao a base de dados e feita via socket Unix:

```
DB_HOST=/cloudsql/igj-sgigj:europe-west1:igj-mysql-<ambiente>
```

O ficheiro `config/database.js` detecta automaticamente se `DB_HOST` comeca por `/` e configura a ligacao via `socketPath` em vez de `host:port`.

Para aceder a Cloud SQL localmente, utilizar o Cloud SQL Proxy:

```bash
cloud-sql-proxy igj-sgigj:europe-west1:igj-mysql-sandbox --port=3307
```

---

## 6. Gestao de Utilizadores e Perfis

### 6.1 Modelo de Utilizadores

A tabela `glbuser` armazena os dados dos utilizadores do sistema:

| Campo | Tipo | Descricao |
|---|---|---|
| `ID` | varchar(36) | Identificador unico |
| `PERFIL_ID` | varchar(36) | FK para `glbperfil` -- define o papel |
| `REL_PESSOA_ENTIDADE_ID` | varchar(36) | FK para `sgigjrelpessoaentidade` -- ligacao a pessoa |
| `CODIGO` | varchar(10) | Codigo automatico |
| `USERNAME` | varchar(64) | Nome de utilizador (login) |
| `PASSWORD` | varchar(64) | Hash bcrypt da password |
| `PASSWORD_DT_ALTERACAO` | date | Data da ultima alteracao de password |
| `ULTIMO_LOGIN` | date | Data do ultimo login |
| `URL_FOTO` | varchar(64000) | URL da foto de perfil |
| `ASSINATURA_URL` | varchar(64000) | URL da assinatura digital |
| `FLAG_NOTIFICACAO` | varchar(1) | Flag de notificacao |
| `ESTADO` | varchar(1) | Estado: `1` = activo, `0` = inactivo/eliminado |
| `CRIADO_POR` | varchar(36) | FK para o utilizador criador |
| `DT_REGISTO` | timestamp | Data de criacao |

### 6.2 Perfis de Utilizador (Papeis)

O sistema possui 6 perfis de utilizador pre-definidos:

| Perfil | Descricao | Acesso |
|---|---|---|
| **Super Admin** | Acesso total ao sistema | Todas as funcionalidades |
| **Administrador** | Gestao administrativa | Gestao de utilizadores, perfis, parametrizacao |
| **Gabinete** | Acesso de gabinete | Processos, documentos, despachos |
| **Inspetor** | Acesso de inspector | Inspeccoes, processos, relatorios |
| **Instrutor** | Tratamento de processos | Instrucao de processos, pecas processuais |
| **Entidade** | Acesso limitado (casino/empresa) | Apenas dados da sua entidade |

> **Perfis protegidos:** Os perfis com IDs `c55fc99dc15b5f5e22abb36d3eb393db4082` (Administrador) e `f8382845e6dad3fb2d2e14aa45b14f0f85de` (Inspectores) nao podem ser eliminados pelo sistema.

### 6.3 Sistema de Permissoes (RBAC)

O controlo de acesso baseia-se na relacao entre **perfis** e **menus** atraves da tabela `glbperfilmenu`:

```
glbperfil (1) -----> (N) glbperfilmenu (N) <----- (1) glbmenu
```

Cada menu (`glbmenu`) tem os seguintes campos relevantes:

| Campo | Descricao |
|---|---|
| `DS_MENU` | Descricao do menu |
| `URL` | URL da funcionalidade (e.g., `/glbuser/Criar`, `/sgigjentidade/Ler`) |
| `TIPO` | Tipo de menu |
| `ORDEM` | Ordem de exibicao |

A funcao `allowed()` em `functionsDatabase.js` verifica as permissoes da seguinte forma:

1. Recebe a tabela, o metodo (Criar/Editar/Eliminar/Ler) e o ID do utilizador
2. Carrega o perfil do utilizador com os menus associados
3. Constroi o URL do menu: `/<tabela>/<metodo>` (e.g., `/glbuser/Criar`)
4. Verifica se o URL existe nos menus do perfil do utilizador
5. Retorna `true` se permitido, `false` caso contrario

> **Excepcao:** A leitura de dados geograficos (`glbgeografia`) e publica e nao requer permissao.

### 6.4 Dashboard por Perfil

O dashboard adapta-se automaticamente ao perfil do utilizador:

| Papel Dashboard | Perfis Associados | Seccoes Visiveis |
|---|---|---|
| **ADMIN** | Super Admin, Administrador | Todas as seccoes |
| **GABINETE** | Gabinete | KPIs, processos, eventos, financeiro |
| **INSPECTOR** | Inspetor, Instrutor | KPIs, processos, eventos |
| **CASINO** | Entidade | Apenas dados da sua entidade |

### 6.5 Operacoes de Gestao de Utilizadores

#### 6.5.1 Criar Utilizador

**Endpoint:** `POST /glbuser`

Requer permissao `Criar` no menu `glbuser`. A password e automaticamente encriptada com bcrypt (salt 10).

#### 6.5.2 Editar Utilizador

**Endpoint:** `PUT /glbuser/:id`

Requer permissao `Editar`. A password e o ultimo login nao podem ser alterados por esta via.

#### 6.5.3 Desactivar Utilizador

**Endpoint:** `DELETE /glbuser/:id`

Realiza um soft delete: `ESTADO` = `0`, regista `DELETADO_POR` e `DELETADO_EM`.

#### 6.5.4 Alterar Password (Proprio Utilizador)

**Endpoint:** `POST /change-password`

Qualquer utilizador autenticado pode alterar a sua propria password.

#### 6.5.5 Actualizar Foto de Perfil

**Endpoint:** `POST /update-own`

Cada utilizador pode actualizar a sua foto de perfil (`URL_FOTO`).

### 6.6 Gestao de Perfis

#### 6.6.1 Criar Perfil

**Endpoint:** `POST /glbperfil`

#### 6.6.2 Atribuir Menus a um Perfil

**Endpoint:** `POST /glbperfilmenu`

Corpo do pedido:

```json
{
  "PERFIL_ID": "<id_do_perfil>",
  "MENUS_ID": "<id_do_menu>"
}
```

#### 6.6.3 Remover Menu de um Perfil

**Endpoint:** `DELETE /glbperfilmenu/:id`

Corpo do pedido:

```json
{
  "PERFIL_ID": "<id_do_perfil>",
  "MENUS_ID": "<id_do_menu>"
}
```

---

## 7. Configuracao de Seguranca

### 7.1 Autenticacao JWT

O sistema utiliza JSON Web Tokens (JWT) para autenticacao:

- **Algoritmo:** HS256 (HMAC SHA-256)
- **Segredo:** Variavel `APP_KEY` (32 caracteres)
- **Expiracao:** 7 dias (configuravel em `config/jwt.js`)
- **Payload do token:**

```json
{
  "id": "<ID_do_utilizador>",
  "perfil": "<PERFIL_ID>"
}
```

#### 7.1.1 Fluxo de Autenticacao

1. O utilizador envia `POST /sessions` com `USERNAME` e `PASSWORD`
2. O sistema verifica as credenciais na tabela `glbuser`
3. Suporta migracao gradual de SHA1 para bcrypt:
   - Se a password comeca por `$2a$` ou `$2b$` -- usa verificacao bcrypt
   - Caso contrario -- verifica SHA1 e migra automaticamente para bcrypt
4. Se valido, retorna um token JWT e dados do utilizador
5. O login e registado na tabela de auditoria
6. Nas chamadas subsequentes, o token deve ser enviado no header: `Authorization: Bearer <token>`

#### 7.1.2 Middleware de Autenticacao

O middleware `Authentication` (`app/Middleware/Authentication.js`) processa cada pedido autenticado:

1. Verifica a presenca do header `Authorization`
2. Extrai e verifica o token JWT
3. Confirma que o utilizador esta activo (`ESTADO <> 0`) na BD
4. Injecciona `request.userID`, `request.perfilID`, `request.io` e `request.connectedsocket` no objecto de pedido

### 7.2 Encriptacao de Passwords

- **Algoritmo:** bcrypt com salt factor 10
- **Migracao:** Passwords SHA1 legadas sao migradas automaticamente para bcrypt no login
- **Armazenamento:** Campo `PASSWORD` na tabela `glbuser` (varchar 64)

### 7.3 Configuracao CORS

Ficheiro: `api/config/cors.js`

Configuracao actual:

```javascript
{
  origin: "*",                    // Aceita qualquer origem
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  headers: true,                  // Aceita todos os headers
  credentials: false,
  maxAge: 90                      // Cache de preflight: 90 segundos
}
```

> **RECOMENDACAO DE SEGURANCA:** Em producao, restringir `origin` aos dominios autorizados do frontend:
>
> ```javascript
> origin: ['https://igj-sgigj.web.app', 'https://sgigj.igj.cv']
> ```

### 7.4 WebSocket (Socket.io)

A configuracao do Socket.io (`start/socket.js`) tambem permite qualquer origem:

```javascript
const io = use('socket.io')(Server.getInstance(), {
  cors: { origin: '*' }
})
```

A autenticacao via WebSocket e feita atraves do token JWT passado como parametro na query de handshake. Tokens invalidos ou expirados resultam em desconexao imediata.

O sistema suporta multiplas abas/ligacoes do mesmo utilizador atraves de um mapa de `Set<socketID>` por utilizador.

### 7.5 Validacao de Dados

O sistema realiza validacao automatica de dados em cada operacao CRUD atraves da funcao `validation()` em `functionsDatabase.js`:

1. **Campos obrigatorios:** Verifica se campos marcados como `notNullable` nas migracoes estao presentes e nao vazios
2. **Tamanho maximo:** Verifica se o valor nao excede o tamanho definido no schema
3. **Tipo de dados:** Verifica se campos numericos contem apenas numeros
4. **Chaves estrangeiras:** Verifica se os registos referenciados existem e estao activos (`ESTADO <> 0`)

### 7.6 Proteccao Contra Eliminacao de Perfis Criticos

Os seguintes IDs de perfil estao protegidos contra eliminacao:

- `c55fc99dc15b5f5e22abb36d3eb393db4082` -- Administrador
- `f8382845e6dad3fb2d2e14aa45b14f0f85de` -- Perfil de Inspectores

Tentativas de eliminar estes perfis retornam HTTP 403.

### 7.7 Boas Praticas de Seguranca

1. **Rotacao de APP_KEY:** Alterar periodicamente a chave `APP_KEY`. Nota: invalida todos os tokens activos.
2. **Passwords fortes:** Enforcar politicas de passwords fortes para todos os utilizadores.
3. **Revisao de permissoes:** Auditar periodicamente as permissoes dos perfis (`glbperfilmenu`).
4. **Monitorizacao de logins:** Consultar regularmente os logs de auditoria para detectar acessos suspeitos.
5. **HTTPS obrigatorio:** Garantir que toda a comunicacao e feita via HTTPS (ja assegurado pelo Cloud Run e Firebase Hosting).
6. **Gestao de segredos:** Nunca commitar ficheiros `.env` com credenciais reais no repositorio. Utilizar `env-*.yaml` com gestao de segredos do GCP.
7. **Restricao CORS:** Restringir origens permitidas em producao.

---

## 8. Monitorizacao e Auditoria

### 8.1 Sistema de Auditoria

Todas as operacoes CRUD do sistema sao registadas automaticamente na tabela `auditoria` atraves do wrapper `DatabaseAuditoria` (`app/utils/DatabaseAuditoria.js`).

#### 8.1.1 Estrutura da Tabela de Auditoria

| Campo | Tipo | Descricao |
|---|---|---|
| `ID` | varchar(36) | Identificador unico |
| `User_ID` | varchar(36) | FK para `glbuser` -- quem realizou a accao |
| `Accao` | varchar(250) | Tipo de accao (`inserção`, `Actualização`, `Exclusão`, `Login`, `Download de Relatorio`) |
| `Model` | varchar(250) | Nome da tabela/modelo afectado |
| `Mode_ID` | varchar(250) | ID do registo afectado |
| `Text_Accao` | varchar(250) | Descricao da accao (e.g., "Criação de utilizador") |
| `Text_Modulo` | varchar(250) | Modulo do sistema (e.g., "Modulo de Gestão") |
| `Text_Detalhe` | varchar(500) | Detalhe adicional |
| `Original` | json | Dados originais antes da alteracao |
| `Alterado` | json | Dados novos/alterados |
| `Created_At` | timestamp | Data e hora da accao |

#### 8.1.2 Tipos de Accoes Registadas

| Accao | Descricao |
|---|---|
| **inserção** | Criacao de novo registo |
| **Actualização** | Alteracao de registo existente |
| **Exclusão** | Eliminacao (soft delete) de registo |
| **Login** | Login de utilizador |
| **Download de Relatorio** | Exportacao de PDF ou CSV |

#### 8.1.3 Consultar Auditoria

**Endpoint:** `GET /auditoria`

Parametros opcionais:

| Parametro | Descricao | Exemplo |
|---|---|---|
| `limit` | Numero de registos por pagina (defeito: 16) | `?limit=50` |
| `offset` | Deslocamento para paginacao | `?offset=16` |
| `User_ID` | Filtrar por utilizador | `?User_ID=<id>` |
| `Model` | Filtrar por tabela/modulo | `?Model=glbuser` |
| `Accao` | Filtrar por tipo de accao | `?Accao=Login` |

**Resposta:**

```json
{
  "data": [
    {
      "ID": "...",
      "User_ID": "...",
      "Accao": "Login",
      "Model": "glbuser",
      "Text_Accao": "Login no Sistema",
      "Text_Modulo": "Modulo de Autenticação",
      "Text_Detalhe": "Sucesso",
      "Created_At": "2026-02-20 10:30:00",
      "user": { /* dados do utilizador */ }
    }
  ],
  "totalItems": 1250
}
```

### 8.2 Utilizadores Online

O sistema rastreia em tempo real quais utilizadores estao ligados atraves do Socket.io.

**Endpoint:** `GET /glbuseronline`

Retorna a lista de utilizadores com sessao WebSocket activa. Suporta multiplas abas/janelas do mesmo utilizador.

### 8.3 Notificacoes do Sistema

O sistema gera notificacoes automaticas para:

1. **Processos de autoexclusao:** Alertas quando restam 90, 30, 5 ou 0 dias para o fim da autoexclusao
2. **Prazos de processos:** Alertas a cada 2 dias quando o prazo de um processo esta a expirar
3. **Prazos de instrucao:** Alertas quando o periodo de instrucao esta a terminar

As notificacoes sao enviadas:
- Aos perfis de Inspector Geral e Inspectores
- As entidades relevantes (para autoexclusao)

O timer de verificacao executa a cada **1 hora** (configurado em `server.js`).

### 8.4 Dashboard de KPIs

O dashboard fornece indicadores-chave de performance:

| Endpoint | Descricao |
|---|---|
| `GET /dashboard/config` | Configuracao de visibilidade por perfil |
| `GET /dashboard/kpis` | KPIs gerais (contagens, totais) |
| `GET /dashboard/financeiro` | Dados financeiros agregados |
| `GET /dashboard/receita-entidade` | Receita por entidade |
| `GET /dashboard/processos` | Estatisticas de processos |
| `GET /dashboard/eventos` | Estatisticas de eventos |
| `GET /dashboard/entidades` | Dados de entidades |
| `GET /dashboard/atividade` | Actividade recente |
| `GET /dashboard/handpay` | Dados de handpay |
| `GET /dashboard/casos-suspeitos` | Casos suspeitos |
| `GET /dashboard/orcamento` | Dados de orcamento |
| `GET /dashboard/filtros` | Filtros disponiveis |

Parametros comuns: `?ano=2026&entidade_id=<id>`

### 8.5 Logs do Cloud Run

Para aceder aos logs do Cloud Run:

```bash
# Logs em tempo real
gcloud run services logs read sgigj-api-production --region europe-west1 --follow

# Logs das ultimas 2 horas
gcloud run services logs read sgigj-api-production --region europe-west1 --limit 500
```

Ou atraves da consola GCP: **Cloud Run > sgigj-api-production > Logs**.

### 8.6 Monitorizacao do Cloud SQL

```bash
# Estado da instancia
gcloud sql instances describe igj-mysql-production

# Metricas
gcloud sql instances list
```

Ou atraves da consola GCP: **Cloud SQL > igj-mysql-production > Monitoring**.

---

## 9. Copia de Seguranca e Recuperacao

### 9.1 Copias de Seguranca da Base de Dados

#### 9.1.1 Backup Automatico (Cloud SQL)

O Cloud SQL fornece backups automaticos diarios. Para configurar:

```bash
gcloud sql instances patch igj-mysql-production \
  --backup-start-time=02:00 \
  --enable-bin-log \
  --retained-backups-count=30
```

> **Recomendacao:** Configurar backups diarios as 02:00 UTC com retencao de 30 dias.

#### 9.1.2 Backup Manual (Cloud SQL)

Criar um backup sob demanda:

```bash
gcloud sql backups create --instance=igj-mysql-production --description="Backup manual antes de actualizacao"
```

Listar backups disponveis:

```bash
gcloud sql backups list --instance=igj-mysql-production
```

#### 9.1.3 Backup Local (mysqldump)

Para ambientes locais ou backup adicional:

```bash
# Backup completo
mysqldump -u <utilizador> -p <base_dados> --single-transaction --routines --triggers > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup de tabela especifica
mysqldump -u <utilizador> -p <base_dados> glbuser --single-transaction > backup_glbuser.sql

# Backup comprimido
mysqldump -u <utilizador> -p <base_dados> --single-transaction | gzip > backup_$(date +%Y%m%d).sql.gz
```

#### 9.1.4 Exportacao para Cloud Storage

```bash
gcloud sql export sql igj-mysql-production gs://igj-sgigj-backups/backup_$(date +%Y%m%d).sql \
  --database=igj_bd_production
```

### 9.2 Copias de Seguranca do Firebase Storage

Os ficheiros no Firebase Storage podem ser copiados para Cloud Storage:

```bash
gsutil -m cp -r gs://igj-sgigj.firebasestorage.app gs://igj-sgigj-backups/storage_$(date +%Y%m%d)/
```

### 9.3 Restauracao da Base de Dados

#### 9.3.1 Restauracao a partir de Backup Cloud SQL

```bash
# Listar backups
gcloud sql backups list --instance=igj-mysql-production

# Restaurar backup especifico
gcloud sql backups restore <BACKUP_ID> --restore-instance=igj-mysql-production
```

> **ATENCAO:** A restauracao de backup substitui TODA a base de dados. Todos os dados apos a data do backup serao perdidos.

#### 9.3.2 Restauracao a partir de mysqldump

```bash
mysql -u <utilizador> -p <base_dados> < backup_20260220.sql
```

#### 9.3.3 Restauracao de Ficheiro Comprimido

```bash
gunzip < backup_20260220.sql.gz | mysql -u <utilizador> -p <base_dados>
```

### 9.4 Plano de Recuperacao de Desastres

#### 9.4.1 Cenario: API Indisponivel

1. Verificar estado do Cloud Run: `gcloud run services describe sgigj-api-production --region europe-west1`
2. Verificar logs: `gcloud run services logs read sgigj-api-production --region europe-west1`
3. Se necessario, re-deploy: `gcloud run deploy sgigj-api-production --image gcr.io/igj-sgigj/sgigj-api --region europe-west1 --env-vars-file env-production.yaml`

#### 9.4.2 Cenario: Base de Dados Corrompida

1. Parar servicos dependentes (escalar Cloud Run para 0 instancias)
2. Restaurar ultimo backup valido
3. Aplicar `update.sql` se necessario
4. Executar migracoes pendentes: `node ace migration:run`
5. Re-activar servicos

#### 9.4.3 Cenario: Credenciais Comprometidas

1. **Imediatamente:**
   - Alterar `APP_KEY` (invalida todos os tokens JWT)
   - Alterar passwords de BD
   - Rodar chave do Service Account Firebase
2. **Deploy:**
   - Actualizar `env-production.yaml` com novas credenciais
   - Re-deploy da API
3. **Pos-incidente:**
   - Auditar logs de acesso
   - Notificar utilizadores para alteracao de passwords
   - Rever permissoes de acesso

### 9.5 Agenda de Backups Recomendada

| Tipo | Frequencia | Retencao | Responsavel |
|---|---|---|---|
| Cloud SQL automatico | Diario (02:00 UTC) | 30 dias | Automatico |
| Cloud SQL manual | Antes de cada deploy | 90 dias | Administrador |
| mysqldump exportacao | Semanal | 180 dias | Administrador |
| Firebase Storage | Semanal | 90 dias | Administrador |
| Codigo-fonte (Git) | Continuo | Ilimitado | Equipa de desenvolvimento |

---

## 10. Guia de Resolucao de Problemas

### 10.1 Problemas de Autenticacao

#### Problema: "authorization header required" (HTTP 401)

**Causa:** O pedido nao inclui o header de autorizacao.

**Solucao:**
- Verificar que o frontend envia `Authorization: Bearer <token>` em todos os pedidos
- Verificar que o token nao expirou (validade: 7 dias)
- Verificar a configuracao `REACT_APP_API_URL` no frontend

#### Problema: "invalid or expired token" (HTTP 401)

**Causa:** O token JWT e invalido ou expirou.

**Solucao:**
- Solicitar novo login ao utilizador
- Verificar que `APP_KEY` e a mesma no ambiente que gerou o token
- Se a `APP_KEY` foi alterada, todos os utilizadores devem fazer novo login

#### Problema: "user inactive or not found" (HTTP 401)

**Causa:** O utilizador foi desactivado (`ESTADO = 0`) ou nao existe.

**Solucao:**
- Verificar o estado do utilizador na tabela `glbuser`
- Reactivar se necessario: `UPDATE glbuser SET ESTADO = 1 WHERE ID = '<id>'`

#### Problema: Login retorna status "242"

**Causa:** Utilizador nao encontrado ou password incorrecta.

**Solucao:**
- Verificar que o `USERNAME` existe na tabela `glbuser`
- Redefinir a password se necessario (ver seccao 10.6)

#### Problema: Login retorna status "250"

**Causa:** Utilizador com `ESTADO = 0` (desactivado).

**Solucao:**
- Reactivar o utilizador: `UPDATE glbuser SET ESTADO = 1 WHERE USERNAME = '<username>'`

### 10.2 Problemas de Permissoes

#### Problema: "create/update/delete not allowed" (HTTP 403)

**Causa:** O perfil do utilizador nao tem permissao para a operacao.

**Solucao:**
1. Identificar o `PERFIL_ID` do utilizador
2. Verificar menus atribuidos ao perfil:
   ```sql
   SELECT gm.URL, gm.DS_MENU
   FROM glbperfilmenu gpm
   JOIN glbmenu gm ON gpm.MENUS_ID = gm.ID
   WHERE gpm.PERFIL_ID = '<perfil_id>'
   AND gpm.ESTADO = 1
   AND gm.ESTADO = 1
   ORDER BY gm.URL;
   ```
3. Adicionar o menu necessario ao perfil via `POST /glbperfilmenu`

### 10.3 Problemas de Base de Dados

#### Problema: Erro de ligacao a BD

**Causa possivel:** Cloud SQL Proxy nao configurado, credenciais incorrectas, instancia nao disponivel.

**Solucao:**
1. Verificar estado da instancia: `gcloud sql instances describe igj-mysql-<ambiente>`
2. Verificar credenciais no ficheiro `.env` / `env-*.yaml`
3. Verificar ligacao Cloud SQL:
   - Em Cloud Run: confirmar `--add-cloudsql-instances` no deploy
   - Localmente: confirmar que o Cloud SQL Proxy esta a funcionar

#### Problema: Erro de migracao

**Solucao:**
1. Verificar estado: `node ace migration:status`
2. Se necessario reverter: `node ace migration:rollback`
3. Corrigir o ficheiro de migracao e re-executar: `node ace migration:run`
4. Em caso de emergencia, aplicar SQL manualmente e marcar migracao como executada

#### Problema: Tabela de auditoria muito grande

**Solucao:**
1. Verificar tamanho: `SELECT COUNT(*) FROM auditoria;`
2. Arquivar registos antigos:
   ```sql
   -- Criar tabela de arquivo
   CREATE TABLE auditoria_archive LIKE auditoria;

   -- Mover registos com mais de 1 ano
   INSERT INTO auditoria_archive
   SELECT * FROM auditoria WHERE Created_At < DATE_SUB(NOW(), INTERVAL 1 YEAR);

   -- Eliminar registos arquivados
   DELETE FROM auditoria WHERE Created_At < DATE_SUB(NOW(), INTERVAL 1 YEAR);
   ```

### 10.4 Problemas de Geracao de PDFs

#### Problema: PDFs nao sao gerados no Cloud Run

**Causa possivel:** Chromium nao instalado ou mal configurado.

**Solucao:**
1. Verificar que o Dockerfile inclui a instalacao do Chromium
2. Confirmar as variaveis de ambiente:
   - `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`
   - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
3. Verificar que a instancia Cloud Run tem memoria suficiente (minimo 512 MB, recomendado 1 GB)
4. Verificar logs para erros de Puppeteer

#### Problema: PDFs gerados com layout incorrecto

**Solucao:**
- Verificar a variavel `ZOOM_PDF` (valor actual: `1`)
- Instalar fonts necessarias no Dockerfile (ja incluido: `fonts-liberation`)

### 10.5 Problemas de Socket.io / Tempo Real

#### Problema: Utilizadores online nao aparecem

**Causa possivel:** WebSocket nao liga, token invalido.

**Solucao:**
1. Verificar que o frontend envia o token na query de handshake do Socket.io
2. Verificar configuracao CORS do Socket.io (`start/socket.js`)
3. Verificar que o Cloud Run suporta WebSockets (activado por defeito)
4. Verificar logs de ligacao/desconexao do Socket.io

#### Problema: Notificacoes nao sao recebidas

**Solucao:**
1. Verificar que o utilizador esta no room correcto (formato: `<userId>*_USER` ou `<perfilId>*_PERFIL`)
2. Verificar o timer em `server.js` (executa a cada 1 hora)
3. Verificar logs do servidor para erros nos callbacks de notificacao

### 10.6 Operacoes de Emergencia

#### Redefinir Password de Utilizador

```sql
-- Gerar hash bcrypt (executar em Node.js)
-- node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('NovaSenha123!', 10).then(h=>console.log(h))"

-- Actualizar na BD
UPDATE glbuser SET PASSWORD = '<hash_bcrypt>' WHERE USERNAME = '<username>';
```

#### Desbloquear Utilizador

```sql
UPDATE glbuser SET ESTADO = 1 WHERE USERNAME = '<username>';
```

#### Verificar Integridade de Permissoes

```sql
-- Listar menus sem perfil associado
SELECT gm.ID, gm.DS_MENU, gm.URL
FROM glbmenu gm
LEFT JOIN glbperfilmenu gpm ON gm.ID = gpm.MENUS_ID
WHERE gpm.ID IS NULL AND gm.ESTADO = 1;

-- Listar utilizadores sem perfil valido
SELECT gu.ID, gu.USERNAME, gu.PERFIL_ID
FROM glbuser gu
LEFT JOIN glbperfil gp ON gu.PERFIL_ID = gp.ID
WHERE gp.ID IS NULL AND gu.ESTADO = 1;
```

#### Forcar Logout de Todos os Utilizadores

Alterar a variavel `APP_KEY` e fazer re-deploy. Todos os tokens JWT serao invalidados.

#### Verificar Timers/Agendamentos

Os processos agendados no `server.js` executam a cada hora:

1. Verificacao de prazos de autoexclusao
2. Verificacao de prazos de processos com despacho
3. Verificacao de prazos de instrucao

Se as notificacoes nao estao a ser enviadas, verificar:

```bash
# Logs do Cloud Run em tempo real
gcloud run services logs read sgigj-api-production --region europe-west1 --follow | grep -i "prazo\|autoexclus\|notifica"
```

### 10.7 Contactos de Suporte

| Nivel | Descricao | Contacto |
|---|---|---|
| **N1 -- Operacional** | Problemas de login, permissoes | Administrador do sistema |
| **N2 -- Tecnico** | Erros de API, BD, deploys | Equipa de desenvolvimento |
| **N3 -- Infraestrutura** | GCP, Cloud SQL, Firebase | Equipa de infraestrutura / GCP Support |

---

## Anexos

### A. Referencia Rapida de Comandos

```bash
# === DESENVOLVIMENTO LOCAL ===
cd api && npm start                            # Iniciar API
cd frontend && npm start                       # Iniciar frontend
node ace migration:run                         # Executar migracoes
node ace migration:rollback                    # Reverter migracao
node ace migration:status                      # Estado das migracoes

# === DEPLOY ===
gcloud builds submit --tag gcr.io/igj-sgigj/sgigj-api              # Build Docker
gcloud run deploy sgigj-api-production ... --env-vars-file env-production.yaml  # Deploy API
cd frontend && npm run build && firebase deploy --only hosting       # Deploy frontend

# === MONITORIZACAO ===
gcloud run services logs read sgigj-api-production --region europe-west1
gcloud sql instances describe igj-mysql-production

# === BACKUP ===
gcloud sql backups create --instance=igj-mysql-production
gcloud sql backups list --instance=igj-mysql-production
gcloud sql export sql igj-mysql-production gs://igj-sgigj-backups/backup.sql --database=igj_bd_production

# === RESTAURACAO ===
gcloud sql backups restore <BACKUP_ID> --restore-instance=igj-mysql-production
```

### B. Mapa de Endpoints da API

| Metodo | Endpoint | Descricao | Auth |
|---|---|---|---|
| `POST` | `/sessions` | Login | Nao |
| `GET` | `/me` | Dados do utilizador actual | Sim |
| `PUT` | `/me` | Actualizar dados proprios | Sim |
| `POST` | `/change-password` | Alterar password | Sim |
| `POST` | `/update-own` | Actualizar foto de perfil | Sim |
| `GET` | `/glbuseronline` | Utilizadores online | Sim |
| `*` | `/glbuser` | CRUD de utilizadores | Sim |
| `*` | `/glbperfil` | CRUD de perfis | Sim |
| `*` | `/glbperfilmenu` | CRUD de permissoes | Sim |
| `*` | `/glbmenu` | CRUD de menus | Sim |
| `*` | `/auditoria` | Consulta de auditoria | Sim |
| `*` | `/sgigjentidade` | CRUD de entidades | Sim |
| `*` | `/sgigjpessoa` | CRUD de pessoas | Sim |
| `*` | `/sgigjprocessoexclusao` | CRUD de processos de exclusao | Sim |
| `*` | `/sgigjprocessoautoexclusao` | CRUD de processos de autoexclusao | Sim |
| `*` | `/sgigjhandpay` | CRUD de handpay | Sim |
| `GET` | `/dashboard/*` | Endpoints do dashboard | Sim |
| `GET` | `/export-pdf/*` | Exportacao PDF | Sim |
| `GET` | `/export-csv/*` | Exportacao CSV | Sim |

> **Nota:** Os endpoints marcados com `*` no metodo suportam CRUD completo: `GET` (listar), `GET /:id` (detalhe), `POST` (criar), `PUT /:id` (editar), `DELETE /:id` (eliminar).

### C. Variaveis de Ambiente -- Modelo Completo

```bash
# === Aplicacao ===
HOST=0.0.0.0
PORT=3333
NODE_ENV=production
APP_NAME=SGIGJ-Production
APP_URL=https://api.igj.cv
APP_KEY=<chave_aleatoria_32_chars>
APP_PATH=/app
CACHE_VIEWS=true

# === Base de Dados ===
DB_CONNECTION=mysql
DB_HOST=/cloudsql/igj-sgigj:europe-west1:igj-mysql-production
DB_PORT=3306
DB_USER=<utilizador>
DB_PASSWORD=<password>
DB_DATABASE=<nome_bd>
HASH_DRIVER=bcrypt

# === Email ===
MAILER_HOST=mail.igj.cv
MAILER_PORT=465
MAILER_USER=app@igj.cv
MAILER_PASSWORD=<password>
EMAIL_SENDER=app@igj.cv

# === Firebase ===
PROJECT_ID=igj-sgigj
PRIVATE_KEY_ID=<id_chave>
PRIVATE_KEY=<chave_privada_pem>
CLIENT_EMAIL=firebase-admin-sdk@igj-sgigj.iam.gserviceaccount.com
CLIENT_ID=<client_id>
CLIENT_X509_CERT_URL=<url_certificado>
STORAGEBUCKET=gs://igj-sgigj.firebasestorage.app

# === Imgur ===
IMG_CLIENTID=<client_id>
IMG_CLIENTSECRETE=<client_secret>

# === IGJ Config ===
IDJ_ID=<id_instancia>
PECAPROCESSUAL_RECLAMACAOVISADO_ID=<id>
PECAPROCESSUAL_NOTACOMUNICACAO_ID=<id>
PECAPROCESSUAL_PROVA_ID=<id>
PECAPROCESSUAL_RELATORIOFINAL_ID=<id>
PECAPROCESSUAL_AUTODECLARACAO_ID=<id>
PECAPROCESSUAL_JUNTADA_ID=<id>
PECAPROCESSUAL_TERMO_ENCERRAMENTO_ID=<id>
PRAZO_EXCLUSAO=10
GMT=Etc/GMT+1
ZOOM_PDF=1

# === Puppeteer (Cloud Run) ===
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

---

*Documento elaborado com base na analise do codigo-fonte do SGIGJ.*
*Ultima actualizacao: 20 de Fevereiro de 2026.*
