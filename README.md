# Go By Bus - Backend API Documentation

A Node.js/Express backend for a bus transportation management system.

## Features

- User Authentication (OTP-based)
- Bus Management for Drivers
- Bus Schedule Management
- Bus Search System
- Favorite Bus System for Users

## API Endpoints

### Authentication and User Management
- `POST /api/auth/get-email` - Request OTP for login/registration
  ```json
  {
    "email": "user@example.com"
  }
  ```
  Response: OTP sent to email

- `POST /api/auth/verify-otp` - Verify OTP and get authentication token
  ```json
  {
    "otp": "123456"
  }
  ```
  Response:
  ```json
  {
    "success": true,
    "user": {
      "_id": "userId",
      "email": "user@example.com",
      "name": null,
      "role": "passenger",
      "isEmailVerified": true,
      "token": "jwt_token"
    },
    "message": "OTP verified successfully"
  }
  ```

- `POST /api/auth/update-profile` - Update user profile details (Protected)
  ```json
  {
    "name": "John Doe",
    "bio": "Regular commuter",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    }
  }
  ```
  Response:
  ```json
  {
    "success": true,
    "user": {
      // Updated user object
    },
    "message": "Profile updated successfully"
  }
  ```

- `POST /api/auth/logout` - Logout user (Protected)
  - No request body needed
  Response:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### User Flow
1. **New User Registration**:
   - User submits email → System sends OTP
   - User verifies OTP → Gets JWT token
   - User updates profile with additional details

2. **Existing User Login**:
   - User submits email → System sends OTP
   - User verifies OTP → Gets JWT token
   - Profile details already exist

3. **Authentication**:
   - All protected routes require JWT token in headers
   - Header format: `{ "token": "your-jwt-token" }`
   - Token is invalidated on logout

### Bus Management (Driver Only)
- `POST /api/bus/create`
  ```json
  {
    "name": "Express Shuttle",
    "licenseNumber": "WB75AC1234",
    "busNumber": "B-421",
    "aadharNumber": 123456789012
  }
  ```

- `GET /api/bus/my-buses`
  - Returns all buses owned by the authenticated driver

- `PUT /api/bus/update/:id`
  ```json
  {
    "name": "Updated Name",
    "licenseNumber": "Updated License"
  }
  ```

- `DELETE /api/bus/delete/:id`
  - Deletes the bus and its associated schedules

### Bus Schedules
- `POST /api/schedule/create` (Protected - Driver Only)
  ```json
  {
    "busId": "busId",
    "scheduleStops": [
      {
        "standName": "City Center",
        "arrivalTime": "09:00"
      },
      {
        "standName": "Airport Terminal",
        "arrivalTime": "10:30"
      }
    ]
  }
  ```
  Notes:
  - Stands will be automatically created if they don't exist
  - New stands are created with default distance and price (0)
  - Times must be in HH:mm format
  - Stops must be in chronological order

- `GET /api/schedule/bus/:busId`
  - Returns detailed schedule for a specific bus

- `GET /api/schedule/search?source=sourceId&destination=destId`
  - Search buses between source and destination
  - Returns available buses with timing and duration

- `GET /api/schedule/stands`
  - Returns a list of all stands

### User Features
- `POST /api/user/favorites/add`
  ```json
  {
    "busId": "busId"
  }
  ```

- `GET /api/user/favorites`
  - Returns user's favorite buses

- `DELETE /api/user/favorites/:busId`
  - Removes a bus from favorites

## Sample Response Formats

### Bus Search Response
```json
{
  "success": true,
  "schedules": [
    {
      "bus": {
        "_id": "busId",
        "name": "Express Shuttle",
        "busNumber": "B-421"
      },
      "sourceTime": "09:00",
      "destinationTime": "10:30",
      "duration": "1h 30m",
      "schedule": [
        {
          "stand": {
            "name": "Ghatal",
            "distance": 0
          },
          "arrivalTime": "09:00"
        },
        {
          "stand": {
            "name": "Midnapore",
            "distance": 25
          },
          "arrivalTime": "10:30"
        }
      ]
    }
  ]
}
```

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Data Models

### User
- Name (optional)
- Email (required, unique)
- Role (passenger/driver/admin)
- Favorite Buses (array of bus IDs)

### Bus
- Name
- License Number
- Bus Number
- Aadhar Number
- Owner (User ID)

### Bus Schedule
- Bus (reference)
- Schedule Array:
  - Stand (reference)
  - Arrival Time

### Stand
- Name
- Distance
- Price

## Additional API Endpoints

### Stand Management
- `GET /api/schedule/stands/:id` - Get stand details by ID
  ```json
  Response:
  {
    "success": true,
    "stand": {
      "_id": "standId",
      "name": "Stand Name",
      "distance": 10,
      "price": 50
    }
  }
  ```

- `PUT /api/schedule/stands/:id` (Admin Only) - Update stand details
  ```json
  Request:
  {
    "name": "Updated Stand Name",
    "distance": 15,
    "price": 75
  }
  ```

- `DELETE /api/schedule/stands/:id` (Admin Only) - Delete a stand
  ```json
  Response:
  {
    "success": true,
    "message": "Stand deleted successfully"
  }
  ```

### Bus Management
- `GET /api/bus/:id` (Authenticated) - Get bus details by ID
  ```json
  Response:
  {
    "success": true,
    "bus": {
      "_id": "busId",
      "name": "Express Shuttle",
      "licenseNumber": "WB75AC1234",
      "busNumber": "B-421",
      "owner": "userId"
    }
  }
  ```

### User Management (Admin Only)
- `GET /api/user/all` - Get all users
  ```json
  Response:
  {
    "success": true,
    "users": [
      {
        "_id": "userId",
        "name": "User Name",
        "email": "user@example.com",
        "role": "passenger"
      }
    ]
  }
  ```

- `DELETE /api/user/:id` - Delete a user
  ```json
  Response:
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

### Schedule Management
- `DELETE /api/schedule/bus/:busId` (Bus Owner Only) - Delete a bus schedule
  ```json
  Response:
  {
    "success": true,
    "message": "Schedule deleted successfully"
  }
  ```

### send feedback/issue
- `POST /api/feedback` (Bus Owner Only) - Delete a bus schedule
  ```json
  req body:
  {
    "adminEmail": "admin@example.com",
    "message": "I have a issue with my GF bro, fix this asap."
  }
  ```

## Access Levels
- **Public:** No authentication required
- **Authenticated:** Valid JWT token required
- **Bus Owner:** Must be authenticated and own the bus
- **Admin:** Must be authenticated with admin role
