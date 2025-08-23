# SpamAssassin MCP Credential Configuration Fix

## 🚨 Issue Resolved
**Problem**: "Invalid URL" error when configuring SpamAssassin MCP credential in n8n
**Root Cause**: Incorrect connection type and URL configuration

## ✅ Solution

### Correct Configuration
1. **Connection Type**: `HTTP/SSE` (not Command Line)
2. **Base URL**: `http://spamassassin-mcp:8080`
3. **API Key**: Leave blank
4. **Timeout**: `30000`

### Manual Steps
1. Open n8n UI: `http://192.168.25.200:5678`
2. Settings → Credentials → Edit SpamAssassin MCP credential
3. Change **Connection Type** to `HTTP/SSE`
4. Set **Base URL** to `http://spamassassin-mcp:8080`
5. Leave **API Key** blank
6. Test connection (should pass)
7. Save credential

## 🔄 Fallback URLs
If primary URL fails, try:
1. `http://spamassassin-proxy:8082`
2. `http://192.168.25.200:3987` 
3. `http://172.23.0.2:8080`

## 🧪 Ready for Testing
Once credential is configured, test with:

```bash
# HAM Email Test
curl -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: Team Meeting\nFrom: manager@company.com\n\nWeekly team meeting tomorrow at 2 PM.",
    "subject": "Team Meeting",
    "sender": "manager@company.com"
  }'

# SPAM Email Test  
curl -X POST "http://192.168.25.200:5678/webhook/spamassassin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: URGENT! WIN MONEY!\nFrom: scam@fake.com\n\nBUY CHEAP VIAGRA! WIN $1000000! CLICK NOW!",
    "subject": "URGENT! WIN MONEY!",
    "sender": "scam@fake.com"
  }'
```

## 📊 Expected Results
- **HAM**: `classification: "HAM"`, `action: "ALLOW"`
- **SPAM**: `classification: "SPAM"`, `action: "BLOCK"`