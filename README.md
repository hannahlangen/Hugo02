# Hugo App v2 - Personality Assessment & Team Building Platform

Hugo is a comprehensive personality assessment and team-building platform that helps organizations understand their people and build high-performing teams.

## 🚀 Features

- **12 Hugo Personality Types**: Comprehensive framework covering Vision, Innovation, Expertise, and Connection dimensions
- **Team Composition Analysis**: AI-powered insights into team dynamics and synergy scores
- **Communication Matrix**: Personalized communication strategies for every personality type combination
- **Advanced Analytics**: Deep insights into team performance and growth opportunities
- **Enterprise Security**: GDPR compliant with enterprise-grade security
- **Global Culture Support**: Integrated with Erin Meyer's Culture Map for international teams

## 🏗️ Architecture

The application follows a microservices architecture:

- **Frontend**: React with Tailwind CSS and shadcn/ui components
- **Backend Services**:
  - User Service (Authentication & User Management)
  - Hugo Engine (Personality Types & Analysis)
  - Assessment Service (Questionnaires & Scoring)
  - Team Service (Team Management & Analytics)
- **Database**: PostgreSQL with comprehensive schema
- **Reverse Proxy**: Nginx for routing and load balancing
- **Containerization**: Docker for consistent deployment

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React + Vite | Modern, responsive user interface |
| Backend | FastAPI (Python) | High-performance API services |
| Database | PostgreSQL | Robust data storage and relationships |
| Styling | Tailwind CSS + shadcn/ui | Professional, consistent design |
| Icons | Lucide React | Beautiful, consistent iconography |
| Charts | Recharts | Data visualization |
| Deployment | Docker + Docker Compose | Containerized deployment |
| Reverse Proxy | Nginx | Request routing and load balancing |

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. **Clone and setup the project**:
   ```bash
   git clone <repository-url>
   cd hugo-app-v2
   cp .env.template .env
   # Edit .env with your configuration
   ```

2. **Start the development environment**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Main App: http://localhost:80
   - Landing Page: http://localhost:3001 (if running separately)
   - API Documentation: 
     - User Service: http://localhost:8001/docs
     - Hugo Engine: http://localhost:8002/docs
     - Assessment Service: http://localhost:8003/docs
     - Team Service: http://localhost:8004/docs

### Local Development

For frontend development with hot reload:

```bash
# Frontend App
cd frontend
pnpm install
pnpm run dev

# Landing Page
cd landing
pnpm install
pnpm run dev
```

For backend development:

```bash
# Example: User Service
cd backend/user_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following key tables:

- `users` - User accounts and profiles
- `hugo_types` - The 12 personality types with detailed information
- `assessments` - User personality assessments and results
- `communication_matrix` - Inter-type communication strategies
- `teams` - Team information and metadata
- `team_members` - Team membership relationships
- `assessment_questions` - Questionnaire items
- `assessment_answers` - User responses to assessments

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.template`):

- `POSTGRES_PASSWORD` - Database password
- `JWT_SECRET` - JWT token signing secret
- `ENVIRONMENT` - Application environment (development/production)
- Service URLs for inter-service communication

### Docker Compose Services

- `postgres` - PostgreSQL database
- `user-service` - User management API
- `hugo-engine` - Personality analysis engine
- `assessment-service` - Assessment management
- `team-service` - Team analytics
- `frontend` - React application
- `nginx` - Reverse proxy and load balancer

## 🧪 Testing

### API Testing

Test the APIs using the provided test script:

```bash
python test_apis.py
```

### Frontend Testing

```bash
cd frontend
pnpm run test
```

## 🚀 Deployment

### Production Deployment

1. **Prepare environment**:
   ```bash
   cp .env.template .env.production
   # Configure production values
   ```

2. **Build and deploy**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

The application is designed to be deployed on cloud platforms like:

- **Hetzner Cloud** (recommended for cost-effectiveness)
- **AWS** (using ECS, RDS, and ALB)
- **Google Cloud Platform** (using Cloud Run and Cloud SQL)
- **Azure** (using Container Instances and Azure Database)

## 📈 Monitoring & Analytics

### Health Checks

All services provide health check endpoints:
- `/health` - Service health status
- `/metrics` - Application metrics (future enhancement)

### Logging

Structured logging is implemented across all services for:
- Request/response tracking
- Error monitoring
- Performance metrics
- Security events

## 🔒 Security

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Secure password hashing (bcrypt)
- CORS protection

### Data Protection

- GDPR compliance
- Data encryption at rest and in transit
- Regular security audits
- Privacy-by-design architecture

## 🌍 Internationalization

The platform supports international teams through:

- Multi-language interface (future enhancement)
- Cultural dimension analysis (Erin Meyer's Culture Map)
- Timezone-aware scheduling
- Localized communication strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint and Prettier for JavaScript/React
- Write comprehensive tests
- Document API changes
- Update README for new features

## 📚 Documentation

- [API Documentation](docs/api-reference/)
- [User Guide](docs/user-guide/)
- [Admin Guide](docs/admin-guide/)
- [Developer Guide](docs/developer-guide/)
- [Deployment Guide](docs/deployment/)

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the [troubleshooting guide](docs/troubleshooting.md)
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by MBTI, Enneagram, and Big Five personality models
- Integrated with Erin Meyer's Culture Map framework
- Built with modern web technologies and best practices
- Designed for enterprise-scale deployment and usage

---

**Hugo v2.0** - Discover Your Personality, Build Better Teams
