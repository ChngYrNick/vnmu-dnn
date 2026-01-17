#!/bin/sh

set -e

echo "🚀 Starting deployment..."

echo "⏹️  Stopping containers..."
docker compose --env-file .production.env down

echo "🔨 Building images..."
docker compose --env-file .production.env build

echo "▶️  Starting containers..."
docker compose --env-file .production.env up -d

echo "✅ Deployment complete!"
echo "📊 Container status:"
docker compose --env-file .production.env ps

echo "🔍 Use 'docker compose logs -f' to view logs"
