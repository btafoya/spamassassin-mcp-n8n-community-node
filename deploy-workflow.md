# SpamAssassin Test Workflow Deployment Guide

## Issues Identified & Solutions

### ✅ Workflow Analysis Results
- **Structure**: Valid n8n workflow with 11 nodes and proper connections
- **Flow**: Webhook/Manual → Data Prep → SpamAssassin Scan → Classification → Response
- **Error Handling**: Proper error path for scan failures

### ❌ Issues Found
1. **Workflow Not Imported**: Workflow file exists but isn't loaded in n8n
2. **Missing Credentials**: SpamAssassin MCP credential ID `TkG7nIcTjIpntOkW` not found
3. **Community Node**: Requires `n8n-nodes-spamassassin-mcp` to be installed

## Deployment Steps

### 1. Install SpamAssassin Community Node
First, install the SpamAssassin MCP community node:
```bash
# From n8n interface: Settings > Community Nodes
# Or via CLI if you have access:
npm install n8n-nodes-spamassassin-mcp
```

### 2. Import Workflow
1. Open n8n at `http://192.168.25.200:5678`
2. Click "Import from file" or paste workflow JSON
3. Import the `spamassassin-test-workflow.json`

### 3. Configure SpamAssassin Credential
Create a new credential for the SpamAssassin MCP node:
1. Go to Credentials in n8n
2. Create new "SpamAssassin MCP" credential
3. Configure connection to: `http://192.168.25.200:3987` (from Docker container)
4. Test connection to ensure SpamAssassin MCP server is reachable

### 4. Update Workflow Credential Reference
After creating the credential, update the workflow:
1. Open the SpamAssassin Scan node
2. Select the new credential from dropdown
3. Save the workflow

### 5. Activate Workflow
1. Enable the workflow using the toggle switch
2. This will activate the webhook endpoint

## Testing the Fixed Workflow

### Test 1: Webhook Test
```bash
curl -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: Test Email\\nFrom: test@example.com\\n\\nThis is a test email for SpamAssassin scanning.",
    "subject": "Test Email", 
    "sender": "test@example.com"
  }'
```

### Test 2: Manual Execution
1. Open workflow in n8n editor
2. Click "Execute Workflow" button
3. Check execution results

## Expected Results

**For HAM (legitimate email):**
```json
{
  "classification": "HAM",
  "score": 2.3,
  "threshold": 5.0,
  "confidence": "HIGH",
  "action": "ALLOW",
  "recommendation": "Allow this email - appears legitimate"
}
```

**For SPAM:**
```json
{
  "classification": "SPAM", 
  "score": 8.7,
  "threshold": 5.0,
  "confidence": "HIGH",
  "action": "BLOCK",
  "recommendation": "Block this email - identified as spam"
}
```

## Quick Fix Script

Run the automated test script to validate:
```bash
node test-workflow.js
```

## Next Steps After Deployment
1. Test with various email samples
2. Monitor execution logs for errors
3. Adjust spam score thresholds if needed
4. Set up proper API key for programmatic access