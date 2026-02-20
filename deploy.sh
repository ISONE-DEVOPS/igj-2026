#!/bin/bash
set -e

# ============================================================
# SGIGJ - Script de Deployment
# Projeto Firebase: igj-sgigj
# ============================================================

PROJECT_ID="igj-sgigj"
REGION="europe-west1"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar se gcloud e firebase estão instalados
check_dependencies() {
    print_header "Verificando dependências"

    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI não encontrado. Instale: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    print_success "gcloud CLI encontrado"

    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI não encontrado. Instale: npm install -g firebase-tools"
        exit 1
    fi
    print_success "Firebase CLI encontrado"

    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_success "Docker encontrado"
}

# Deploy Frontend para Firebase Hosting
deploy_frontend() {
    local ENV=$1
    print_header "Deploy Frontend - $ENV"

    if [ "$ENV" == "sandbox" ]; then
        echo "Deploying to: dev.igj.cv"
        firebase deploy --only hosting:sandbox --project $PROJECT_ID
    elif [ "$ENV" == "production" ]; then
        echo "Deploying to: sgigj.igj.cv"
        firebase deploy --only hosting:production --project $PROJECT_ID
    fi

    print_success "Frontend deployed to $ENV"
}

# Deploy API para Cloud Run
deploy_api() {
    local ENV=$1
    print_header "Deploy API - $ENV"

    local SERVICE_NAME="sgigj-api-${ENV}"
    local ENV_FILE="api/.env.${ENV}"
    local IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
    local CLOUD_SQL_INSTANCE="${PROJECT_ID}:${REGION}:igj-mysql-${ENV}"

    if [ ! -f "$ENV_FILE" ]; then
        print_error "Ficheiro $ENV_FILE não encontrado!"
        exit 1
    fi

    # Build Docker image
    echo "Building Docker image..."
    docker build -t $IMAGE ./api

    # Push to Container Registry
    echo "Pushing image to GCR..."
    docker push $IMAGE

    # Deploy to Cloud Run
    echo "Deploying to Cloud Run..."
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE \
        --platform managed \
        --region $REGION \
        --project $PROJECT_ID \
        --allow-unauthenticated \
        --port 3333 \
        --memory 512Mi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --add-cloudsql-instances $CLOUD_SQL_INSTANCE \
        --set-env-vars-file $ENV_FILE \
        --timeout 300

    print_success "API deployed to Cloud Run ($SERVICE_NAME)"

    # Mostrar URL
    local URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID --format 'value(status.url)')
    echo -e "\nAPI URL: ${GREEN}$URL${NC}"
    echo -e "Configure o domínio personalizado para: ${YELLOW}$([ "$ENV" == "sandbox" ] && echo "dev.api.igj.cv" || echo "api.igj.cv")${NC}"
}

# Menu principal
show_menu() {
    print_header "SGIGJ - Deploy Manager"
    echo "Projeto: $PROJECT_ID"
    echo "Região: $REGION"
    echo ""
    echo "Escolha uma opção:"
    echo ""
    echo "  1) Deploy Frontend Sandbox     (dev.igj.cv)"
    echo "  2) Deploy Frontend Produção    (sgigj.igj.cv)"
    echo "  3) Deploy API Sandbox          (dev.api.igj.cv)"
    echo "  4) Deploy API Produção         (api.igj.cv)"
    echo "  5) Deploy TUDO Sandbox         (Frontend + API)"
    echo "  6) Deploy TUDO Produção        (Frontend + API)"
    echo "  7) Setup inicial (criar recursos GCP)"
    echo "  0) Sair"
    echo ""
    read -p "Opção: " choice

    case $choice in
        1) deploy_frontend "sandbox" ;;
        2) deploy_frontend "production" ;;
        3) deploy_api "sandbox" ;;
        4) deploy_api "production" ;;
        5) deploy_frontend "sandbox" && deploy_api "sandbox" ;;
        6) deploy_frontend "production" && deploy_api "production" ;;
        7) setup_gcp ;;
        0) exit 0 ;;
        *) print_error "Opção inválida" && show_menu ;;
    esac
}

