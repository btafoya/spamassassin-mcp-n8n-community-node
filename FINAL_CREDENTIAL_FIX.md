# 🎯 FINAL SOLUTION: SpamAssassin MCP Credential Fix

## ✅ Root Cause Identified
**Problem**: Transport mismatch between n8n community node and SpamAssassin MCP server
- **SpamAssassin MCP Server**: Only supports `stdio` transport (runs as `mcp-server` process)
- **n8n Community Node**: Was configured for `HTTP/SSE` transport (looking for `/sse` endpoint)
- **Result**: 404 errors because HTTP endpoints don't exist

## 🔧 CORRECT Configuration

### In n8n UI Credential Settings:
1. **Connection Type**: `Command Line` ⚠️ (NOT HTTP/SSE)
2. **Command**: `npx @btafoya/spamassassin-mcp`
3. **Arguments**: *(leave blank)*
4. **API Key**: *(leave blank)*
5. **Timeout**: `30000`

### Manual Steps:
1. Open n8n UI: `http://192.168.25.200:5678`
2. Go to **Settings** → **Credentials** 
3. Edit your **SpamAssassin MCP** credential
4. **CHANGE Connection Type** from `HTTP/SSE` to `Command Line`
5. Set **Command** to: `npx @btafoya/spamassassin-mcp`
6. Leave **Arguments** blank
7. **Test Connection** (should now work)
8. **Save** credential

## 🧪 Test After Fix

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

## 🔍 Technical Details
- **Community Node Code**: Uses MCP SDK with both `stdio` and `sse` transports
- **Server Implementation**: `mcp-server` process only supports `stdio`
- **Fix**: Switch to `Command Line` connection type for `stdio` transport
- **Package**: Uses `@btafoya/spamassassin-mcp` npm package