#!/bin/bash

# Script to test HTTP methods with n8n
# Uses environment variables N8N_API_URL and N8N_API_KEY
N8N_URL="${N8N_API_URL:-https://n8n.tafoyaventures.com}"

echo "Testing HTTP methods with n8n..."
echo "================================="

# Add API key if available
AUTH_HEADER=""
if [ -n "$N8N_API_KEY" ]; then
    AUTH_HEADER="-H 'Authorization: Bearer $N8N_API_KEY'"
    echo "Using API key for authentication"
else
    echo "No API key found, making requests without authentication"
fi

echo "Using n8n instance: $N8N_URL"
echo

# Test GET request
echo "1. Testing GET request..."
response=$(curl -s -w "\n%{http_code}" $AUTH_HEADER -X GET "$N8N_URL/webhook/test-get")
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)
echo "   Status: $http_code"
echo "   Response: $response_body"
echo

# Test POST request
echo "2. Testing POST request..."
response=$(curl -s -w "\n%{http_code}" $AUTH_HEADER -X POST "$N8N_URL/webhook/test-post" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello from HTTP test\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"method\": \"POST\"}")
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)
echo "   Status: $http_code"
echo "   Response: $response_body"
echo

# Test PUT request
echo "3. Testing PUT request..."
response=$(curl -s -w "\n%{http_code}" $AUTH_HEADER -X PUT "$N8N_URL/webhook/test-put" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello from HTTP test\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"method\": \"PUT\"}")
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)
echo "   Status: $http_code"
echo "   Response: $response_body"
echo

# Test DELETE request
echo "4. Testing DELETE request..."
response=$(curl -s -w "\n%{http_code}" $AUTH_HEADER -X DELETE "$N8N_URL/webhook/test-delete")
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)
echo "   Status: $http_code"
echo "   Response: $response_body"
echo

echo "Testing completed!"