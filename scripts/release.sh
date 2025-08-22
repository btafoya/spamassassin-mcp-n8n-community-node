#!/bin/bash

set -e

# Get the current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "Current version: $CURRENT_VERSION"

# Determine version part to increment (major, minor, patch)
VERSION_PART=${1:-patch}

# Use npm to increment the version
NEW_VERSION=$(npm version $VERSION_PART --json | jq -r '.version')

echo "New version: $NEW_VERSION"

# Build the project
echo "Building project..."
npm run build

# Create and push tag
echo "Creating and pushing tag..."
git push origin main
git push origin v$NEW_VERSION

echo "Release v$NEW_VERSION created and pushed!"
echo "GitHub Actions will now publish to npm."