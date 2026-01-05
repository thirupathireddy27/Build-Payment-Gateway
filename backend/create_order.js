const http = require('http');

const data = JSON.stringify({
    amount: 5000,
    currency: 'INR',
    receipt: 'receipt_123',
    notes: { test: 'script' }
});

const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Api-Key': 'key_test_abc123',
        'X-Api-Secret': 'secret_test_xyz789'
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log(body)); // Output the JSON
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
