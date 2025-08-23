# SpamAssassin MCP Credential Configuration

## 🔗 Correct URLs to Try

Based on the container analysis, here are the correct URLs to use for the SpamAssassin MCP credential:

### Option 1: Direct to SpamAssassin MCP (Recommended)
```
http://spamassassin-mcp:8080
```

### Option 2: Via Proxy
```
http://spamassassin-proxy:8082
```

### Option 3: External URL (if internal doesn't work)
```
http://192.168.25.200:3987
```

## 📋 Credential Setup Instructions

1. **Open n8n UI**: `http://192.168.25.200:5678`
2. **Go to**: Settings → Credentials → Add credential
3. **Select**: "SpamAssassin MCP"
4. **Configure**:
   - **Name**: `SpamAssassin MCP account`
   - **Server URL**: Try `http://spamassassin-mcp:8080` first
   - **API Key**: Leave blank (not required for MCP)
   - **Timeout**: `30000` (optional)
5. **Test Connection**
6. **Save** if successful

## 🔧 If Connection Still Fails

### Try Alternative URLs in this order:
1. `http://spamassassin-mcp:8080` ← **Most likely to work**
2. `http://192.168.25.200:3987` 
3. `http://spamassassin-proxy:8082`
4. `http://172.23.0.2:8080` (direct IP)

### Additional Troubleshooting:
- Make sure no authentication fields are filled (MCP doesn't use API keys)
- Check if there are any additional configuration fields in the credential form
- Look for MCP-specific settings like "Transport Type" or "Protocol"

## ✅ Expected Behavior
Once connected successfully, you should be able to:
1. Test the credential connection (green checkmark)
2. Save the credential
3. Use it in the SpamAssassin Scan node
4. Test the workflow via webhook