# User Authentication API

This API provides endpoints for user email verification via OTP (One-Time Password).

## Features

- Email-based user registration/authentication
- OTP generation and email delivery
- OTP verification with expiration (10 minutes)
- JWT token generation upon successful verification

## API Endpoints

### 1. Get User Email and Send OTP

**Endpoint:** `POST /api/auth/get-email`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
- Success:
  ```json
  {
    "success": true,
    "message": "OTP sent to user@example.com successfully"
  }
  ```
- Error:
  ```json
  {
    "error": "Error message",
    "success": false
  }
  ```

### 2. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
- Success:
  ```json
  {
        "user": {
            "_id": "680491376df08b8ad489ded7",
            "email": "saniyajmallik66@gmail.com",
            "isEmailVerified": true,
            "role": "passenger",
            "__v": 0,
            "verifyEmailOTP": "732069",
            "verifyEmailOTPExpire": "2025-04-20T06:26:23.439Z",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA0OTEzNzZkZjA4YjhhZDQ4OWRlZDciLCJpYXQiOjE3NDUxMjk5MDZ9.ZMrFwlUy_WsSjlsV0UdV4r3k5tjYv8Cj4E5W89B7SAo"
        },
        "success": true,
        "message": "OTP verified successfully"
    }
  ```
- Error (invalid OTP):
  ```json
  {
    "success": false,
    "message": "User does not exists."
  }
  ```
- Error (expired OTP):
  ```json
  {
    "success": false,
    "message": "OTP expired, Try again."
  }
  ```