# Setup inicial do GCP
setup_gcp() {
    print_header "Setup Inicial - Google Cloud Platform"

    echo "Este script vai criar os seguintes recursos:"
    echo "  - Ativar APIs necessárias"
    echo "  - Criar instâncias Cloud SQL (MySQL)"
    echo "  - Criar bases de dados"
    echo "  - Configurar Cloud Run"
    echo ""
    read -p "Continuar? (s/n): " confirm

    if [ "$confirm" != "s" ]; then
        echo "Cancelado."
        exit 0
    fi

    # Definir projeto
    gcloud config set project $PROJECT_ID

    # Ativar APIs
    echo "Ativando APIs..."
    gcloud services enable \
        cloudsql.googleapis.com \
        run.googleapis.com \
        containerregistry.googleapis.com \
        sqladmin.googleapis.com \
        firebase.googleapis.com \
        firebasehosting.googleapis.com
    print_success "APIs ativadas"

    # Criar instância Cloud SQL - Sandbox
    echo "Criando Cloud SQL - Sandbox..."
    gcloud sql instances create igj-mysql-sandbox \
        --database-version=MYSQL_8_0 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-size=10GB \
        --storage-type=SSD \
        --project=$PROJECT_ID
    print_success "Cloud SQL Sandbox criado"

    # Criar instância Cloud SQL - Production
    echo "Criando Cloud SQL - Produção..."
    gcloud sql instances create igj-mysql-production \
        --database-version=MYSQL_8_0 \
        --tier=db-g1-small \
        --region=$REGION \
        --storage-size=20GB \
        --storage-type=SSD \
        --availability-type=regional \
        --project=$PROJECT_ID
    print_success "Cloud SQL Produção criado"

    # Criar bases de dados
    echo "Criando bases de dados..."
    gcloud sql databases create igj_bd_sandbox --instance=igj-mysql-sandbox --project=$PROJECT_ID
    gcloud sql databases create igj_bd_production --instance=igj-mysql-production --project=$PROJECT_ID
    print_success "Bases de dados criadas"

    # Criar utilizadores
    echo "Criando utilizadores MySQL..."
    read -sp "Password para sandbox DB: " SANDBOX_PASS
    echo ""
    gcloud sql users create sgigj_sandbox \
        --instance=igj-mysql-sandbox \
        --password=$SANDBOX_PASS \
        --project=$PROJECT_ID

    read -sp "Password para produção DB: " PROD_PASS
    echo ""
    gcloud sql users create sgigj_production \
        --instance=igj-mysql-production \
        --password=$PROD_PASS \
        --project=$PROJECT_ID
    print_success "Utilizadores criados"

    # Configurar Firebase Hosting sites
    echo "Configurando Firebase Hosting sites..."
    firebase hosting:sites:create igj-sandbox --project $PROJECT_ID 2>/dev/null || true
    firebase hosting:sites:create igj-production --project $PROJECT_ID 2>/dev/null || true
    print_success "Firebase Hosting sites configurados"

    print_header "Setup Completo!"
    echo "Próximos passos:"
    echo "  1. Atualizar passwords nos ficheiros .env.sandbox e .env.production"
    echo "  2. Importar bases de dados (ver SETUP.md)"
    echo "  3. Configurar domínios personalizados no Firebase Console"
    echo "  4. Configurar domínios personalizados no Cloud Run"
    echo ""
}

# Executar
check_dependencies

if [ $# -eq 0 ]; then
    show_menu
else
    case "$1" in
        "frontend-sandbox") deploy_frontend "sandbox" ;;
        "frontend-production") deploy_frontend "production" ;;
        "api-sandbox") deploy_api "sandbox" ;;
        "api-production") deploy_api "production" ;;
        "all-sandbox") deploy_frontend "sandbox" && deploy_api "sandbox" ;;
        "all-production") deploy_frontend "production" && deploy_api "production" ;;
        "setup") setup_gcp ;;
        *) print_error "Comando inválido: $1" && exit 1 ;;
    esac
fi
