# Manual SpamAssassin MCP Credential Setup

## ✅ Community Node Installed
The `n8n-nodes-spamassassin-mcp` package has been successfully installed in the n8n container and the container has been restarted.

## 🔧 Manual Steps Required

Since API authentication seems to have changed after restart, please complete these steps manually in the n8n UI:

### 1. Access n8n Interface
Open: `http://192.168.25.200:5678`

### 2. Create SpamAssassin MCP Credential
1. Go to **Settings** → **Credentials**
2. Click **Add credential**
3. Search for "SpamAssassin MCP" (should now be available)
4. Configure the credential:
   - **Name**: `SpamAssassin MCP account`
   - **Server URL**: `http://spamassassin-proxy:8082`
   - **API Key**: *(leave blank or use default)*
   - **Timeout**: `30000` (optional)
5. **Test** the connection
6. **Save** the credential

### 3. Update Workflow
1. Go to **Workflows**
2. Open "SpamAssassin MCP Test Workflow"
3. Click on the **SpamAssassin Scan** node
4. In the **Credentials** field, select the newly created credential
5. **Save** the workflow

### 4. Activate Workflow
1. Make sure the workflow toggle is **ON** (active)
2. The webhook should now be available at: `http://192.168.25.200:5678/webhook/spamassassin-test`

## 🧪 Test Commands

Once the credential is set up, test with these commands:

### HAM Email Test
```bash
curl -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: Business Meeting Tomorrow\nFrom: colleague@company.com\n\nJust a normal business email about our meeting.",
    "subject": "Business Meeting Tomorrow",
    "sender": "colleague@company.com"
  }'
```

### SPAM Email Test  
```bash
curl -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: URGENT! WIN MONEY NOW!\nFrom: scam@fake.com\n\nBUY CHEAP VIAGRA! Click here to win $1000000! Send your bank details NOW!",
    "subject": "URGENT! WIN MONEY NOW!",
    "sender": "scam@fake.com"
  }'
```

## 📊 Expected Results

### HAM Email Response:
```json
{
  "classification": "HAM",
  "score": 2.1,
  "threshold": 5.0,
  "confidence": "HIGH",
  "action": "ALLOW",
  "recommendation": "Allow this email - appears legitimate"
}
```

### SPAM Email Response:
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

## 🔍 Troubleshooting

If the workflow still fails:
1. Check n8n execution logs in the UI
2. Verify the SpamAssassin MCP service is running: `docker ps | grep spamassassin`
3. Test SpamAssassin MCP directly: `curl http://192.168.25.200:3987/health`
4. Check Docker network connectivity between n8n and spamassassin-proxy containers