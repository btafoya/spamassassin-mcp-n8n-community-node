const https = require('https');

// Configuration from environment variables
const N8N_URL = process.env.N8N_API_URL || 'https://n8n.tafoyaventures.com';
const N8N_API_KEY = process.env.N8N_API_KEY;

// Test data
const testData = {
  message: 'Hello from HTTP test',
  timestamp: new Date().toISOString(),
  method: 'POST'
};

// Function to make HTTP requests
function makeRequest(url, method, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_API_KEY ? {'Authorization': `Bearer ${N8N_API_KEY}`} : {}),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test different HTTP methods
async function testHTTPMethods() {
  console.log('Testing HTTP methods with n8n...');
  console.log('=================================');
  console.log(`Using n8n instance: ${N8N_URL}\n`);
  
  // Check if API key is available
  if (N8N_API_KEY) {
    console.log('API key found, including in requests\n');
  } else {
    console.log('No API key found, making requests without authentication\n');
  }
  
  try {
    // Test GET request
    console.log('1. Testing GET request...');
    const getResponse = await makeRequest(`${N8N_URL}/webhook/test-get`, 'GET');
    console.log(`   Status: ${getResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(getResponse.data, null, 2)}\n`);
    
    // Test POST request
    console.log('2. Testing POST request...');
    const postResponse = await makeRequest(`${N8N_URL}/webhook/test-post`, 'POST', testData);
    console.log(`   Status: ${postResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(postResponse.data, null, 2)}\n`);
    
    // Test PUT request
    console.log('3. Testing PUT request...');
    const putResponse = await makeRequest(`${N8N_URL}/webhook/test-put`, 'PUT', testData);
    console.log(`   Status: ${putResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(putResponse.data, null, 2)}\n`);
    
    // Test DELETE request
    console.log('4. Testing DELETE request...');
    const deleteResponse = await makeRequest(`${N8N_URL}/webhook/test-delete`, 'DELETE');
    console.log(`   Status: ${deleteResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(deleteResponse.data, null, 2)}\n`);
    
  } catch (error) {
    console.error('Error testing HTTP methods:', error.message);
  }
}

// Run the tests
testHTTPMethods();