# SGIGJ - Guia de Setup no Google Cloud / Firebase

## Arquitetura

```
                    ┌─────────────────────────────────────────┐
                    │         Projeto Firebase: cloud-67c43    │
                    │                                          │
  ┌──────────┐     │  ┌─────────────────┐  ┌──────────────┐  │
  │ Browser  │────▶│  │ Firebase Hosting │  │ Cloud Storage │  │
  │          │     │  │                  │  │  (ficheiros)  │  │
  └──────────┘     │  │ Sandbox:         │  └──────────────┘  │
       │           │  │   dev.igj.cv     │                     │
       │           │  │ Produção:        │                     │
       │           │  │   sgigj.igj.cv   │                     │
       │           │  └─────────────────┘                      │
       │           │                                           │
       │           │  ┌─────────────────┐  ┌──────────────┐   │
       └──────────▶│  │   Cloud Run     │  │  Cloud SQL   │   │
                   │  │   (API)         │──│  (MySQL 8.0) │   │
                   │  │                 │  │              │   │
                   │  │ Sandbox:        │  │ Sandbox:     │   │
                   │  │  dev.api.igj.cv │  │  igj-mysql-  │   │
                   │  │ Produção:       │  │  sandbox     │   │
                   │  │  api.igj.cv     │  │ Produção:    │   │
                   │  │                 │  │  igj-mysql-  │   │
                   │  └─────────────────┘  │  production  │   │
                   │                       └──────────────┘   │
                   └──────────────────────────────────────────┘
```

## Pré-requisitos

