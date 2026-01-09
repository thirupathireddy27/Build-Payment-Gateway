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
    res.on('end', () => {
        try {
            const responseJson = JSON.parse(body);
            console.log(responseJson); // Output the parsed JSON
            if (responseJson && responseJson.id) {
                fs.writeFileSync('current_order_id.txt', responseJson.id);
                console.log(`Order ID ${responseJson.id} written to current_order_id.txt`);
            } else {
                console.warn('Response body does not contain an "id" field or is not valid JSON.');
            }
        } catch (parseError) {
            console.error('Failed to parse response body as JSON:', parseError);
            console.log('Raw response body:', body); // Log raw body if parsing fails
        }
    });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
