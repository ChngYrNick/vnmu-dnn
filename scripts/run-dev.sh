#!/bin/sh

set -eu

echo "Starting dev server..."

echo "Stopping containers..."
docker compose -f docker-compose.dev.yml --env-file .env down

echo "Building images..."
docker compose -f docker-compose.dev.yml --env-file .env build

echo "Starting containers..."
docker compose -f docker-compose.dev.yml --env-file .env up -d "$@"

echo "Dev server ready at http://localhost:8080"
echo "Container status:"
docker compose -f docker-compose.dev.yml --env-file .env ps

echo "Use 'docker compose -f docker-compose.dev.yml logs -f' to view logs"
