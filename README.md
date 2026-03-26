### **Web Application of the Department of Neurology and Neurosurgery**  
*Vinnytsia National Pirogov Medical University*

An official online platform of the **Department of Neurology and Neurosurgery** at *Vinnytsia National Pirogov Medical University*.  
Designed to provide students, faculty, and healthcare professionals with access to educational materials, research updates, and departmental resources.

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
./scripts/run-dev.sh
```

This starts four Docker services:
- **ui** — Vite dev server with HMR (CSS/JS changes apply instantly)
- **server** — Node.js backend with file watching
- **nginx** — Reverse proxy at http://localhost:8080

### Production Deployment

Deploy to production using:

```bash
./scripts/deploy.sh
```

This builds the Docker images, starts the app and nginx (with auto-SSL via Let's Encrypt), and shares static assets via a Docker volume.
