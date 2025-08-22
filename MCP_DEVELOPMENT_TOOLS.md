# MCP Development Tools Reference

## Overview
This document catalogs the Model Context Protocol (MCP) tools used during SpamAssassin MCP n8n node development, testing, and troubleshooting.

## MCP Servers Used

### 1. n8n-mcp Server
**Purpose**: n8n workflow management and API integration

#### Key Tools Used:
- `n8n_health_check` - Verify n8n API connectivity
- `n8n_diagnostic` - Debug n8n-mcp configuration and connection issues
- `n8n_create_workflow` - Programmatically create workflows
- `n8n_get_workflow` - Retrieve workflow definitions
- `n8n_list_workflows` - Browse available workflows
- `n8n_trigger_webhook_workflow` - Execute webhook-based workflows

#### Configuration:
```json
{
  "env": {
    "N8N_API_URL": "https://n8n.tafoyaventures.com",
    "N8N_API_KEY": "${N8N_API_KEY}",
    "MCP_MODE": "stdio"
  }
}
```

#### Usage Examples:
```javascript
// Health check
mcp__n8n-mcp__n8n_health_check()

// Diagnostic with verbose output
mcp__n8n-mcp__n8n_diagnostic({verbose: true})

// Create workflow
mcp__n8n-mcp__n8n_create_workflow({
  name: "SpamAssassin MCP Test Workflow",
  nodes: [...],
  connections: {...}
})
```

### 2. mcp-ssh Server
**Purpose**: Remote server management and Docker stack operations

#### Key Tools Used:
- `listKnownHosts` - Enumerate SSH connection targets
- `checkConnectivity` - Verify SSH connection status
- `runRemoteCommand` - Execute commands on remote servers
- `getHostInfo` - Retrieve SSH host configuration

#### Configuration:
```json
{
  "command": "npx",
  "args": ["@aiondadotcom/mcp-ssh"]
}
```

#### Usage Examples:
```javascript
// Check connectivity
mcp__mcp-ssh__checkConnectivity({hostAlias: "cloud.tafoyaventures.com"})

// Run Docker commands
mcp__mcp-ssh__runRemoteCommand({
  hostAlias: "cloud.tafoyaventures.com",
  command: "cd /opt/stacks/n8n && docker compose logs n8n --tail=20"
})
```

### 3. sequential-thinking Server
**Purpose**: Complex problem-solving and systematic analysis

#### Key Tools Used:
- `sequentialthinking` - Multi-step reasoning for troubleshooting complex issues

#### Configuration:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

## Development Workflow Integration

### Issue Resolution Process
1. **n8n-mcp**: Verify API connectivity and workflow status
2. **mcp-ssh**: Access remote Docker environment
3. **sequential-thinking**: Analyze complex SSE connection issues
4. **n8n-mcp**: Deploy and test solutions

### Testing Pipeline
1. Create workflow via `n8n_create_workflow`
2. Verify deployment with `n8n_health_check`
3. Monitor remote services via `mcp-ssh` commands
4. Execute tests through workflow triggers

## Key Development Challenges Solved

### SSE Endpoint Mapping
**Problem**: SpamAssassin MCP node expected `/sse` endpoint, but server provided `/mcp`
**Solution**: Created nginx proxy container mapping `/sse` → `/mcp`
**Tools Used**: mcp-ssh for remote Docker management, n8n-mcp for verification

### Environment Variable Configuration
**Problem**: Docker container not receiving updated environment variables
**Solution**: Container recreation with proper environment passing
**Tools Used**: mcp-ssh for remote Docker operations

### Workflow Validation
**Problem**: Need to programmatically create and test SpamAssassin workflows
**Solution**: JSON-based workflow creation via n8n-mcp API
**Tools Used**: n8n-mcp for workflow lifecycle management

## Docker Stack Configuration

### Remote Environment: cloud.tafoyaventures.com:/opt/stacks/n8n

#### Services:
- **n8n**: Main workflow engine (port 5678)
- **spamassassin-mcp**: MCP server (port 8080 internal, 3987 external)
- **spamassassin-proxy**: nginx proxy for SSE endpoint mapping (port 8081)

#### Environment Variables:
```yaml
environment:
  - SPAMASSASSIN_MCP_URL=http://spamassassin-proxy:8081
  - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

## Testing Methodology

### Functional Testing
1. **Connectivity**: Verify MCP server health and SSE endpoints
2. **Integration**: Test n8n node communication with SpamAssassin MCP
3. **Workflow**: Execute complete email scanning workflows
4. **Error Handling**: Validate error scenarios and fallbacks

### Tools Used for Testing:
- `mcp-ssh` for infrastructure verification
- `n8n-mcp` for workflow execution
- Direct HTTP testing via remote commands

## Best Practices Learned

### MCP Server Management
- Always verify health before operations
- Use diagnostic tools to troubleshoot configuration issues
- Monitor server logs during development

### Remote Development
- SSH key authentication preferred over passwords
- Use Docker networks for internal service communication
- Implement proper error handling and logging

### Workflow Development
- Create workflows programmatically for reproducibility
- Include comprehensive error handling paths
- Use webhook endpoints for testing and validation

## Future Enhancements

### Additional MCP Integration
- Consider magic-ui for enhanced workflow visualization
- Integrate context7 for documentation and patterns
- Add puppeteer for automated E2E testing

### Monitoring and Observability
- Implement structured logging across all components
- Add health check endpoints for all services
- Create automated testing pipelines

## Troubleshooting Guide

### Common Issues
1. **SSE Connection Failures**: Check nginx proxy configuration and endpoint mapping
2. **Environment Variable Issues**: Verify Docker container recreation after changes
3. **API Authentication**: Confirm N8N_API_KEY is properly set and valid
4. **SSH Connectivity**: Verify host keys and authentication methods

### Diagnostic Commands
```bash
# Via mcp-ssh
cd /opt/stacks/n8n && docker compose ps
cd /opt/stacks/n8n && docker compose logs n8n --tail=20
cd /opt/stacks/n8n && docker exec n8n env | grep SPAMASSASSIN

# Via n8n-mcp
n8n_health_check()
n8n_diagnostic({verbose: true})
```

---

*Generated: 2025-08-22*
*Version: 1.0*
*Project: SpamAssassin MCP n8n Community Node*