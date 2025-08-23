#!/bin/bash

echo "🚀 Deploying SpamAssassin HTTP Wrapper Service"
echo "=============================================="

# Navigate to wrapper directory
cd /home/btafoya/spamassassin-mcp-n8n-community-node

# Ensure all files are in place
echo "📋 Checking required files..."
required_files=(
    "spamassassin-http-wrapper.js"
    "wrapper-package.json"
    "Dockerfile.wrapper"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "✅ Found: $file"
done

# Navigate to docker-stacks directory
echo "📁 Navigating to Docker Compose directory..."
cd /home/btafoya/docker-stacks/n8n-cloud

# Stop existing services
echo "🛑 Stopping existing services..."
docker compose down

# Build and start services with HTTP wrapper
echo "🔨 Building and starting services with HTTP wrapper..."
docker compose -f compose-with-wrapper.yml up -d --build

echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
echo "n8n status:"
docker compose -f compose-with-wrapper.yml ps n8n

echo "SpamAssassin HTTP wrapper status:"
docker compose -f compose-with-wrapper.yml ps spamassassin-http-wrapper

echo "SpamAssassin MCP status:"
docker compose -f compose-with-wrapper.yml ps spamassassin-mcp

# Test wrapper service
echo "🧪 Testing HTTP wrapper service..."
echo "Health check:"
curl -s http://192.168.25.200:9000/health | jq . || echo "Health check failed"

echo "Service info:"
curl -s http://192.168.25.200:9000/info | jq . || echo "Info check failed"

echo "📊 Service URLs:"
echo "- n8n UI: http://192.168.25.200:5678"
echo "- SpamAssassin HTTP Wrapper: http://192.168.25.200:9000"
echo "- Wrapper Health: http://192.168.25.200:9000/health"
echo "- Wrapper Info: http://192.168.25.200:9000/info"

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Import the HTTP-based workflow: spamassassin-http-workflow.json"
echo "2. Test with the provided curl commands"
echo "3. Monitor logs with: docker compose -f compose-with-wrapper.yml logs -f"