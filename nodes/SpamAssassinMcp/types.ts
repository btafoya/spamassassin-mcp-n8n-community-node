export interface SpamAssassinMcpCredentials {
	connectionType: 'command' | 'http';
	command?: string;
	args?: string;
	baseUrl?: string;
	apiKey?: string;
	timeout: number;
	debugLogging: boolean;
}

export interface ScanEmailOptions {
	email_content: string;
	include_headers?: boolean;
	analysis_level?: 'basic' | 'detailed' | 'full';
}

export interface CheckReputationOptions {
	email_address: string;
	ip_address?: string;
	domain?: string;
}

export interface TestRulesOptions {
	rules_content: string;
	test_email: string;
}

export interface ExplainScoreOptions {
	email_content: string;
	detailed_explanation?: boolean;
}

export interface SpamScanResult {
	is_spam: boolean;
	spam_score: number;
	threshold: number;
	confidence: number;
	rules_triggered: string[];
	analysis_time_ms: number;
	headers_analyzed?: boolean;
	details?: {
		[key: string]: unknown;
	};
}

export interface ReputationResult {
	email_reputation: {
		is_blacklisted: boolean;
		reputation_score: number;
		sources_checked: string[];
	};
	ip_reputation?: {
		is_blacklisted: boolean;
		reputation_score: number;
		country?: string;
		asn?: string;
	};
	domain_reputation?: {
		is_blacklisted: boolean;
		reputation_score: number;
		age_days?: number;
		mx_records?: string[];
	};
}

export interface RuleTestResult {
	rules_tested: number;
	rules_passed: number;
	rules_failed: number;
	test_results: Array<{
		rule_name: string;
		passed: boolean;
		score_contribution: number;
		description?: string;
		error?: string;
	}>;
	total_score: number;
}

export interface ScoreExplanation {
	total_score: number;
	threshold: number;
	is_spam: boolean;
	rule_explanations: Array<{
		rule_name: string;
		score: number;
		description: string;
		category: string;
		triggered: boolean;
	}>;
	summary: {
		positive_rules: number;
		negative_rules: number;
		neutral_rules: number;
		highest_scoring_rule: string;
		recommendation: string;
	};
}

export type SpamAssassinOperation = 'scan_email' | 'check_reputation' | 'test_rules' | 'explain_score';

export interface McpToolResponse {
	content: SpamScanResult | ReputationResult | RuleTestResult | ScoreExplanation | Record<string, unknown>;
	isError?: boolean;
}