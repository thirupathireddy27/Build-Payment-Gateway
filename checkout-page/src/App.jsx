import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/checkout" element={<Checkout />} />
                {/* Fallback to checkout if root is accessed but it requires query param usually */}
                <Route path="*" element={<Checkout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
