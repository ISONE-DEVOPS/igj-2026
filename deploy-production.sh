#!/bin/bash
set -e

# ============================================================
#  SGIGJ - Deploy PRODUCAO
#  Frontend: igj-production.web.app / sgigj.igj.cv
#  Projeto Firebase: igj-sgigj
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================================${NC}"
echo -e "${RED}  SGIGJ - Deploy PRODUCAO${NC}"
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

# 1. Build do frontend com API de producao
echo -e "${YELLOW}[1/3]${NC} Building frontend (API Producao)..."
cd frontend
REACT_APP_API_URL=https://sgigj-api-production-935874352349.europe-west1.run.app NODE_OPTIONS=--openssl-legacy-provider npm run build
echo -e "${GREEN}Build concluido${NC}"

# 2. Sync para pasta prod/
echo -e "${YELLOW}[2/3]${NC} Sincronizando ficheiros..."
cd ..
rsync -av --delete --exclude='cgi-bin' frontend/build/ prod/
echo -e "${GREEN}Sync concluido${NC}"

# 3. Deploy Firebase
echo -e "${YELLOW}[3/3]${NC} Deploying para Firebase Producao..."
firebase deploy --only hosting:production --project igj-sgigj
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  PRODUCAO deploy concluido!${NC}"
echo -e "${GREEN}  URL: https://igj-production.web.app${NC}"
echo -e "${GREEN}============================================================${NC}"
