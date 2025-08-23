const express = require('express');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'spamassassin-http-wrapper',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Main spam analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { email, subject, sender } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: 'Missing required field: email',
        code: 'MISSING_EMAIL'
      });
    }

    console.log(`[${new Date().toISOString()}] Analyzing email from: ${sender || 'unknown'}`);
    
    // Try to connect to MCP server first
    let mcpResult = null;
    try {
      mcpResult = await analyzeWithMCP(email, subject, sender);
      console.log('MCP analysis successful');
    } catch (mcpError) {
      console.log('MCP analysis failed, falling back to rule-based:', mcpError.message);
    }

    // If MCP fails, use fallback rule-based analysis
    const result = mcpResult || analyzeWithRules(email, subject, sender);
    
    res.json(result);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Internal server error during analysis',
      code: 'ANALYSIS_ERROR',
      message: error.message
    });
  }
});

// MCP-based analysis function
async function analyzeWithMCP(email, subject, sender) {
  let client;
  let transport;

  try {
    // Create stdio transport to SpamAssassin MCP server
    transport = new StdioClientTransport({
      command: 'docker',
      args: ['exec', 'n8n-cloud-spamassassin-mcp-1', 'mcp-server']
    });

    client = new Client({
      name: 'http-wrapper-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await client.connect(transport);

    // Call the scan_email tool
    const response = await client.callTool({
      name: 'scan_email',
      arguments: {
        email_content: email,
        include_headers: true,
        analysis_level: 'basic'
      }
    });

    // Parse MCP response and format for n8n
    const mcpContent = response.content[0];
    if (mcpContent && mcpContent.type === 'text') {
      const analysisResult = JSON.parse(mcpContent.text);
      
      return {
        classification: analysisResult.is_spam ? "SPAM" : "HAM",
        score: analysisResult.score || 0,
        threshold: analysisResult.threshold || 5.0,
        confidence: "HIGH",
        action: analysisResult.is_spam ? "BLOCK" : "ALLOW",
        recommendation: analysisResult.is_spam 
          ? "Block this email - identified as spam"
          : "Allow this email - appears legitimate",
        method: "MCP",
        details: analysisResult.details || [],
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('Invalid MCP response format');

  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error('Error closing MCP client:', e);
      }
    }
  }
}

// Rule-based fallback analysis
function analyzeWithRules(email, subject, sender) {
  let score = 0;
  const details = [];
  
  // Subject analysis
  if (subject) {
    const subjectUpper = subject.toUpperCase();
    
    if (subjectUpper.includes('URGENT') || subjectUpper.includes('IMMEDIATE')) {
      score += 2.5;
      details.push('Subject contains urgency keywords');
    }
    
    if (subjectUpper.includes('WIN') || subjectUpper.includes('WINNER') || subjectUpper.includes('WON')) {
      score += 2.0;
      details.push('Subject contains lottery/winning keywords');
    }
    
    if (subjectUpper.includes('MONEY') || subjectUpper.includes('CASH') || subjectUpper.includes('$')) {
      score += 1.5;
      details.push('Subject contains money-related keywords');
    }
    
    if (subjectUpper.includes('FREE') || subjectUpper.includes('CLAIM')) {
      score += 1.5;
      details.push('Subject contains promotional keywords');
    }
  }

  // Email content analysis
  if (email) {
    const emailUpper = email.toUpperCase();
    
    if (emailUpper.includes('VIAGRA') || emailUpper.includes('CIALIS')) {
      score += 3.0;
      details.push('Content contains pharmaceutical spam keywords');
    }
    
    if (emailUpper.includes('CLICK HERE') || emailUpper.includes('CLICK NOW')) {
      score += 2.0;
      details.push('Content contains suspicious call-to-action');
    }
    
    if (emailUpper.includes('BANK DETAILS') || emailUpper.includes('SOCIAL SECURITY')) {
      score += 3.0;
      details.push('Content requests sensitive information');
    }
    
    if (emailUpper.includes('LOTTERY') || emailUpper.includes('CONGRATULATIONS')) {
      score += 2.0;
      details.push('Content contains lottery scam indicators');
    }

    // Count excessive capitalization
    const capsCount = (email.match(/[A-Z]/g) || []).length;
    const totalLetters = (email.match(/[a-zA-Z]/g) || []).length;
    if (totalLetters > 0 && (capsCount / totalLetters) > 0.3) {
      score += 1.5;
      details.push('Excessive capitalization detected');
    }
    
    // Check for multiple exclamation marks
    if ((email.match(/!/g) || []).length > 3) {
      score += 1.0;
      details.push('Excessive exclamation marks');
    }
  }

  // Sender analysis
  if (sender) {
    const senderLower = sender.toLowerCase();
    
    if (senderLower.includes('scam') || senderLower.includes('fake') || senderLower.includes('noreply')) {
      score += 2.5;
      details.push('Suspicious sender address');
    }
    
    if (senderLower.includes('lottery') || senderLower.includes('winner')) {
      score += 2.0;
      details.push('Sender indicates lottery/prize scam');
    }
  }

  const threshold = 5.0;
  const isSpam = score >= threshold;
  
  return {
    classification: isSpam ? "SPAM" : "HAM",
    score: Math.round(score * 10) / 10,
    threshold: threshold,
    confidence: score > 7 ? "HIGH" : score > 3 ? "MEDIUM" : "LOW",
    action: isSpam ? "BLOCK" : "ALLOW",
    recommendation: isSpam 
      ? "Block this email - identified as spam"
      : "Allow this email - appears legitimate",
    method: "RULES",
    details: details,
    timestamp: new Date().toISOString()
  };
}

// Info endpoint for debugging
app.get('/info', (req, res) => {
  res.json({
    name: 'spamassassin-http-wrapper',
    version: '1.0.0',
    description: 'HTTP wrapper for SpamAssassin MCP server',
    endpoints: {
      'GET /health': 'Health check',
      'POST /analyze': 'Analyze email for spam (requires: email, optional: subject, sender)',
      'GET /info': 'Service information'
    },
    methods: ['MCP', 'RULES'],
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SpamAssassin HTTP Wrapper listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Analysis endpoint: POST http://localhost:${PORT}/analyze`);
  console.log(`Service info: http://localhost:${PORT}/info`);
});