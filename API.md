# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

## Authentication
Most admin endpoints require authentication. Users must be logged in and have admin privileges.

## Public Endpoints

### Get Puja Schedule
```
GET /api/puja-schedule
```

Returns upcoming puja events.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Morning Puja",
    "description": "Daily morning prayers",
    "date": "2024-01-15",
    "time": "06:00:00",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

## Donation Endpoints

### Create Order
```
POST /api/create-order
```

Creates a Razorpay order for donation.

**Request Body:**
```json
{
  "amount": 1000,
  "note": "Optional donation note"
}
```

**Response:**
```json
{
  "orderId": "order_xxx",
  "amount": 1000,
  "key": "razorpay_key_id",
  "donationId": "uuid"
}
```

### Verify Payment
```
POST /api/verify-payment
```

Verifies Razorpay payment signature and completes donation.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature",
  "donationId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "receiptUrl": "https://...",
  "donation": {
    "id": "uuid",
    "amount": 1000,
    "paymentId": "pay_xxx",
    "status": "completed"
  }
}
```

### Webhook
```
POST /api/webhook
```

Razorpay webhook endpoint for payment status updates.

**Headers:**
- `x-razorpay-signature`: Webhook signature

**Request Body:**
Razorpay webhook payload (see Razorpay documentation)

## Admin Endpoints

### Get All Donations
```
GET /api/admin/donations
```

Returns all donations with donor information.

**Response:**
```json
[
  {
    "id": "uuid",
    "amount": 1000,
    "razorpay_payment_id": "pay_xxx",
    "razorpay_order_id": "order_xxx",
    "status": "completed",
    "note": "Donation note",
    "created_at": "2024-01-01T00:00:00Z",
    "completed_at": "2024-01-01T00:00:00Z",
    "donors": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+911234567890"
    }
  }
]
```

### Record Offline Donation
```
POST /api/admin/offline-donation
```

Records an offline/bank donation.

**Request Body:**
```json
{
  "donorName": "John Doe",
  "amount": "1000",
  "bankTxnId": "TXN123456",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "donation": { ... }
}
```

### Get Puja Events
```
GET /api/admin/puja-events
```

Returns all puja events (admin view).

### Create Puja Event
```
POST /api/admin/puja-events
```

Creates a new puja event.

**Request Body:**
```json
{
  "title": "Morning Puja",
  "description": "Daily morning prayers",
  "date": "2024-01-15",
  "time": "06:00:00"
}
```

### Update Puja Event
```
PUT /api/admin/puja-events/[id]
```

Updates an existing puja event.

**Request Body:**
```json
{
  "title": "Morning Puja",
  "description": "Daily morning prayers",
  "date": "2024-01-15",
  "time": "06:00:00"
}
```

### Delete Puja Event
```
DELETE /api/admin/puja-events/[id]
```

Deletes a puja event.

### Add Admin
```
POST /api/admin/add-admin
```

Adds a new admin user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "phone": "+911234567890"
}
```

### Update Temple Contact
```
PUT /api/admin/temple-contact
```

Updates temple contact information.

**Request Body:**
```json
{
  "email": "temple@example.com",
  "phone": "+911234567890"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

