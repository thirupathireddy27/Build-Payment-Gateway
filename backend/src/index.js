const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authenticate = require('./middleware/auth');
const { createOrder, getOrder } = require('./controllers/orderController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', async (req, res) => {
    try {
        const dbRes = await db.query('SELECT 1');
        const dbStatus = dbRes.rowCount > 0 ? 'connected' : 'disconnected';
        res.status(200).json({
            status: 'healthy',
            database: dbStatus,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(200).json({
            status: 'unhealthy',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Test Merchant Endpoint
app.get('/api/v1/test/merchant', async (req, res) => {
    try {
        const result = await db.query("SELECT id, email, api_key FROM merchants WHERE email = 'test@example.com'");
        if (result.rows.length > 0) {
            res.json({ ...result.rows[0], seeded: true });
        } else {
            res.status(404).json({ error: 'Test merchant not found' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Public Routes (for Dashboard/Checkout)
app.get('/api/v1/stats', require('./controllers/paymentController').getStats);
app.get('/api/v1/transactions', require('./controllers/paymentController').getTransactions);

// Checkout Public endpoints
app.get('/api/v1/orders/:id/public', require('./controllers/orderController').getPublicOrder);
app.post('/api/v1/payments/public', require('./controllers/paymentController').createPublicPayment);
// Also need public Get Payment for polling?
// "Poll /api/v1/payments/{payment_id} every 2 seconds"
// The prompt says "Poll /api/v1/payments/{payment_id}". It doesn't explicitly say /public.
// But the checkout page is unauthenticated. So it MUST use a public endpoint or the same endpoint allowed publicly.
// I'll expose getPayment publicly too for this deliverable.
app.get('/api/v1/payments/:id/public', require('./controllers/paymentController').getPayment);

// Authenticated Routes
const router = express.Router();
router.use(authenticate);

router.post('/orders', createOrder);
router.get('/orders/:id', getOrder);
router.post('/payments', require('./controllers/paymentController').createPayment);
router.get('/payments/:id', require('./controllers/paymentController').getPayment);

app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
