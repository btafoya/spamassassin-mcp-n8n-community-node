import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

// EventSource polyfill for Node.js environment
import { EventSourcePolyfill } from 'event-source-polyfill';
globalThis.EventSource = EventSourcePolyfill as any;

export class SpamAssassinMcp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SpamAssassin MCP',
		name: 'spamAssassinMcp',
		icon: 'file:spamassassin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Analyze emails for spam using SpamAssassin MCP server',
		defaults: {
			name: 'SpamAssassin MCP',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'spamAssassinMcpApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scan Email',
						value: 'scan_email',
						description: 'Analyze email content for spam probability',
						action: 'Scan email for spam',
					},
					{
						name: 'Check Reputation',
						value: 'check_reputation',
						description: 'Check sender reputation and blacklists',
						action: 'Check sender reputation',
					},
					{
						name: 'Test Rules',
						value: 'test_rules',
						description: 'Test custom spam detection rules',
						action: 'Test spam detection rules',
					},
					{
						name: 'Explain Score',
						value: 'explain_score',
						description: 'Get detailed spam score breakdown',
						action: 'Explain spam score',
					},
				],
				default: 'scan_email',
			},
			// Scan Email Operation
			{
				displayName: 'Email Content',
				name: 'emailContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				description: 'The raw email content to analyze',
				displayOptions: {
					show: {
						operation: ['scan_email'],
					},
				},
			},
			{
				displayName: 'Include Headers',
				name: 'includeHeaders',
				type: 'boolean',
				default: true,
				description: 'Whether to include email headers in analysis',
				displayOptions: {
					show: {
						operation: ['scan_email'],
					},
				},
			},
			{
				displayName: 'Analysis Level',
				name: 'analysisLevel',
				type: 'options',
				options: [
					{
						name: 'Basic',
						value: 'basic',
						description: 'Basic spam analysis',
					},
					{
						name: 'Detailed',
						value: 'detailed',
						description: 'Detailed analysis with rule breakdown',
					},
					{
						name: 'Full',
						value: 'full',
						description: 'Complete analysis with all available checks',
					},
				],
				default: 'basic',
				description: 'Level of analysis to perform',
				displayOptions: {
					show: {
						operation: ['scan_email'],
					},
				},
			},
			// Check Reputation Operation
			{
				displayName: 'Email Address',
				name: 'emailAddress',
				type: 'string',
				default: '',
				required: true,
				description: 'Email address to check reputation for',
				displayOptions: {
					show: {
						operation: ['check_reputation'],
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				description: 'IP address to check (optional)',
				displayOptions: {
					show: {
						operation: ['check_reputation'],
					},
				},
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				description: 'Domain to check (optional)',
				displayOptions: {
					show: {
						operation: ['check_reputation'],
					},
				},
			},
			// Test Rules Operation
			{
				displayName: 'Rules Content',
				name: 'rulesContent',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				required: true,
				description: 'Custom spam detection rules to test',
				displayOptions: {
					show: {
						operation: ['test_rules'],
					},
				},
			},
			{
				displayName: 'Test Email',
				name: 'testEmail',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				description: 'Email content to test the rules against',
				displayOptions: {
					show: {
						operation: ['test_rules'],
					},
				},
			},
			// Explain Score Operation
			{
				displayName: 'Score Email Content',
				name: 'scoreEmailContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				description: 'Email content to explain the spam score for',
				displayOptions: {
					show: {
						operation: ['explain_score'],
					},
				},
			},
			{
				displayName: 'Detailed Explanation',
				name: 'detailedExplanation',
				type: 'boolean',
				default: true,
				description: 'Whether to include detailed rule explanations',
				displayOptions: {
					show: {
						operation: ['explain_score'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('spamAssassinMcpApi');

		// Initialize MCP client based on connection type
		let client: Client;
		let transport: StdioClientTransport | SSEClientTransport;

		try {
			if (credentials.connectionType === 'command') {
				const command = credentials.command as string;
				const args = credentials.args ? (credentials.args as string).split(' ') : [];
				
				transport = new StdioClientTransport({
					command,
					args,
				});
			} else {
				const baseUrl = credentials.baseUrl as string;
				const sseUrl = baseUrl.endsWith('/') ? baseUrl + 'sse' : baseUrl + '/sse';
				transport = new SSEClientTransport(new globalThis.URL(sseUrl));
			}

			client = new Client(
				{
					name: 'n8n-spamassassin-mcp-client',
					version: '1.0.0',
				},
				{
					capabilities: {},
				},
			);

			await client.connect(transport);

			// Process each item
			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				try {
					let result: Record<string, unknown>;

					switch (operation) {
						case 'scan_email':
							result = await handleScanEmail(this, client, itemIndex);
							break;

						case 'check_reputation':
							result = await handleCheckReputation(this, client, itemIndex);
							break;

						case 'test_rules':
							result = await handleTestRules(this, client, itemIndex);
							break;

						case 'explain_score':
							result = await handleExplainScore(this, client, itemIndex);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown operation: ${operation}`,
								{ itemIndex },
							);
					}

					returnData.push({
						json: {
							operation,
							...result,
						},
						pairedItem: itemIndex,
					});
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {
								error: error instanceof Error ? error.message : String(error),
								operation,
							},
							pairedItem: itemIndex,
						});
						continue;
					}
					throw error;
				}
			}
		} finally {
			if (client!) {
				await client.close();
			}
		}

		return [returnData];
	}

}

async function handleScanEmail(executeFunctions: IExecuteFunctions, client: Client, itemIndex: number) {
	const emailContent = executeFunctions.getNodeParameter('emailContent', itemIndex) as string;
	const includeHeaders = executeFunctions.getNodeParameter('includeHeaders', itemIndex) as boolean;
	const analysisLevel = executeFunctions.getNodeParameter('analysisLevel', itemIndex) as string;

	const response = await client.callTool({
		name: 'scan_email',
		arguments: {
			email_content: emailContent,
			include_headers: includeHeaders,
			analysis_level: analysisLevel,
		},
	});

	return {
		scanResult: response.content,
		timestamp: new Date().toISOString(),
	};
}

async function handleCheckReputation(executeFunctions: IExecuteFunctions, client: Client, itemIndex: number) {
	const emailAddress = executeFunctions.getNodeParameter('emailAddress', itemIndex) as string;
	const ipAddress = executeFunctions.getNodeParameter('ipAddress', itemIndex, '') as string;
	const domain = executeFunctions.getNodeParameter('domain', itemIndex, '') as string;

	const args: any = { email_address: emailAddress };
	if (ipAddress) args.ip_address = ipAddress;
	if (domain) args.domain = domain;

	const response = await client.callTool({
		name: 'check_reputation',
		arguments: args,
	});

	return {
		reputationResult: response.content,
		timestamp: new Date().toISOString(),
	};
}

async function handleTestRules(executeFunctions: IExecuteFunctions, client: Client, itemIndex: number) {
	const rulesContent = executeFunctions.getNodeParameter('rulesContent', itemIndex) as string;
	const testEmail = executeFunctions.getNodeParameter('testEmail', itemIndex) as string;

	const response = await client.callTool({
		name: 'test_rules',
		arguments: {
			rules_content: rulesContent,
			test_email: testEmail,
		},
	});

	return {
		testResult: response.content,
		timestamp: new Date().toISOString(),
	};
}

async function handleExplainScore(executeFunctions: IExecuteFunctions, client: Client, itemIndex: number) {
	const scoreEmailContent = executeFunctions.getNodeParameter('scoreEmailContent', itemIndex) as string;
	const detailedExplanation = executeFunctions.getNodeParameter('detailedExplanation', itemIndex) as boolean;

	const response = await client.callTool({
		name: 'explain_score',
		arguments: {
			email_content: scoreEmailContent,
			detailed_explanation: detailedExplanation,
		},
	});

	return {
		scoreExplanation: response.content,
		timestamp: new Date().toISOString(),
	};
}