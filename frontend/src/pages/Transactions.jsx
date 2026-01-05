import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Transactions = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/transactions'); // Need to implement
                if (res.ok) {
                    const data = await res.json();
                    setPayments(data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Transactions</h1>
                <Link to="/dashboard" style={{ color: 'white' }}>Back to Dashboard</Link>
            </header>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table data-test-id="transactions-table">
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Order ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id} data-test-id="transaction-row" data-payment-id={p.id}>
                                <td data-test-id="payment-id" style={{ fontFamily: 'monospace' }}>{p.id}</td>
                                <td data-test-id="order-id" style={{ fontFamily: 'monospace' }}>{p.order_id}</td>
                                <td data-test-id="amount">{(p.amount / 100).toFixed(2)}</td>
                                <td data-test-id="method">{p.method}</td>
                                <td data-test-id="status">
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        background: p.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: p.status === 'success' ? '#10b981' : '#ef4444'
                                    }}>
                                        {p.status}
                                    </span>
                                </td>
                                <td data-test-id="created-at">{new Date(p.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
