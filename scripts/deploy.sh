#!/bin/sh

set -eu

echo "Starting deployment..."

echo "Stopping containers..."
docker compose --env-file .production.env down -v

echo "Building and starting containers..."
docker compose --env-file .production.env up -d --build "$@"

echo "Deployment complete!"
echo "Container status:"
docker compose --env-file .production.env ps

echo "Use 'docker compose --env-file .production.env logs -f' to view logs"
