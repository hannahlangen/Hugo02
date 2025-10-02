#!/bin/bash

# Hugo App v2 - Deployment Script
# This script sets up and deploys the complete Hugo application

set -e

echo "🚀 Hugo App v2 - Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check for docker compose (v2 plugin) or docker compose (v1)
    if ! docker compose version &> /dev/null && ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.template .env
        print_warning "Please edit .env file with your configuration before continuing."
        print_warning "Press Enter to continue after editing .env file..."
        read
    else
        print_success ".env file found"
    fi
}

# Build and start services
deploy_services() {
    print_status "Building and starting Hugo App services..."
    
    # Stop any existing containers
    docker compose down
    
    # Build and start services
    docker compose up -d --build
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database to be ready
    print_status "Waiting for database..."
    sleep 10

    # Health-Check für die Landingpage über Nginx ---
    print_status "Checking landingpage..."
    for i in {1..12}; do
        if curl -s --head "http://localhost:80" | head -n 1 | grep "200 OK" > /dev/null; then
            print_success "landingpage is ready"
            break
        fi

        if [ $i -eq 12 ]; then
            print_error "landingpage failed to start"
            exit 1
        fi
        sleep 5
    done
    
    # Check if backend services are healthy
    services=("user-service:8001" "hugo-engine:8002" "assessment-service:8003" "team-service:8004")
    
    for service in "${services[@]}"; do
        service_name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        print_status "Checking $service_name..."
        
        # Wait up to 60 seconds for service to be ready
        for i in {1..12}; do
            if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
                print_success "$service_name is ready"
                break
            fi
            
            if [ $i -eq 12 ]; then
                print_error "$service_name failed to start"
                exit 1
            fi
            
            sleep 5
        done
    done
}

# Run API tests
run_tests() {
    print_status "Running API tests..."
    
    if python3 test_apis.py; then
        print_success "All API tests passed!"
    else
        print_error "Some API tests failed. Check the output above."
        exit 1
    fi
}

# Show deployment information
show_deployment_info() {
    echo ""
    echo "🎉 Hugo App v2 Deployment Complete!"
    echo "===================================="
    echo ""
    echo "📱 Application URLs:"
    echo "   Landing Page:   http://hugoatwork.com  (or http://localhost)"
    echo "   Main App:       http://app.hugoatwork.com"
    echo ""
    echo "🔧 API Documentation:"
    echo "   User Service:       http://localhost:8001/docs"
    echo "   Hugo Engine:        http://localhost:8002/docs"
    echo "   Assessment Service: http://localhost:8003/docs"
    echo "   Team Service:       http://localhost:8004/docs"
    echo ""
    echo "📊 Service Health:"
    echo "   User Service:       http://localhost:8001/health"
    echo "   Hugo Engine:        http://localhost:8002/health"
    echo "   Assessment Service: http://localhost:8003/health"
    echo "   Team Service:       http://localhost:8004/health"
    echo ""
    echo "🐳 Docker Commands:"
    echo "   View logs:          docker compose logs -f"
    echo "   Stop services:      docker compose down"
    echo "   Restart services:   docker compose restart"
    echo "   View containers:    docker compose ps"
    echo ""
    echo "🧪 Testing:"
    echo "   Run API tests:      python3 test_apis.py"
    echo ""
}

# Main deployment process
main() {
    print_status "Starting Hugo App v2 deployment..."
    
    # Change to script directory
    cd "$(dirname "$0")"
    
    # Run deployment steps
    check_docker
    check_env_file
    deploy_services
    wait_for_services
    run_tests
    show_deployment_info
    
    print_success "Deployment completed successfully! 🎉"
}

# Handle script arguments
case "${1:-}" in
    "stop")
        print_status "Stopping Hugo App services..."
        docker compose down
        print_success "Services stopped"
        ;;
    "restart")
        print_status "Restarting Hugo App services..."
        docker compose restart
        print_success "Services restarted"
        ;;
    "logs")
        print_status "Showing service logs..."
        docker compose logs -f
        ;;
    "test")
        print_status "Running API tests..."
        python3 test_apis.py
        ;;
    "clean")
        print_status "Cleaning up Docker resources..."
        docker compose down -v
        docker system prune -f
        print_success "Cleanup completed"
        ;;
    "help"|"-h"|"--help")
        echo "Hugo App v2 - Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no command)  Deploy the complete application"
        echo "  stop          Stop all services"
        echo "  restart       Restart all services"
        echo "  logs          Show service logs"
        echo "  test          Run API tests"
        echo "  clean         Clean up Docker resources"
        echo "  help          Show this help message"
        echo ""
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for usage information"
        exit 1
        ;;
esac
