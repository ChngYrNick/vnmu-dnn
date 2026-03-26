# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`
- Type check: `npx tsc --noEmit`

### Docker Development
```bash
./scripts/run-dev.sh                    # Start full dev environment (http://localhost:8080)
docker compose -f docker-compose.dev.yml logs -f server  # View server logs
docker compose -f docker-compose.dev.yml down            # Stop services
```

### Individual Dev Servers (without Docker)
```bash
npm run start:server:dev    # Backend with hot reload (port 3000, debugger on 9229)
npm run start:ui:dev        # Vite dev server with HMR
```

## Code Style
- **Imports**: Use relative paths with explicit `.js` extension
- **Formatting**: Follow Prettier config (80 chars, single quotes, 2 spaces)
- **Types**: TypeScript with strict mode enabled
- **Naming**: PascalCase for classes/constants, camelCase for methods/variables, kebab-case for SQL files
- **Error handling**: Use domain-specific error classes extending from `DomainError`
- **Architecture**: Clean architecture with domain, application, and infrastructure layers
- **Patterns**: Repository pattern for data access, use case pattern for business logic
- **Code organization**: One class per file with same-name exports, private fields with `#` prefix

## Git Workflow
- Commit messages should start with type: feat, fix, refactor, docs, etc.
- Branch from main for new features

## Project Structure
- `src/domain`: Core business logic and entities
- `src/application`: Use cases and business rules
- `src/infrastructure`: External interfaces (repos, web, etc.)

## Key Architecture Details

### Dependency Injection
Custom DI container via Fastify decoration (`fastify.di`). Services and repos are instantiated in `src/infrastructure/web/di/container.js` and accessed via `request.di` in route handlers.

### Database
SQLite with better-sqlite3 (synchronous). Schema in `src/infrastructure/repos/setup/schema.sql`. SQL queries are stored in `.sql` files and loaded via `QueryLoaderService`.

### Web Layer
- **Routes**: All routes defined in `src/infrastructure/web/setup/routes.js`
- **Views**: Nunjucks templates in `src/infrastructure/web/ui/views/` (served from source in both dev and prod)
- **Frontend**: HTMX for dynamic updates, Vite for asset bundling
- **Asset pipeline**: Templates use `{{ vite('scripts/main.js') | safe }}` helper. In dev, this injects Vite dev server script tags (HMR). In prod, it reads `dist/.vite/manifest.json` for hashed asset paths. See `src/infrastructure/web/plugins/view/vite.js`.

### i18n
i18next with English (`en`) and Ukrainian (`uk`) locales in `src/infrastructure/web/locales/`. Access via `request.t()` in routes or `t()` helper in templates.

### Error Classes
Located in `src/domain/errors/`: `UnauthError`, `ForbiddenError`, `NotFoundError`, `BadRequestError`, `ConflictError`