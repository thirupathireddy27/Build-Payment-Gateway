import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [order, setOrder] = useState(null);
    const [method, setMethod] = useState(null); // 'upi' or 'card'
    const [status, setStatus] = useState('initial'); // initial, processing, success, failed
    const [paymentId, setPaymentId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Form States
    const [vpa, setVpa] = useState('');
    const [cardDetails, setCardDetails] = useState({
        number: '', expiry: '', cvv: '', holder: ''
    });

    useEffect(() => {
        if (orderId) {
            fetch(`http://localhost:8000/api/v1/orders/${orderId}/public`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error.description);
                    setOrder(data);
                })
                .catch(err => console.error(err));
        }
    }, [orderId]);

    const pollStatus = (pid) => {
        const interval = setInterval(() => {
            fetch(`http://localhost:8000/api/v1/payments/${pid}/public`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        setStatus('success');
                        clearInterval(interval);
                    } else if (data.status === 'failed') {
                        setStatus('failed');
                        setErrorMsg(data.error_description || 'Payment Failed');
                        clearInterval(interval);
                    }
                })
                .catch(e => console.error(e));
        }, 2000);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setStatus('processing');

        const payload = {
            order_id: orderId,
            method,
        };

        if (method === 'upi') {
            payload.vpa = vpa;
        } else {
            const [month, year] = cardDetails.expiry.split('/');
            payload.card = {
                number: cardDetails.number,
                expiry_month: month,
                expiry_year: year,
                cvv: cardDetails.cvv,
                holder_name: cardDetails.holder
            };
        }

        try {
            const res = await fetch('http://localhost:8000/api/v1/payments/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.error) {
                setStatus('failed');
                setErrorMsg(data.error.description);
                return;
            }

            setPaymentId(data.id);

            // If API returns final status immediately (synchronous wait implemented in backend)
            if (data.status === 'success') {
                setStatus('success');
            } else if (data.status === 'failed') {
                setStatus('failed');
                setErrorMsg(data.error_description);
            } else {
                // Still processing? Start polling
                pollStatus(data.id);
            }

        } catch (err) {
            setStatus('failed');
            setErrorMsg(err.message);
        }
    };

    if (!order) return <div className="card">Loading Order...</div>;

    return (
        <div className="card" data-test-id="checkout-container">

            {/* Order Summary */}
            {(status === 'initial' || status === 'processing') && (
                <div data-test-id="order-summary" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginTop: 0 }}>Complete Payment</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Amount:</span>
                        <span data-test-id="order-amount" style={{ fontWeight: 'bold' }}>₹{(order.amount / 100).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Order ID:</span>
                        <span data-test-id="order-id" style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{order.id}</span>
                    </div>
                </div>
            )}

            {/* Payment Method Selection */}
            {status === 'initial' && !method && (
                <div data-test-id="payment-methods" style={{ display: 'grid', gap: '1rem' }}>
                    <button data-test-id="method-upi" data-method="upi" onClick={() => setMethod('upi')}>
                        Pay with UPI
                    </button>
                    <button data-test-id="method-card" data-method="card" onClick={() => setMethod('card')} style={{ background: 'transparent', border: '1px solid var(--accent)' }}>
                        Pay with Card
                    </button>
                </div>
            )}

            {/* UPI Form */}
            {status === 'initial' && method === 'upi' && (
                <form data-test-id="upi-form" onSubmit={handlePayment}>
                    <input
                        data-test-id="vpa-input"
                        placeholder="username@bank"
                        value={vpa}
                        onChange={e => setVpa(e.target.value)}
                        required
                    />
                    <button data-test-id="pay-button" type="submit">
                        Pay ₹{(order.amount / 100).toFixed(2)}
                    </button>
                    <button type="button" onClick={() => setMethod(null)} style={{ background: 'transparent', marginTop: '0.5rem', fontSize: '0.875rem' }}>Change Method</button>
                </form>
            )}

            {/* Card Form */}
            {status === 'initial' && method === 'card' && (
                <form data-test-id="card-form" onSubmit={handlePayment}>
                    <input
                        data-test-id="card-number-input"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                        required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            data-test-id="expiry-input"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            required
                        />
                        <input
                            data-test-id="cvv-input"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        data-test-id="cardholder-name-input"
                        placeholder="Name on Card"
                        value={cardDetails.holder}
                        onChange={e => setCardDetails({ ...cardDetails, holder: e.target.value })}
                        required
                    />
                    <button data-test-id="pay-button" type="submit">
                        Pay ₹{(order.amount / 100).toFixed(2)}
                    </button>
                    <button type="button" onClick={() => setMethod(null)} style={{ background: 'transparent', marginTop: '0.5rem', fontSize: '0.875rem' }}>Change Method</button>
                </form>
            )}

            {/* Processing State */}
            <div data-test-id="processing-state" style={{ display: status === 'processing' ? 'block' : 'none', textAlign: 'center' }}>
                <div className="spinner"></div>
                <span data-test-id="processing-message">Processing payment...</span>
            </div>

            {/* Success State */}
            <div data-test-id="success-state" style={{ display: status === 'success' ? 'block' : 'none', textAlign: 'center' }}>
                <h2 style={{ color: '#10b981' }}>Payment Successful!</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <span>Payment ID: </span>
                    <span data-test-id="payment-id">{paymentId}</span>
                </div>
                <span data-test-id="success-message">Your payment has been processed successfully</span>
            </div>

            {/* Error State */}
            <div data-test-id="error-state" style={{ display: status === 'failed' ? 'block' : 'none', textAlign: 'center' }}>
                <h2 style={{ color: '#ef4444' }}>Payment Failed</h2>
                <span data-test-id="error-message" style={{ display: 'block', marginBottom: '1rem' }}>{errorMsg || 'Payment could not be processed'}</span>
                <button data-test-id="retry-button" onClick={() => { setStatus('initial'); setMethod(null); }}>Try Again</button>
            </div>

        </div>
    );
};

export default Checkout;
