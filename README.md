### **Web Application of the Department of Neurology and Neurosurgery**  
*Vinnytsia National Pirogov Medical University*

An official online platform of the **Department of Neurology and Neurosurgery** at *Vinnytsia National Pirogov Medical University*.  
Designed to provide students, faculty, and healthcare professionals with access to educational materials, research updates, and departmental resources.

## Features

- User authentication (sign-up, sign-in, logout)
- Multi-language support (English and Ukrainian)
- Admin content management system
- Clean architecture with domain-driven design

## Tech Stack

- **Backend**: Fastify, Better-SQLite3
- **Frontend**: HTMX, Bootstrap, Sass
- **Bundling**: Vite
- **Languages**: JavaScript (with TypeScript type checking)
- **Internationalization**: i18next

## Project Structure

- **src/domain**: Core business logic and entities
- **src/application**: Use cases and business rules
- **src/infrastructure**: External interfaces (repositories, web, etc.)

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vnmu-dnn
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Application
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
SESSION_SECRET=your-secret-key

# SSL/Domain (for production)
CERTBOT_EMAIL=your-email@domain.com
DOMAIN=your-domain.com
```

### Development Environment

Start the development server using the provided script:

```bash
# Start development environment
./scripts/run-dev.sh
```

This will:
- Build the development Docker images
- Start all services (ui, server, nginx)
- Make the application available at http://localhost:8080

**Development services:**
- **UI Builder** - Vite dev server for frontend assets
- **API Server** - Fastify server with hot reload
- **Nginx** - Reverse proxy and static file server
- **Debug Port** - Node.js inspector on port 9229

### Production Deployment

Deploy to production using:

```bash
# Deploy to production
./scripts/deploy.sh
```

This will:
- Build production Docker images
- Start services with SSL certificates
- Make the application available at https://your-domain.com

### Manual Docker Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml --env-file .env up -d

# Production  
docker-compose --env-file .production.env up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```
