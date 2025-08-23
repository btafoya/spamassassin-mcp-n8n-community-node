#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const http = require('http');

// Configuration
const N8N_URL = 'http://192.168.25.200:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;
const WORKFLOW_FILE = '/home/btafoya/docker-stacks/n8n-cloud/local-files/spamassassin-test-workflow-fixed.json';

console.log('🚀 Deploying SpamAssassin workflow via n8n API...');
console.log(`API URL: ${N8N_URL}`);
console.log(`API Key: ${N8N_API_KEY ? 'Set' : 'Not set'}`);

async function makeAPICall(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '192.168.25.200',
            port: 5678,
            path: `/api/v1${path}`,
            method: method,
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsedData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function deployWorkflow() {
    try {
        // Read workflow file
        const workflowData = JSON.parse(fs.readFileSync(WORKFLOW_FILE, 'utf8'));
        console.log('✅ Workflow file loaded');

        // List existing workflows first
        console.log('\n📋 Checking existing workflows...');
        const workflows = await makeAPICall('/workflows');
        
        if (workflows.status !== 200) {
            console.error('❌ Failed to list workflows:', workflows.data);
            return;
        }

        console.log('Workflows API response:', workflows.data);
        
        // Handle different response formats
        let workflowList = workflows.data;
        if (workflows.data.data) {
            workflowList = workflows.data.data;
        }
        
        if (!Array.isArray(workflowList)) {
            console.log('⚠️ Workflows response is not an array, proceeding to create new workflow');
            workflowList = [];
        }

        console.log(`Found ${workflowList.length} existing workflows`);
        
        // Check if workflow already exists
        const existingWorkflow = workflowList.find(w => 
            w.name === 'SpamAssassin MCP Test Workflow' || 
            w.name === 'SpamAssassin Test Workflow' || 
            (w.nodes && JSON.stringify(w.nodes).includes('spamassassin-test'))
        );

        let workflowId;
        
        if (existingWorkflow) {
            console.log('🔄 Updating existing workflow:', existingWorkflow.id);
            workflowId = existingWorkflow.id;
            
            // Update workflow
            const updateResult = await makeAPICall(`/workflows/${workflowId}`, 'PUT', {
                ...workflowData,
                name: 'SpamAssassin Test Workflow'
            });
            
            if (updateResult.status === 200) {
                console.log('✅ Workflow updated successfully');
            } else {
                console.error('❌ Failed to update workflow:', updateResult.data);
                return;
            }
        } else {
            console.log('➕ Creating new workflow...');
            
            // Create workflow
            const createResult = await makeAPICall('/workflows', 'POST', {
                ...workflowData,
                name: 'SpamAssassin Test Workflow',
                active: false
            });
            
            if (createResult.status === 201) {
                console.log('✅ Workflow created successfully');
                workflowId = createResult.data.id;
            } else {
                console.error('❌ Failed to create workflow:', createResult.data);
                return;
            }
        }

        // Activate workflow
        console.log('\n🔴 Activating workflow...');
        const activateResult = await makeAPICall(`/workflows/${workflowId}/activate`, 'POST');
        
        if (activateResult.status === 200) {
            console.log('✅ Workflow activated successfully');
            console.log(`🌐 Webhook URL: ${N8N_URL}/webhook/spamassassin-test`);
        } else {
            console.log('⚠️ Failed to activate workflow:', activateResult.data);
        }

        // Test the webhook
        console.log('\n🧪 Testing webhook...');
        await testWebhook();

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
    }
}

async function testWebhook() {
    const testData = {
        email: `Subject: Test Email
From: test@example.com
To: recipient@example.com

This is a test email for SpamAssassin scanning.
Buy cheap medications online! Click here for amazing deals!
Claim your prize now!`,
        subject: 'Test Email',
        sender: 'test@example.com'
    };

    return new Promise((resolve) => {
        const options = {
            hostname: '192.168.25.200',
            port: 5678,
            path: '/webhook/spamassassin-test',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(testData).length
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`📊 Webhook Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const result = JSON.parse(data);
                        console.log('🎯 Test Result:', JSON.stringify(result, null, 2));
                    } catch (e) {
                        console.log('📝 Raw Response:', data);
                    }
                } else {
                    console.log('⚠️ Response:', data);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('❌ Webhook test error:', error.message);
            resolve();
        });

        req.write(JSON.stringify(testData));
        req.end();
    });
}

// Run deployment
deployWorkflow();