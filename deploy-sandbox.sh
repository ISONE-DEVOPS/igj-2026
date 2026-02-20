#!/bin/bash
set -e

# ============================================================
#  SGIGJ - Deploy SANDBOX
#  Frontend: igj-sandbox.web.app / dev.igj.cv
#  Projeto Firebase: igj-sgigj
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  SGIGJ - Deploy SANDBOX${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

cd "$(dirname "$0")"

# 1. Build do frontend
echo -e "${YELLOW}[1/3]${NC} Building frontend..."
cd frontend
NODE_OPTIONS=--openssl-legacy-provider npm run build
echo -e "${GREEN}Build concluido${NC}"

# 2. Sync para pasta dev/
echo -e "${YELLOW}[2/3]${NC} Sincronizando ficheiros..."
cd ..
rsync -av --delete --exclude='cgi-bin' frontend/build/ dev/
echo -e "${GREEN}Sync concluido${NC}"

# 3. Deploy Firebase
echo -e "${YELLOW}[3/3]${NC} Deploying para Firebase Sandbox..."
firebase deploy --only hosting:sandbox --project igj-sgigj
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  SANDBOX deploy concluido!${NC}"
echo -e "${GREEN}  URL: https://igj-sandbox.web.app${NC}"
echo -e "${GREEN}============================================================${NC}"
