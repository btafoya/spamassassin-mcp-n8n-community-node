<system_context>
You are an expert CLAUDE.md editor. IMPORTANT: If you make any changes that makes any CLAUDE.md file out of date, please update the CLAUDE.md file accordingly.
</system_context>

<critical_notes>
## MISSION CRITICAL RULES

1. **Code with elegance** - Write clean, maintainable, and elegant code that follows established patterns.

2. **Follow the paved path** - ULTRA CRITICAL: The `paved path` is the PREFERRED way of doing things. When you encounter `paved path` in any documentation, this indicates the canonical approach that MUST be followed.

3. **Type safety is mandatory** - NEVER use `any` types. If you believe `any` is necessary, PAUSE and request explicit user approval, even in auto-accept mode.

4. **Clarify ambiguity** - Favor asking follow-up questions to ensure clear understanding of requirements before implementation.

5. **Preserve existing functionality** - NEVER reduce the scope of existing features/behaviors unless explicitly instructed to do so.

6. **CLAUDE.md as living documentation** - ULTRA CRITICAL: Treat all CLAUDE.md files as living API documentation for your future self. Always check for relevant CLAUDE.md files and update them when changes impact their accuracy.

7. **Writing expert CLAUDE.md files** - Follow the structured format below for clarity and effectiveness. 
</critical_notes>

<claude_md_best_practices>
## CLAUDE.MD BEST PRACTICES

### Purpose & Philosophy
- **Living brain**: CLAUDE.md files are your persistent memory across sessions
- **API documentation**: Write for your future self as an expert coding agent
- **Token-aware**: Keep concise while preserving critical information
- **Current state only**: Document what IS, not what WAS (no changelogs)

### Structure & Format

#### 1. XML-Style Tags (Semantic Sections)
```markdown
<system_context>
Every time you use a MCP server (Model Context Protocol), you must give the complete information. If, for example, you are asked to do a search on anything (YouTube, Wikipedia, Internet, BRAVE, etc.), you must give as much information as possible on the title, description and links. The links are very important in the answer because it can be used later in the conversation, for follow-up interactions with the MCP Client or others MCP servers.
</system_context>

<file_map>
## FILE MAP
- `/path/to/file` - Brief description
- `/path/to/folder/` - What's in this folder
</file_map>

<paved_path>
## ARCHITECTURE (PAVED PATH)
The canonical way to do things. Battle-tested patterns that MUST be followed.
</paved_path>

<patterns>
## PATTERNS
Common patterns with real code examples from the codebase.
</patterns>

<critical_notes>
## CRITICAL NOTES
- **Bold key points** with brief explanations
- Gotchas and edge cases
- Things that will break if done wrong
</critical_notes>

<workflow>
## WORKFLOW
1. **Find interface** in `/shared/interfaces/market-data-provider.ts`
2. **Create directory** `/integrations/providers/YourProvider/`
3. **Create files** implement provider interface and rate limiting per `/integrations/providers/CLAUDE.md`
</workflow>

<Codebase_Conventions>

#### Writing Style
- **Terse but complete**: Every word matters
- **Present tense**: "Store manages state" not "Store will manage"
- **Active voice**: "Use this pattern" not "This pattern should be used"
- **Imperatives for rules**: "MUST", "NEVER", "ALWAYS"

## Build/Lint/Test Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Lint fix: `npm run lintfix`
- Format: `npm run format`
- Dev watch: `npm run dev`
- Single test: No test scripts defined

## Code Style
- TypeScript strict mode enabled
- Target: ES2020
- Module system: CommonJS
- No implicit any types allowed
- Explicit function return types not required

## Formatting
- Prettier with single quotes, tabs, semicolons
- Print width: 100
- Trailing commas: all
- Tab width: 2

## Imports
- ESModule interop enabled
- Resolve JSON modules allowed
- Use relative paths for internal modules
- Import order: external libraries first, then internal

## Naming Conventions
- PascalCase for classes, interfaces, types
- camelCase for variables, functions, methods
- UPPER_SNAKE_CASE for constants
- Descriptive names over abbreviations

## Error Handling
- Use TypeScript's strict null checks
- Handle errors explicitly with try/catch where appropriate
- Prefer early returns for error conditions

## Types
- Strict typing required
- Avoid explicit 'any' (configured as warning)
- Use interfaces for object shapes
- Use types for unions and primitives
</Codebase_Conventions>