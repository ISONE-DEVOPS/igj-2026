#!/bin/bash
set -e

# ============================================================
#  IGJ Website - Deploy para Google Cloud Run
#  Serviço independente do SGIGJ
#  Projeto Firebase: igj-sgigj
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="igj-sgigj"
REGION="europe-west1"
SERVICE_NAME="igj-website"
IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/$SERVICE_NAME:latest"

cd "$(dirname "$0")"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  IGJ Website - Deploy${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

case "${1:-build-deploy}" in
    build-deploy)
        echo -e "${YELLOW}[1/3]${NC} Building Docker image via Cloud Build..."
        gcloud builds submit \
            --tag "$IMAGE" \
            --project "$PROJECT_ID" \
            --region "$REGION"
        echo -e "${GREEN}Build concluído${NC}"

        echo -e "${YELLOW}[2/3]${NC} Deploying to Cloud Run..."
        gcloud run deploy $SERVICE_NAME \
            --image "$IMAGE" \
            --region "$REGION" \
            --project "$PROJECT_ID" \
            --platform managed \
            --allow-unauthenticated \
            --port 8080 \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 10 \
            --set-env-vars-file .env.production \
            --timeout 300
        echo -e "${GREEN}Deploy concluído${NC}"

        echo -e "${YELLOW}[3/3]${NC} Getting service URL..."
        URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID --format 'value(status.url)')
        echo -e "\n${GREEN}Website deployed: $URL${NC}"
        echo -e "Configure o domínio: ${YELLOW}igj.cv${NC}"
        ;;

    migrate)
        echo -e "${YELLOW}Running database migrations...${NC}"
        npx prisma migrate deploy
        echo -e "${GREEN}Migrations concluídas${NC}"
        ;;

    seed)
        echo -e "${YELLOW}Running database seed...${NC}"
        npx tsx prisma/seed.ts
        echo -e "${GREEN}Seed concluído${NC}"
        ;;

    *)
        echo "Uso: $0 [build-deploy|migrate|seed]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  Operação concluída!${NC}"
echo -e "${GREEN}============================================================${NC}"
