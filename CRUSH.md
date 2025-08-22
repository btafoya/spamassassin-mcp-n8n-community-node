# Codebase Conventions

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