1. **Conta Google Cloud** com faturação ativada
2. **Firebase CLI**: `npm install -g firebase-tools`
3. **Google Cloud SDK**: [Instalar gcloud](https://cloud.google.com/sdk/docs/install)
4. **Docker**: [Instalar Docker](https://docs.docker.com/get-docker/)

## 1. Setup Inicial

### 1.1 Login nas ferramentas

```bash
# Login no Firebase
firebase login

# Login no Google Cloud
gcloud auth login
gcloud config set project cloud-67c43
```

### 1.2 Executar setup automático

```bash
# Executar o script de setup (cria todos os recursos GCP)
./deploy.sh setup
```

Este script vai:
- Ativar APIs necessárias (Cloud SQL, Cloud Run, Container Registry, Firebase)
- Criar 2 instâncias Cloud SQL MySQL 8.0 (sandbox e produção)
- Criar bases de dados e utilizadores
- Configurar Firebase Hosting sites

### 1.3 Alternativa: Setup manual

Se preferir criar manualmente:

```bash
# Ativar APIs
gcloud services enable cloudsql.googleapis.com run.googleapis.com \
  containerregistry.googleapis.com sqladmin.googleapis.com \
  firebase.googleapis.com firebasehosting.googleapis.com

# Cloud SQL - Sandbox (instância pequena)
gcloud sql instances create igj-mysql-sandbox \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=europe-west1 \
  --storage-size=10GB

# Cloud SQL - Produção (instância com alta disponibilidade)
gcloud sql instances create igj-mysql-production \
  --database-version=MYSQL_8_0 \
  --tier=db-g1-small \
  --region=europe-west1 \
  --storage-size=20GB \
  --availability-type=regional

# Criar bases de dados
gcloud sql databases create igj_bd_sandbox --instance=igj-mysql-sandbox
gcloud sql databases create igj_bd_production --instance=igj-mysql-production

# Criar utilizadores
gcloud sql users create sgigj_sandbox --instance=igj-mysql-sandbox --password=SUA_PASSWORD
gcloud sql users create sgigj_production --instance=igj-mysql-production --password=SUA_PASSWORD
```

## 2. Importação das Bases de Dados

### 2.1 Via Cloud SQL Proxy (recomendado)

```bash
# Instalar Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.darwin.amd64
chmod +x cloud-sql-proxy

# Conectar ao Sandbox
./cloud-sql-proxy cloud-67c43:europe-west1:igj-mysql-sandbox --port=3307 &

# Importar BD para Sandbox
mysql -h 127.0.0.1 -P 3307 -u sgigj_sandbox -p igj_bd_sandbox < docs/DB/prod/igjcv_igj_bd.sql

# Conectar ao Produção
./cloud-sql-proxy cloud-67c43:europe-west1:igj-mysql-production --port=3308 &

# Importar BD para Produção
mysql -h 127.0.0.1 -P 3308 -u sgigj_production -p igj_bd_production < docs/DB/prod/igjcv_igj_bd.sql
```

### 2.2 Via Google Cloud Storage (para ficheiros grandes)

```bash
# Upload do dump para Cloud Storage
gsutil cp docs/DB/prod/igjcv_igj_bd.sql gs://cloud-67c43.appspot.com/db-imports/

# Importar para Sandbox
gcloud sql import sql igj-mysql-sandbox \
  gs://cloud-67c43.appspot.com/db-imports/igjcv_igj_bd.sql \
  --database=igj_bd_sandbox

# Importar para Produção
gcloud sql import sql igj-mysql-production \
  gs://cloud-67c43.appspot.com/db-imports/igjcv_igj_bd.sql \
  --database=igj_bd_production
```

### 2.3 Aplicar updates adicionais

```bash
# Via Cloud SQL Proxy (sandbox na porta 3307)
mysql -h 127.0.0.1 -P 3307 -u sgigj_sandbox -p igj_bd_sandbox < api/update.sql
```

## 3. Configurar Variáveis de Ambiente

Após criar os recursos, atualizar os ficheiros `.env`:

### api/.env.sandbox
```
DB_HOST=/cloudsql/cloud-67c43:europe-west1:igj-mysql-sandbox
DB_USER=sgigj_sandbox
DB_PASSWORD=<password definida no setup>
DB_DATABASE=igj_bd_sandbox
```

### api/.env.production
```
DB_HOST=/cloudsql/cloud-67c43:europe-west1:igj-mysql-production
DB_USER=sgigj_production
DB_PASSWORD=<password definida no setup>
DB_DATABASE=igj_bd_production
APP_KEY=<gerar nova chave: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```

## 4. Configurar Domínios Personalizados

### 4.1 Firebase Hosting (Frontend)

```bash
# No Firebase Console > Hosting > Domínios personalizados
# Ou via CLI:

# Sandbox: dev.igj.cv
firebase hosting:sites:update igj-sandbox --project cloud-67c43

# Produção: sgigj.igj.cv
firebase hosting:sites:update igj-production --project cloud-67c43
```

**No painel DNS do domínio igj.cv, adicionar:**

| Tipo  | Nome        | Valor                                    |
|-------|-------------|------------------------------------------|
| CNAME | dev         | igj-sandbox.web.app                      |
| CNAME | sgigj       | igj-production.web.app                   |
| TXT   | dev         | (valor fornecido pelo Firebase Console)  |
| TXT   | sgigj       | (valor fornecido pelo Firebase Console)  |

### 4.2 Cloud Run (API)

```bash
# Mapear domínio para API Sandbox
gcloud beta run domain-mappings create \
  --service=sgigj-api-sandbox \
  --domain=dev.api.igj.cv \
  --region=europe-west1

# Mapear domínio para API Produção
gcloud beta run domain-mappings create \
  --service=sgigj-api-production \
  --domain=api.igj.cv \
  --region=europe-west1
```

**No painel DNS do domínio igj.cv, adicionar:**

| Tipo  | Nome     | Valor                                           |
|-------|----------|-------------------------------------------------|
| CNAME | dev.api  | ghs.googlehosted.com                            |
| CNAME | api      | ghs.googlehosted.com                            |

## 5. Deploy

### 5.1 Deploy interativo

```bash
./deploy.sh
```

### 5.2 Deploy por comando

```bash
# Frontend
./deploy.sh frontend-sandbox
./deploy.sh frontend-production

# API
./deploy.sh api-sandbox
./deploy.sh api-production

# Tudo
./deploy.sh all-sandbox
./deploy.sh all-production
```

## 6. CI/CD (Cloud Build)

Para deploy automático via git push:

```bash
# Criar trigger para sandbox (branch develop)
gcloud builds triggers create github \
  --repo-name=sgigj \
  --repo-owner=SEU_GITHUB \
  --branch-pattern="^develop$" \
  --build-config=cloudbuild-sandbox.yaml

# Criar trigger para produção (branch main)
gcloud builds triggers create github \
  --repo-name=sgigj \
  --repo-owner=SEU_GITHUB \
  --branch-pattern="^main$" \
  --build-config=cloudbuild-production.yaml
```

## 7. Custos Estimados (mensal)

| Serviço | Sandbox | Produção |
|---------|---------|----------|
| Cloud SQL | ~$8 (db-f1-micro) | ~$26 (db-g1-small HA) |
| Cloud Run | ~$0-5 (escala a zero) | ~$15-30 (min 1 instância) |
| Firebase Hosting | Grátis (< 10GB) | Grátis (< 10GB) |
| Cloud Storage | ~$1-2 | ~$1-2 |
| **Total** | **~$10-15** | **~$42-58** |

## 8. Comandos Úteis

```bash
# Ver logs da API
gcloud run services logs read sgigj-api-sandbox --region=europe-west1 --limit=50
gcloud run services logs read sgigj-api-production --region=europe-west1 --limit=50

# Conectar à BD via proxy
./cloud-sql-proxy cloud-67c43:europe-west1:igj-mysql-sandbox --port=3307

# Ver estado dos serviços
gcloud run services list --region=europe-west1
gcloud sql instances list

# Backup manual da BD
gcloud sql backups create --instance=igj-mysql-production
```
