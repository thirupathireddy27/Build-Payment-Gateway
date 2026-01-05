# Payment Gateway

A comprehensive payment gateway simulation including a RESTful API, Merchant Dashboard, and Hosted Checkout Page.

## Prerequisites

- Docker and Docker Compose

## Quick Start

1.  **Clone the repository** (if you haven't already).
2.  **Start the services**:
    ```bash
    docker-compose up -d
    ```
3.  **Access the applications**:
    - **API Health Check**: `http://localhost:8000/health`
    - **Merchant Dashboard**: `http://localhost:3000` (Login with `test@example.com` / any password)
    - **Checkout Page**: `http://localhost:3001/checkout?order_id=<ORDER_ID>`

## Architecture

- **Backend (Node.js/Express)**: Handles order creation, payment processing, and validation.
- **Database (PostgreSQL)**: Stores merchants, orders, and payment records.
- **Frontend Dashboard (React)**: Merchant interface for viewing transactions and API credentials.
- **Checkout Page (React)**: Customer interface for making payments.

## Testing

The system comes pre-seeded with a Test Merchant:
- **Email**: `test@example.com`
- **API Key**: `key_test_abc123`
- **API Secret**: `secret_test_xyz789`

You can use these credentials to create orders via the API.
