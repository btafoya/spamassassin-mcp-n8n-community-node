# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.6] - 2025-08-22

### Fixed
- Resolved "EventSource is not defined" error when using HTTP/SSE connection type
- Added event-source-polyfill for Node.js environments
- Improved type safety by replacing `any` types with more specific types
- Enhanced error handling in MCP client connections

## [1.0.0] - 2024-01-15

### Added
- Initial release of SpamAssassin MCP community node for n8n
- Four core operations:
  - **Scan Email**: Analyze email content for spam probability
  - **Check Reputation**: Verify sender, IP, and domain reputation
  - **Test Rules**: Test custom SpamAssassin rules
  - **Explain Score**: Detailed spam score breakdown
- Support for both command-line and HTTP/SSE connections to MCP server
- Comprehensive TypeScript types and interfaces
- Configurable analysis levels (Basic, Detailed, Full)
- Built-in error handling and timeout management
- Debug logging capabilities
- Professional SVG icon
- Complete documentation and examples

### Security
- Defensive operations only - no email sending capabilities
- Input validation for all user inputs
- No persistent email storage
- Rate limiting support through MCP server
- Secure credential handling

### Performance
- Efficient MCP client connection management
- Configurable timeouts
- Automatic connection cleanup
- Support for batch processing with continue-on-fail

### Developer Experience
- Full TypeScript support
- ESLint configuration with n8n-specific rules
- Prettier code formatting
- Comprehensive test structure
- Development scripts for watch mode
- Professional package structure following n8n guidelines