import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SpamAssassinMcpApi implements ICredentialType {
	name = 'spamAssassinMcpApi';
	displayName = 'SpamAssassin MCP API';
	description = 'Connect to SpamAssassin MCP server for email analysis';
	icon = 'file:spamassassin.svg' as const;
	httpRequestNode = {
		name: 'SpamAssassin MCP',
		docsUrl: 'https://github.com/btafoya/spamassassin-mcp',
		apiBaseUrl: '',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Connection Type',
			name: 'connectionType',
			type: 'options',
			options: [
				{
					name: 'Command Line',
					value: 'command',
					description: 'Connect via command line execution',
				},
				{
					name: 'HTTP/SSE',
					value: 'http',
					description: 'Connect via HTTP Server-Sent Events',
				},
			],
			default: 'command',
			description: 'How to connect to the SpamAssassin MCP server',
		},
		{
			displayName: 'Command',
			name: 'command',
			type: 'string',
			default: 'npx @btafoya/spamassassin-mcp',
			description: 'Command to start the SpamAssassin MCP server',
			displayOptions: {
				show: {
					connectionType: ['command'],
				},
			},
		},
		{
			displayName: 'Arguments',
			name: 'args',
			type: 'string',
			default: '',
			description: 'Additional command line arguments',
			displayOptions: {
				show: {
					connectionType: ['command'],
				},
			},
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:3000',
			description: 'Base URL for the SpamAssassin MCP server',
			displayOptions: {
				show: {
					connectionType: ['http'],
				},
			},
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for authentication (if required)',
			displayOptions: {
				show: {
					connectionType: ['http'],
				},
			},
		},
		{
			displayName: 'Timeout (seconds)',
			name: 'timeout',
			type: 'number',
			default: 30,
			description: 'Connection timeout in seconds',
		},
		{
			displayName: 'Enable Debug Logging',
			name: 'debugLogging',
			type: 'boolean',
			default: false,
			description: 'Enable debug logging for MCP communication',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '',
			url: '/mcp/info',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'Connection test successful',
					key: 'name',
					value: 'spamassassin-mcp',
				},
			},
		],
	};
}