import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Test merchant credentials
        if (email === 'test@example.com') {
            // Allow any password as per deliverable 1
            localStorage.setItem('merchant_auth', JSON.stringify({ email }));
            navigate('/dashboard');
        } else {
            alert('Invalid credentials. Use test@example.com');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Merchant Login</h2>
                <form data-test-id="login-form" onSubmit={handleLogin}>
                    <input
                        data-test-id="email-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        data-test-id="password-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button data-test-id="login-button" type="submit">
                        Login
                    </button>
                </form>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center' }}>
                    Test Email: test@example.com<br />
                    Password: any
                </div>
            </div>
        </div>
    );
};

export default Login;
