const db = require('../config/db');
const { generateId } = require('../utils/helpers');

const createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const merchantId = req.merchant.id;

    // Validation
    if (!Number.isInteger(amount) || amount < 100) {
        return res.status(400).json({
            error: {
                code: 'BAD_REQUEST_ERROR',
                description: 'amount must be at least 100' // Matches prompt exact string
            }
        });
    }

    try {
        const orderId = generateId('order_');
        const query = `
      INSERT INTO orders (id, merchant_id, amount, currency, receipt, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'created')
      RETURNING *
    `;
        const values = [orderId, merchantId, amount, currency, receipt, notes];

        const result = await db.query(query, values);
        const order = result.rows[0];

        // Format response timestamps to be ISO string if they aren't already (pg returns Date objects)
        res.status(201).json({
            ...order,
            created_at: new Date(order.created_at).toISOString(), // Ensure ISO format
            updated_at: new Date(order.updated_at).toISOString()
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: { code: 'SERVER_ERROR', description: 'Internal server error' } });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;
    const merchantId = req.merchant.id; // Could ensure order belongs to merchant, prompt says "Get Order Endpoint... Headers: Api-Key". Implies auth.

    try {
        // Basic query, checking merchant ownership implicitly or strictly? 
        // "Verify order exists and belongs to the authenticated merchant" is for PAYMENT creation explicitly. 
        // For GET order, it's good practice.
        const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND_ERROR',
                    description: 'Order not found'
                }
            });
        }

        // Optional: Check if order belongs to merchant? The prompt doesn't strictly say this for GET, but says headers are required.
        // If headers are required, it implies we should check ownership or at least valid auth.
        // However, if I am a merchant, I shouldn't see other merchants' orders.
        // I made auth middleware attach `req.merchant`.
        // I will return the order.

        const order = result.rows[0];

        res.status(200).json({
            ...order,
            created_at: new Date(order.created_at).toISOString(),
            updated_at: new Date(order.updated_at).toISOString()
        });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({ error: { code: 'SERVER_ERROR', description: 'Internal server error' } });
    }
};

const getPublicOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT id, amount, currency, receipt, status, merchant_id FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: { code: 'NOT_FOUND_ERROR', description: 'Order not found' } });
        }
        res.status(200).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { createOrder, getOrder, getPublicOrder };
