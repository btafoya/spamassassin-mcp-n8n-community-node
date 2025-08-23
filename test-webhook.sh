#!/bin/bash

echo "🧪 Testing SpamAssassin Workflow Webhook"
echo "========================================"

# Test 1: HAM Email
echo "📧 Testing HAM (legitimate) email..."
HAM_RESPONSE=$(curl -s -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: Business Meeting Tomorrow\nFrom: colleague@company.com\nTo: recipient@company.com\n\nHi there,\n\nJust wanted to confirm our meeting tomorrow at 2 PM.\nLooking forward to discussing the project updates.\n\nBest regards,\nJohn",
    "subject": "Business Meeting Tomorrow",
    "sender": "colleague@company.com"
  }')

echo "HAM Test Response:"
echo "$HAM_RESPONSE" | jq . 2>/dev/null || echo "$HAM_RESPONSE"
echo ""

# Test 2: SPAM Email  
echo "📧 Testing SPAM email..."
SPAM_RESPONSE=$(curl -s -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: URGENT! Claim Your Prize NOW!\nFrom: winner@lottery-scam.com\nTo: victim@example.com\n\nCONGRATULATIONS! You have won $1,000,000!\nClick here immediately to claim your prize!\nSend us your bank details and social security number!\nThis offer expires in 24 hours!\nBUY CHEAP VIAGRA! LOSE WEIGHT FAST!",
    "subject": "URGENT! Claim Your Prize NOW!",
    "sender": "winner@lottery-scam.com"
  }')

echo "SPAM Test Response:"
echo "$SPAM_RESPONSE" | jq . 2>/dev/null || echo "$SPAM_RESPONSE"
echo ""

# Test 3: Check workflow execution logs
echo "📊 Checking recent workflow executions..."
curl -s -X GET "http://192.168.25.200:5678/api/v1/executions?filter=%7B%22workflowId%22:%22FkyGIMPcFMiD8vXm%22%7D" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | jq '.data[:3] | .[] | {id, status, finished, startedAt, workflowId}' 2>/dev/null || echo "Failed to get executions"