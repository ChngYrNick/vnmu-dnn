#!/bin/sh

set -e

echo "🚀 Starting deployment..."

echo "⏹️  Stopping containers..."
docker compose --env-file .production.env down

echo "🔨 Building images..."
docker compose --env-file .production.env build

echo "▶️  Starting containers..."
docker compose --env-file .production.env up -d

echo "📦 Copying static files from app container..."
rm -rf ./dist
docker compose --env-file .production.env cp app:/usr/src/app/dist ./dist

echo "🔄 Restarting nginx to pick up static files..."
docker compose --env-file .production.env restart nginx

echo "✅ Deployment complete!"
echo "📊 Container status:"
docker compose --env-file .production.env ps

echo "🔍 Use 'docker compose logs -f' to view logs"
