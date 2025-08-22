# Fix Summary: EventSource is not defined error

## Problem
The SpamAssassin MCP node was throwing an "EventSource is not defined" error when using the HTTP/SSE connection type. This occurred because:

1. The @modelcontextprotocol/sdk's SSEClientTransport uses EventSource API
2. EventSource is a browser API that's not natively available in Node.js environment
3. n8n runs in a Node.js environment

## Solution
Added a polyfill for EventSource in the Node.js environment:

1. Installed `event-source-polyfill` package:
   ```
   npm install event-source-polyfill
   ```

2. Added polyfill import and global assignment in SpamAssassinMcp.node.ts:
   ```typescript
   import { EventSourcePolyfill } from 'event-source-polyfill';
   globalThis.EventSource = EventSourcePolyfill as any;
   ```

3. Added type definitions for the polyfill:
   ```
   npm install --save-dev @types/event-source-polyfill
   ```

4. Updated package.json to include the new dependency

5. Fixed linting issues by replacing `any` types with more specific types

## Files Modified
- nodes/SpamAssassinMcp/SpamAssassinMcp.node.ts
- nodes/SpamAssassinMcp/types.ts
- package.json
- Updated dist files with `npm run build`

## Testing
After implementing the fix, rebuild the project with `npm run build` to apply changes.

## Additional Information
See README_HTTP_TESTING.md for detailed HTTP/SSE connection testing instructions.