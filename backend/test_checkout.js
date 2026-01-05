const http = require('http');

const orderId = 'order_DtiuP4lMCLc7Rolv'; // From previous step

// 1. Fetch Order Publicly
const getOrder = () => {
    http.get(`http://localhost:8000/api/v1/orders/${orderId}/public`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log('Public Order:', body);
            createPayment();
        });
    }).on('error', e => console.error(e));
};

// 2. Create Payment Publicly
const createPayment = () => {
    const data = JSON.stringify({
        order_id: orderId,
        method: 'card',
        card: {
            number: '4111111111111111',
            expiry_month: '12',
            expiry_year: '2030',
            cvv: '123',
            holder_name: 'Test Script'
        }
    });

    const options = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/v1/payments/public',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('Creating Payment...');
    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => console.log('Payment Response:', body));
    });
    req.write(data);
    req.end();
};

getOrder();
