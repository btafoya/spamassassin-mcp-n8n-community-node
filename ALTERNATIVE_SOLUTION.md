# 🎯 Alternative Solution: Replace MCP Community Node

## 🚨 Problem Summary
- **SpamAssassin MCP Server**: stdio-only (no HTTP endpoints)
- **n8n Community Node**: expects HTTP/SSE or npm package (neither available)
- **Docker n8n**: cannot execute arbitrary tools
- **Result**: Fundamental architectural incompatibility

## ✅ Practical Solution: Use HTTP Request Node

Replace the SpamAssassin MCP community node with a standard **HTTP Request** node that calls our n8n MCP server.

### Implementation Steps:

#### 1. Modify the Workflow
Replace the **SpamAssassin Scan** node with:
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `http://localhost:3000/mcp/tools/scan_email`
- **Body**: 
```json
{
  "email_content": "{{$json.email}}",
  "include_headers": true,
  "analysis_level": "basic"
}
```

#### 2. Update n8n MCP Configuration
Ensure your `~/.mcp.json` has the n8n MCP server configured:
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["@btafoya/n8n-mcp"],
      "env": {
        "N8N_API_BASE": "http://192.168.25.200:5678",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### 3. Test the MCP Connection
```bash
# Test MCP server directly
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"scan_email","arguments":{"email_content":"Subject: Test\\nTest email"}}}' | \
  npx @btafoya/n8n-mcp
```

## 🔧 Quick Fix: Simple HTTP Mock
If MCP integration is too complex, create a simple HTTP endpoint:

```javascript
// spamassassin-http-wrapper.js
const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());

app.post('/analyze', (req, res) => {
  const { email, subject, sender } = req.body;
  
  // Simple spam scoring logic
  const score = calculateSpamScore(email, subject, sender);
  const isSpam = score > 5.0;
  
  res.json({
    classification: isSpam ? "SPAM" : "HAM",
    score: score,
    threshold: 5.0,
    confidence: "HIGH",
    action: isSpam ? "BLOCK" : "ALLOW",
    recommendation: isSpam 
      ? "Block this email - identified as spam"
      : "Allow this email - appears legitimate"
  });
});

function calculateSpamScore(email, subject, sender) {
  let score = 0;
  
  // Simple spam indicators
  if (subject && subject.includes('URGENT')) score += 2.5;
  if (subject && subject.includes('WIN') || subject.includes('MONEY')) score += 2.0;
  if (email && email.includes('VIAGRA')) score += 3.0;
  if (email && email.includes('CLICK')) score += 1.5;
  if (sender && sender.includes('scam')) score += 2.0;
  
  return Math.min(score, 10.0);
}

app.listen(9000, () => {
  console.log('SpamAssassin HTTP wrapper running on port 9000');
});
```

## 📋 Next Steps
1. **Option A**: Modify workflow to use HTTP Request node calling n8n MCP
2. **Option B**: Create simple HTTP wrapper service
3. **Option C**: Use the existing n8n MCP server from your Claude Code environment

Choose the option that best fits your architecture preferences.