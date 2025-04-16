# VNMU-DNN

A web application built with Fastify, Bootstrap, and SQLite using clean architecture principles.

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

- Node.js (latest LTS version)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vnmu-dnn

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory:

```
DATABASE_PATH=./data/database.sqlite
PORT=3000
HOST=localhost
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Development Commands

- **Build**: `npm run build`
- **Development**: `npm run dev`
- **Lint**: `npx eslint src/**/*.js`
- **Type Check**: `npx tsc --noEmit`

## Docker

The application can also be run using Docker:

```bash
# Build and start with Docker Compose
docker-compose up -d
```

## Architecture

This project follows clean architecture principles:

1. **Domain Layer**: Core business logic and entities
2. **Application Layer**: Use cases that orchestrate the domain
3. **Infrastructure Layer**: External interfaces like databases, web, etc.

## Code Style

- Uses Prettier and ESLint for code formatting and linting
- Follows TypeScript strict mode guidelines
- Uses repository pattern for data access
- Uses use case pattern for business logic

## License

This project is authored by Serhii Moskovko.