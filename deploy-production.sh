#!/bin/bash
set -e

# ============================================================
#  SGIGJ - Deploy PRODUCAO
#  Frontend: igj-production.web.app / sgigj.igj.cv
#  API:      sgigj-api-production (api.igj.cv)
#  BD:       igj-mysql-production / igj_bd_production
#  Projeto Firebase: igj-sgigj
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PRODUCTION_API_URL="https://sgigj-api-production-935874352349.europe-west1.run.app"
PROJECT_ID="igj-sgigj"
REGION="europe-west1"

echo -e "${BLUE}============================================================${NC}"
echo -e "${RED}  SGIGJ - Deploy PRODUCAO${NC}"
echo -e "${RED}  API: ${PRODUCTION_API_URL}${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

cd "$(dirname "$0")"

# Confirmacao de seguranca
echo -e "${RED}ATENCAO: Vai fazer deploy para PRODUCAO!${NC}"
read -p "Tem a certeza? (sim/nao): " confirm
if [ "$confirm" != "sim" ]; then
    echo "Cancelado."
    exit 0
fi

deploy_frontend() {
    # 1. Build do frontend com API de PRODUCAO
    echo -e "${YELLOW}[1/3]${NC} Building frontend (API Producao)..."
    cd frontend
    REACT_APP_API_URL="$PRODUCTION_API_URL" NODE_OPTIONS=--openssl-legacy-provider npm run build
    cd ..
    echo -e "${GREEN}Build concluido${NC}"

    # 2. Verificar que o build aponta para producao
    if grep -q "sgigj-api-sandbox" frontend/build/static/js/main.*.chunk.js 2>/dev/null; then
        echo -e "${RED}ERRO: Build contém URL de SANDBOX! Abortando.${NC}"
        exit 1
    fi
    if grep -q "sgigj-api-production" frontend/build/static/js/main.*.chunk.js 2>/dev/null; then
        echo -e "${GREEN}Verificado: Build aponta para API PRODUCAO${NC}"
    else
        echo -e "${RED}AVISO: URL da API não encontrada no build!${NC}"
    fi

    # 3. Sync para pasta prod/
    echo -e "${YELLOW}[2/3]${NC} Sincronizando ficheiros..."
    rsync -av --delete --exclude='cgi-bin' --exclude='.DS_Store' frontend/build/ prod/
    echo -e "${GREEN}Sync concluido${NC}"

    # 4. Deploy Firebase
    echo -e "${YELLOW}[3/3]${NC} Deploying para Firebase Producao..."
    firebase deploy --only hosting:production --project "$PROJECT_ID"
    echo -e "${GREEN}Frontend PRODUCAO deployed: https://sgigj.igj.cv${NC}"
}

deploy_api() {
    echo -e "${YELLOW}[API]${NC} Building & deploying API Producao..."
    cd api
    gcloud builds submit \
        --tag "europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/sgigj-api-production:latest" \
        --project "$PROJECT_ID" \
        --region "$REGION"

    gcloud run deploy sgigj-api-production \
        --image "europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/sgigj-api-production:latest" \
        --region "$REGION" \
        --project "$PROJECT_ID" \
        --platform managed
    cd ..
    echo -e "${GREEN}API PRODUCAO deployed: https://api.igj.cv${NC}"
}

# Parse arguments
case "${1:-frontend}" in
    frontend)
        deploy_frontend
        ;;
    api)
        deploy_api
        ;;
    all)
        deploy_frontend
        deploy_api
        ;;
    *)
        echo "Uso: $0 [frontend|api|all]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  PRODUCAO deploy concluido!${NC}"
echo -e "${GREEN}  URL: https://sgigj.igj.cv${NC}"
echo -e "${GREEN}============================================================${NC}"
