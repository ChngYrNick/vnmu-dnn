#!/bin/sh

set -e

echo "🚀 Starting dev server..."

echo "⏹️  Stopping containers..."
docker-compose -f docker-compose.dev.yml --env-file .env down

echo "🔨 Building images..."
docker-compose -f docker-compose.dev.yml --env-file .env build

echo "▶️  Starting containers..."
docker-compose -f docker-compose.dev.yml --env-file .env up -d

echo "✅ Deployment complete!"
echo "📊 Container status:"
docker-compose ps

echo "🔍 Use 'docker-compose logs -f' to view logs"
