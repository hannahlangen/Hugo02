#!/bin/bash

# Hugo at Work - Quick Deployment Script
# Dieses Script führt ein schnelles Deployment auf dem Development Server durch

set -e

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Hugo at Work - Quick Deployment${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Server-Zugangsdaten
SERVER_USER="manus02"
SERVER_HOST="157.90.170.80"
SERVER_PASS="exjh7a"
PROJECT_PATH="~/hugo-app-archiv"

# Funktion zum Anzeigen von Status-Meldungen
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Prüfen ob sshpass installiert ist
if ! command -v sshpass &> /dev/null; then
    print_error "sshpass ist nicht installiert!"
    print_status "Installiere mit: sudo apt-get install sshpass"
    exit 1
fi

# Schritt 1: Lokale Änderungen zu GitHub pushen (optional)
if [ "${1}" != "--skip-push" ]; then
    print_status "Prüfe Git-Status..."
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Es gibt uncommitted Änderungen!"
        read -p "Möchtest du committen und pushen? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Commit-Message: " commit_msg
            git add .
            git commit -m "$commit_msg"
            git push origin develop
            print_success "Änderungen zu GitHub gepusht"
        else
            print_warning "Überspringe Git-Push"
        fi
    else
        print_success "Keine lokalen Änderungen zum Committen"
    fi
fi

# Schritt 2: Deployment-Typ auswählen
echo ""
print_status "Wähle Deployment-Typ:"
echo "1) Nur Frontend"
echo "2) Nur Backend-Services"
echo "3) Alles (Frontend + Backend)"
echo "4) Nur Git Pull (kein Rebuild)"
read -p "Auswahl (1-4): " deploy_type

case $deploy_type in
    1)
        DEPLOY_CMD="cd $PROJECT_PATH && git pull origin develop && docker compose up -d --build frontend"
        print_status "Deploye nur Frontend..."
        ;;
    2)
        DEPLOY_CMD="cd $PROJECT_PATH && git pull origin develop && docker compose up -d --build user-service hugo-engine assessment-service team-service chat-assessment-service"
        print_status "Deploye Backend-Services..."
        ;;
    3)
        DEPLOY_CMD="cd $PROJECT_PATH && git pull origin develop && docker compose up -d --build"
        print_status "Deploye alle Services..."
        ;;
    4)
        DEPLOY_CMD="cd $PROJECT_PATH && git pull origin develop"
        print_status "Führe nur Git Pull durch..."
        ;;
    *)
        print_error "Ungültige Auswahl!"
        exit 1
        ;;
esac

# Schritt 3: Deployment durchführen
echo ""
print_status "Verbinde zu Server $SERVER_HOST..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "$DEPLOY_CMD"

if [ $? -eq 0 ]; then
    print_success "Deployment erfolgreich abgeschlossen!"
else
    print_error "Deployment fehlgeschlagen!"
    exit 1
fi

# Schritt 4: Service-Status prüfen
echo ""
print_status "Prüfe Service-Status..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "cd $PROJECT_PATH && docker compose ps"

# Schritt 5: Health-Checks
echo ""
print_status "Führe Health-Checks durch..."

check_service() {
    local service_name=$1
    local port=$2
    
    if curl -s "http://$SERVER_HOST:$port/health" > /dev/null 2>&1; then
        print_success "$service_name ist erreichbar"
    else
        print_warning "$service_name antwortet nicht (möglicherweise kein Health-Endpoint)"
    fi
}

if [ "$deploy_type" != "4" ]; then
    sleep 5  # Warte kurz bis Services gestartet sind
    
    check_service "User Service" 8001
    check_service "Hugo Engine" 8002
    check_service "Assessment Service" 8003
    check_service "Team Service" 8004
    check_service "Chat Assessment" 8005
    
    if curl -s "http://$SERVER_HOST:3000" > /dev/null 2>&1; then
        print_success "Frontend ist erreichbar"
    else
        print_error "Frontend ist nicht erreichbar!"
    fi
fi

# Zusammenfassung
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment abgeschlossen!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Zugriff auf die Anwendung:"
echo "  Frontend: http://$SERVER_HOST:3000"
echo "  API Docs: http://$SERVER_HOST:8001/docs"
echo ""
echo "Nächste Schritte:"
echo "  - Funktionalität testen"
echo "  - Logs prüfen: docker compose logs -f"
echo "  - Bei Problemen: ./quick-deploy.sh erneut ausführen"
echo ""
