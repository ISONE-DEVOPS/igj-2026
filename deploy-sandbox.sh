#!/bin/bash
set -e

# ============================================================
#  SGIGJ - Deploy SANDBOX
#  Frontend: igj-sandbox.web.app / dev.igj.cv
#  API:      sgigj-api-sandbox (dev.api.igj.cv)
#  BD:       igj-mysql-sandbox / igj_bd_sandbox
#  Projeto Firebase: igj-sgigj
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SANDBOX_API_URL="https://sgigj-api-sandbox-935874352349.europe-west1.run.app"
PROJECT_ID="igj-sgigj"
REGION="europe-west1"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  SGIGJ - Deploy SANDBOX${NC}"
echo -e "${BLUE}  API: ${SANDBOX_API_URL}${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

cd "$(dirname "$0")"

deploy_frontend() {
    # 1. Build do frontend com API de SANDBOX
    echo -e "${YELLOW}[1/3]${NC} Building frontend (API Sandbox)..."
    cd frontend
    REACT_APP_API_URL="$SANDBOX_API_URL" NODE_OPTIONS=--openssl-legacy-provider npm run build
    cd ..
    echo -e "${GREEN}Build concluido${NC}"

    # 2. Verificar que o build aponta para sandbox
    if grep -q "sgigj-api-production" frontend/build/static/js/main.*.chunk.js 2>/dev/null; then
        echo -e "${RED}ERRO: Build contém URL de PRODUCAO! Abortando.${NC}"
        exit 1
    fi
    if grep -q "sgigj-api-sandbox" frontend/build/static/js/main.*.chunk.js 2>/dev/null; then
        echo -e "${GREEN}Verificado: Build aponta para API SANDBOX${NC}"
    else
        echo -e "${RED}AVISO: URL da API não encontrada no build!${NC}"
    fi

    # 3. Sync para pasta dev/
    echo -e "${YELLOW}[2/3]${NC} Sincronizando ficheiros..."
    rsync -av --delete --exclude='cgi-bin' --exclude='.DS_Store' frontend/build/ dev/
    echo -e "${GREEN}Sync concluido${NC}"

    # 4. Deploy Firebase
    echo -e "${YELLOW}[3/3]${NC} Deploying para Firebase Sandbox..."
    firebase deploy --only hosting:sandbox --project "$PROJECT_ID"
    echo -e "${GREEN}Frontend SANDBOX deployed: https://dev.igj.cv${NC}"
}

deploy_api() {
    echo -e "${YELLOW}[API]${NC} Building & deploying API Sandbox..."
    cd api
    gcloud builds submit \
        --tag "europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/sgigj-api-sandbox:latest" \
        --project "$PROJECT_ID" \
        --region "$REGION"

    gcloud run deploy sgigj-api-sandbox \
        --image "europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/sgigj-api-sandbox:latest" \
        --region "$REGION" \
        --project "$PROJECT_ID" \
        --platform managed
    cd ..
    echo -e "${GREEN}API SANDBOX deployed: https://dev.api.igj.cv${NC}"
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
echo -e "${GREEN}  SANDBOX deploy concluido!${NC}"
echo -e "${GREEN}============================================================${NC}"
