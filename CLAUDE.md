# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npx eslint src/**/*.js`
- Type check: `npx tsc --noEmit`

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