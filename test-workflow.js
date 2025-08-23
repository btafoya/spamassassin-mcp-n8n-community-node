#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const http = require('http');

// Configuration
const N8N_URL = 'http://192.168.25.200:5678';
const WORKFLOW_FILE = './spamassassin-test-workflow.json';

// Test functions
async function testWorkflowImport() {
    try {
        console.log('🔍 Testing n8n workflow import and execution...');
        
        // Read workflow file
        const workflowData = JSON.parse(fs.readFileSync(WORKFLOW_FILE, 'utf8'));
        console.log('✅ Workflow file loaded successfully');
        
        // Validate workflow structure
        console.log('📊 Workflow validation:');
        console.log(`  - Nodes: ${workflowData.nodes.length}`);
        console.log(`  - Connections: ${Object.keys(workflowData.connections).length}`);
        
        // Check for SpamAssassin node
        const spamAssassinNode = workflowData.nodes.find(node => 
            node.type === 'n8n-nodes-spamassassin-mcp.spamAssassinMcp'
        );
        
        if (spamAssassinNode) {
            console.log('✅ SpamAssassin MCP node found');
            console.log(`  - Node ID: ${spamAssassinNode.id}`);
            console.log(`  - Credential ID: ${spamAssassinNode.credentials?.spamAssassinMcpApi?.id || 'None'}`);
        } else {
            console.log('❌ SpamAssassin MCP node not found');
        }
        
        // Test webhook endpoint
        console.log('\n🌐 Testing webhook access...');
        await testWebhookEndpoint();
        
        // Test manual trigger endpoint  
        console.log('\n⚡ Testing manual execution...');
        await testManualExecution();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testWebhookEndpoint() {
    return new Promise((resolve) => {
        const testData = JSON.stringify({
            email: `Subject: Test Email
From: test@example.com
To: recipient@example.com

This is a test email for SpamAssassin scanning.
Visit https://example.com for more info.
Click here to claim your prize!`,
            subject: 'Test Email',
            sender: 'test@example.com'
        });
        
        const options = {
            hostname: '192.168.25.200',
            port: 5678,
            path: '/webhook/spamassassin-test',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': testData.length
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    console.log(`  - Status: ${res.statusCode}`);
                    if (res.statusCode === 200) {
                        const result = JSON.parse(data);
                        console.log('  - Response:', JSON.stringify(result, null, 2));
                        console.log('✅ Webhook test completed successfully');
                    } else {
                        console.log('⚠️  Webhook response:', data);
                    }
                } catch (e) {
                    console.log('⚠️  Raw response:', data);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Webhook error:', error.message);
            resolve();
        });
        
        req.write(testData);
        req.end();
    });
}

async function testManualExecution() {
    // This would require API access which we don't have configured
    console.log('⚠️  Manual execution test requires API key configuration');
}

// Run tests
testWorkflowImport();