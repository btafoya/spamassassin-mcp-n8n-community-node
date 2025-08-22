# Testing HTTP Methods with n8n

This guide explains how to test various HTTP methods using n8n, with configuration from environment variables.

## Prerequisites

- Node.js (for the Node.js test script)
- curl (for the bash test script)
- Environment variables set:
  - `N8N_API_URL`: The URL of your n8n instance
  - `N8N_API_KEY`: The API key for your n8n instance (optional)

## Environment Setup

The scripts in this repository use the following environment variables:

1. `N8N_API_URL` - The URL of your n8n instance (defaults to https://n8n.tafoyaventures.com if not set)
2. `N8N_API_KEY` - The API key for authentication with your n8n instance (optional)

Set these environment variables in your shell:

```bash
export N8N_API_URL=https://n8n.tafoyaventures.com
export N8N_API_KEY=your_api_key_here
```

## Importing Workflows

This repository contains two example workflows:

1. `http-test-workflow.json` - A simple workflow demonstrating a GET request
2. `comprehensive-http-workflow.json` - A workflow demonstrating multiple HTTP methods

To import these workflows:

1. Open n8n in your browser using the URL in `N8N_API_URL`
2. Click on "Workflows" in the left sidebar
3. Click the "+" button to create a new workflow
4. Click on "Import from file"
5. Select one of the JSON files from this repository

## Testing HTTP Methods

### Webhook Triggers

The workflows include webhook triggers that listen for different HTTP methods:

1. **GET Request Test**
   - URL: `$N8N_API_URL/webhook/test-get`
   - Method: GET

2. **POST Request Test**
   - URL: `$N8N_API_URL/webhook/test-post`
   - Method: POST
   - You can send JSON data in the request body

### HTTP Request Nodes

The workflows also include HTTP Request nodes that demonstrate how to make different types of HTTP requests:

1. **GET Request**
   - Makes a GET request to https://httpbin.org/get

2. **POST Request**
   - Makes a POST request to https://httpbin.org/post
   - Sends JSON data in the request body

3. **PUT Request**
   - Makes a PUT request to https://httpbin.org/put
   - Sends JSON data in the request body

4. **DELETE Request**
   - Makes a DELETE request to https://httpbin.org/delete

## Testing the Workflows

### Using the Node.js Script

Run the Node.js test script:

```bash
node test-http-methods.js
```

The script will automatically use the `N8N_API_URL` and `N8N_API_KEY` environment variables.

### Using the Bash Script

Run the bash test script:

```bash
./test-http-methods.sh
```

The script will automatically use the `N8N_API_URL` and `N8N_API_KEY` environment variables.

### Manual Testing with curl

You can also test manually using curl:

```bash
# Test GET webhook
curl -X GET $N8N_API_URL/webhook/test-get

# Test POST webhook with data
curl -X POST $N8N_API_URL/webhook/test-post \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello n8n"}'

# If you have an API key, include it:
curl -X GET $N8N_API_URL/webhook/test-get \
     -H "Authorization: Bearer $N8N_API_KEY"
```

## HTTP Methods Supported

n8n supports all standard HTTP methods:

- GET
- POST
- PUT
- DELETE
- PATCH
- HEAD
- OPTIONS

You can configure these in both Webhook triggers and HTTP Request nodes.

## Authentication

n8n supports various authentication methods for HTTP requests:

- Basic Auth
- Header Auth
- JWT Auth
- OAuth1/OAuth2
- And many others

These can be configured in the HTTP Request node under the "Authentication" section.

## Troubleshooting

If you encounter issues:

1. Verify that the environment variables are set correctly:
   ```bash
   echo $N8N_API_URL
   echo $N8N_API_KEY
   ```

2. Ensure that you can access the n8n instance in your browser

3. Verify that you've activated the workflow before testing

4. Check that your n8n instance has a valid SSL certificate if using HTTPS

5. Make sure your API key has the necessary permissions

6. Check the n8n logs for any error messages