const http = require('http');
const fs = require('fs');

// Generate random amount between 10000 (₹100) and 200000 (₹2000)
const randomAmount = Math.floor(Math.random() * (200000 - 10000 + 1) + 10000);
console.log(`Generating Order for ₹${randomAmount / 100}...`);

const data = JSON.stringify({
    amount: randomAmount,
    currency: 'INR'
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
        console.log('Body:', body);
        try {
            const match = body.match(/"id":"(order_[a-zA-Z0-9]+)"/);
            if (match) {
                fs.writeFileSync('order_id.txt', match[1]);
                console.log('\n---------------------------------------------------');
                console.log(`✅ Order Created! Amount: ₹${randomAmount / 100}`);
                console.log(`🔗 CLICK HERE TO PAY: http://localhost:3002/checkout?order_id=${match[1]}`);
                console.log('---------------------------------------------------\n');
            } else {
                console.log('No ID found in:', body);
            }
        } catch (e) {
            console.error(e);
        }
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
