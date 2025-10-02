#!/bin/bash

echo "========================================="
echo "Hugo at Work - Team Features Deployment"
echo "========================================="
echo ""

# Set working directory
cd /home/ubuntu/hugo-app-archiv

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Building Frontend...${NC}"
cd frontend
npm run build --legacy-peer-deps
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend build successful${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Checking Docker services...${NC}"
cd ..
docker-compose ps

echo ""
echo -e "${YELLOW}Step 3: Restarting services...${NC}"
docker-compose restart frontend team-service

echo ""
echo -e "${YELLOW}Step 4: Checking service health...${NC}"
sleep 5

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${RED}✗ Frontend is not responding${NC}"
fi

# Check team service
if curl -s http://localhost:8004/health > /dev/null; then
    echo -e "${GREEN}✓ Team service is running${NC}"
else
    echo -e "${RED}✗ Team service is not responding${NC}"
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Access the application at: http://157.90.170.80:3000"
echo ""
echo "New Features Available:"
echo "  - Enhanced Teams Page with API integration"
echo "  - Team Visualization Dashboard"
echo "  - Compatibility Matrix Analysis"
echo "  - Cultural Dimensions Integration"
echo "  - HR Team Analytics Dashboard"
echo ""
